import sha from "js-sha512";
import { genToken } from "../../libs/genToken.mjs";

import { getScopesAllEnabled } from "../../libs/noScope.mjs";

import express from "express";
import { mergeDeep } from "../../libs/deepMergeObj.mjs";

export async function main(db) {
  const app = express.Router();
  const defaultScopes = getScopesAllEnabled();

  app.post("/api/v1/users/add", async(req, res) => {
    const users = JSON.parse(await db.get("users"));

    if (!req.body.username || !req.body.password) {
      return res.status(400).send(JSON.stringify({
        error: "Username or password not specified"
      }));
    } else if (!req.body.permissions || typeof req.body.permissions != "object") {
      return res.status(403).send(JSON.stringify({
        error: "No permissions specified"
      }))
    } else if (!req.body.token) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid token"
      }))
    }

    const userVerify = users.find((i) => i.token == req.body.token);
    if (!userVerify) {
      return res.status(400).send(JSON.stringify({
        error: "Invalid token"
      }))
    }

    if (!userVerify.permissions.hasAll && !userVerify.permissions.users.hasAll && !userVerify.users.add) {
      return res.status(400).send(JSON.stringify({
        error: "Invalid scope(s)"
      }));
    }

    const scopes = mergeDeep(defaultScopes, userVerify.permissions, req.body.permissions);
    
    const userData = {
      username: req.body.username,
      password: sha.sha512(req.body.password),
      token: genToken(req.body.username),
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