import path from 'path';
import { fileURLToPath } from 'url';

import sha from "js-sha512";

import express from "express";
import Database from "@creamy-dev/1udb";

import { genToken } from './libs/genToken.mjs';
import { syncRunners } from './libs/syncRunners.mjs';

import * as login from "./src/users/login.mjs";

import * as add from "./src/tunnels/add.mjs";
import * as rm from "./src/tunnels/remove.mjs";
import * as get from "./src/tunnels/get.mjs";
import * as start from "./src/tunnels/start.mjs";
import * as stop from "./src/tunnels/stop.mjs";

// Node.JS Modules don't have __dirname or __filename, so I had to settle for this.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const db = new Database(__dirname + "/db.json");
await db.serialize();

if (!(await db.get("users"))) {
  console.log("Welcome to Passyfire! Attempting to create an account...");

  const username = process.env.PF_SET_USERNAME;
  const password = process.env.PF_SET_PASSWORD;

  if (!username || !password) {
    console.log(" - Error! Failed to get the username and password to use.");
    console.log(" - To solve this, set the following environment variables:")
    console.log("   - PF_SET_USERNAME to your username");
    console.log("   - PF_SET_PASSWORD to your password");

    process.exit(1);
  }

  const user = {
    username: username,
    password: sha.sha512(password), // TODO: bcrypt
    token: genToken(username),
    permissions: {
      hasAll: true,
      users: {
        hasAll: true,
        add: true,
        remove: true
      },
      routes: {
        hasAll: true,
        add: true,
        remove: true,
        start: true,
        stop: true
      }
    }
  }

  await db.add("users", JSON.stringify([user]));

  console.log(" - Successfully created.");
}

if (!(await db.get("tunnels"))) {
  await db.add("tunnels", JSON.stringify([]));
}

const appState = {
  tunnels: {
    list: JSON.parse(await db.get("tunnels")).map((i) => { 
      i.running = true;
      return i;
    }),
    runners: [] // FIXME: When I put syncRunners here, it don't work. Bruh?
  }
};

async function syncRunnersEx() {
  console.log("INFO: Syncing data.");
  console.log(" - Killing children...");

  for (const i of appState.tunnels.runners) {
    await i.proxy.proxy.close();
    await i.wss.close();
  }

  console.log(" - Syncing runners...");

  appState.tunnels.runners = await syncRunners(appState.tunnels.list);
}

await syncRunnersEx();

// ./pages
app.use(express.static("./pages/"));

// ./src/users
app.use(await login.main(db, appState, syncRunnersEx));

// ./src/tunnels
app.use(await add.main(db, appState, syncRunnersEx));
app.use(await rm.main(db, appState, syncRunnersEx));
app.use(await get.main(db, appState, syncRunnersEx));
app.use(await start.main(db, appState, syncRunnersEx));
app.use(await stop.main(db, appState, syncRunnersEx));

app.listen(8000); 