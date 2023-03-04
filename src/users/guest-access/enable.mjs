import sha from "js-sha512";
import { genToken } from "../../../libs/genToken.mjs";

import { getScopesAllDisabled } from "../../../libs/noScope.mjs";

import express from "express";

export async function main(db) {
  const app = express.Router();
  const scopes = getScopesAllDisabled();

  app.post("/api/v1/users/guest-access/enable", async(req, res) => {
    const users = JSON.parse(await db.get("users"));

    if (!req.body.token) {
      return res.status(400).send(JSON.stringify({
        error: "Invalid token"
      }))
    }

    const userVerify = users.find((i) => i.token == req.body.token);
    if (!userVerify) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid token"
      }))
    }

    if (!userVerify.permissions.users.add) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid scope(s)"
      }));
    }

    const userData = {
      username: "guest",
      password: sha.sha512("guest"),
      token: genToken("guest"),
      permissions: scopes
    }

    users.push(userData);
    await db.changeValue("users", JSON.stringify(users));

    return res.send(JSON.stringify({
      success: true
    }));
  });

  return app;
}