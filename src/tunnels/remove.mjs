import express from "express";

export async function main(db, appState, syncRunnersEx) {
  const app = express.Router();

  app.post("/api/v1/tunnels/remove", async(req, res) => {
    const users = JSON.parse(await db.get("users"));
    const tunnels = JSON.parse(await db.get("tunnels"));

    if (!req.body.token) {
      return res.status(401).send(JSON.stringify({
        error: "Invalid token"
      }))
    } else if (!req.body.name) {
      return res.status(401).send(JSON.stringify({
        error: "Invalid name"
      }))
    }

    const user = users.find((i) => i.token == req.body.token);
    if (!user) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid token"
      }))
    } else if (!user.permissions.routes.remove) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid scope(s)"
      }))
    }

    const tunnel = tunnels.find((i) => i.name == req.body.name);
    if (!tunnel) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid tunnel"
      }))
    }

    const appTunnel = appState.tunnels.list.find((i) => i.name == req.body.name);

    tunnels.splice(tunnels.indexOf(tunnel), 1);
    appState.tunnels.list.splice(appState.tunnels.list.indexOf(appTunnel), 1);

    await db.changeValue("tunnels", JSON.stringify(tunnels));
    await syncRunnersEx();

    return res.send({
      "success": true
    })
  })

  return app;
}