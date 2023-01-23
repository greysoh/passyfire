import express from "express";

export async function main(db, appState, syncRunnersEx) {
  const app = express.Router();

  app.post("/api/v1/tunnels/start", async(req, res) => {
    const users = JSON.parse(await db.get("users"));
    
    if (!req.body.name) {
      return res.status(400).send(JSON.stringify({
        error: "Missing tunnel name"
      }));
    } else if (!req.body.token) {
      return res.status(401).send(JSON.stringify({
        error: "Invalid token"
      }))
    }
  
    const user = users.find(i => i.token == req.body.token);
    if (!user) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid token"
      }))
    } else if (!user.permissions.routes.start) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid scope(s)"
      }));
    }

    const proxyInstance = appState.tunnels.list.find((i) => i.name == req.body.name);
    if (!proxyInstance) {
      return res.status(404).send(JSON.stringify({
        error: "Proxy instance not found"
      }))
    }

    appState.tunnels.list[appState.tunnels.list.indexOf(proxyInstance)].running = true;

    await syncRunnersEx();

    return res.send({
      success: true
    })
  })

  return app;
}