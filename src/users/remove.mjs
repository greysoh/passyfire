import express from "express";

export async function main(db) {
  const app = express.Router();

  app.post("/api/v1/users/remove", async(req, res) => {
    const users = JSON.parse(await db.get("users"));
  
    if (!req.body.username) {
      return res.status(400).send(JSON.stringify({
        error: "Inv"
      }))
    } else if (!req.body.token) {
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

    if (!user.permissions.hasAll && !user.permissions.users.hasAll && !user.permissions.users.remove) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid scope(s)"
      }))
    }

    const removeUser = users.find(i => i.username == req.body.username);
    if (!removeUser) {
      return res.status(403).send(JSON.stringify({
        error: "Username specified is not registered"
      }))
    } else if (removeUser.username == user.username) {
      return res.status(775).send(JSON.stringify({
        error: "You can't remove yourself, silly!"
      }))
    }

    users.splice(users.indexOf(removeUser), 1);
    await db.changeValue("users", JSON.stringify(users));
    
    return res.send(JSON.stringify({
      success: true
    }))
  });

  return app;
}