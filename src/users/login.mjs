import sha from "js-sha512";

import express from "express";

export async function main(db) {
  const app = express.Router();

  app.post("/api/v1/users/login", async(req, res) => {
    const users = JSON.parse(await db.get("users"));
  
    if (!req.body.username || !req.body.password) {
      return res.status(400).send(JSON.stringify({
        error: "Username or password not specified"    
      }));
    }
  
    const user = users.find(i => i.username == req.body.username && i.password == sha.sha512(req.body.password)); // TODO: bcrypt again
  
    if (!user) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid username/password."
      }));
    }
  
    return res.send(JSON.stringify({
      data: {
        token: user.token
      }
    }));
  });

  return app;
}