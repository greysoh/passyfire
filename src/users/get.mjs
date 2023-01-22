import express from "express";

export async function main(db) {
  const app = express.Router();

  app.post("/api/v1/users", async(req, res) => {
    const users = JSON.parse(await db.get("users"));
  
    if (!req.body.token) {
      return res.status(400).send(JSON.stringify({
        error: "Invalid token"
      }))
    }
  
    const user = users.find(i => i.token == req.body.token);
  
    if (!user) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid token"
      }));
    }

    if (!user.permissions.hasAll && !user.permissions.users.hasAll && !user.permissions.users.get) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid scope(s)"
      }))
    }

    const userDetails = users.map((i) => {
      if (i.username != user.username) {
        i.password = undefined;
        i.token = undefined;
      }

      return i;
    });
  
    return res.send(JSON.stringify({
      success: true,
      data: userDetails
    }));
  });

  return app;
}