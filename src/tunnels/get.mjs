import express from "express";

export async function main(db, appState) {
  const app = express.Router();

  // FIXME(WONTFIX): Ok what the fuck XHR. Apparently I can't have JSON bodies for get requests.
  // Guess this is an app.post now.
  app.post("/api/v1/tunnels", async(req, res) => {
    const users = JSON.parse(await db.get("users"));
    
    if (!req.body.token) {
      return res.status(401).send(JSON.stringify({
        error: "Invalid token"
      }))
    }
  
    const user = users.find(i => i.token == req.body.token);
    if (!user) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid token"
      }))
    }

    if (!user.permissions.routes.get) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid scope(s)"
      }))
    }

    const tunnelList = appState.tunnels.list.map((i) => {
      if (user.permissions.routes.getPasswords) return i;

      return {
        proxyUrlSettings: i.proxyUrlSettings,
        dest: i.dest,
        name: i.name,
        running: i.running
      }
    });
    
    return res.send({
      success: true,
      data: tunnelList
    })
  })

  return app;
}