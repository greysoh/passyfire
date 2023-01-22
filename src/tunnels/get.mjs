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
    
    return res.send({
      success: true,
      data: appState.tunnels.list
    })
  })

  return app;
}