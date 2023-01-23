import express from "express";
import { getScopesAllEnabled } from "../../libs/noScope.mjs";

export async function main() {
  const app = express.Router();

  app.get("/api/v1/static/getScopes", async(req, res) => {
    return res.send(JSON.stringify({
      success: true,
      data: getScopesAllEnabled()
    }));
  })

  return app;
}