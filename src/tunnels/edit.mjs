import express from "express";

export async function main(db, appState, syncRunnersEx) {
  const app = express.Router();

  app.post("/api/v1/tunnels/edit", async(req, res) => {
    const users = JSON.parse(await db.get("users"));
    const tunnels = JSON.parse(await db.get("tunnels"));
  
    if (!req.body.token) {
      return res.status(401).send(JSON.stringify({
        error: "Invalid token"
      }))
    } else if (!req.body.tunnel) {
      return res.status(400).send(JSON.stringify({
        error: "Missing tunnel"
      }))
    } else if (!req.body.tunnel.port || !req.body.tunnel.dest || !req.body.tunnel.passwords || !req.body.tunnel.name) {
      return res.status(400).send(JSON.stringify({
        error: "Missing tunnel configuration data"
      }))
    } else if (req.body.tunnel.port <= 0) {
      return res.status(400).send(JSON.stringify({
        error: "Port specified is below 1."
      }))
    } else if (typeof req.body.tunnel.passwords != "object") {
      return res.status(400).send(JSON.stringify({
        error: "Passwords data type is incorrect"
      }))
    }
  
    const user = users.find(i => i.token == req.body.token);
    if (!user) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid token"
      }))
    }
  
    if (!(user.permissions.routes.add && user.permissions.routes.remove)) {
      return res.status(403).send(JSON.stringify({
        error: "Invalid scope(s)"
      }))
    }
    
    const checkIfExistingTunnel = tunnels.find(i => i.port == req.body.tunnel.port || i.name == req.body.tunnel.name);
    if (!checkIfExistingTunnel) {
      return res.status(409).send(JSON.stringify({
        error: "Tunnel does not exist!"
      }))
    }

    const legacyProxySettings = {
      "host": req.body.tunnel.host ? req.body.tunnel.host : checkIfExistingTunnel.proxyUrlSettings.host,
      "port": req.body.tunnel.port ? req.body.tunnel.port : checkIfExistingTunnel.proxyUrlSettings.port,
    }

    const proxySettings = {
      "host": req.body.proxySettings.host ? req.body.proxySettings.host : checkIfExistingTunnel.proxyUrlSettings.host,
      "port": req.body.proxySettings.port ? req.body.proxySettings.port : checkIfExistingTunnel.proxyUrlSettings.port,
    }
  
    const tunnel = {
      "proxyUrlSettings": req.body.tunnel.proxyUrlSettings ? proxySettings : legacyProxySettings,
      "dest": req.body.tunnel.dest ? req.body.tunnel.dest : checkIfExistingTunnel.dest,
      "passwords": req.body.tunnel.passwords ? req.body.passwords : checkIfExistingTunnel.passwords,
      "name": req.body.tunnel.name
    }

    tunnels.splice(tunnels.indexOf(checkIfExistingTunnel), 1, tunnel)
    await db.changeValue("tunnels", JSON.stringify(tunnels));
  
    tunnel.running = user.permissions.routes.start ? true : false;
  
    appState.tunnels.list.push(tunnel);
    await syncRunnersEx();
  
    return res.send({
      "success": true
    });
  })

  return app;
}
