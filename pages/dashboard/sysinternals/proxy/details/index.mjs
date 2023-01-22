import { post } from "../../Heimdall.mjs";

const urlParams = new URLSearchParams(window.location.search);

const proxies = await post("/api/v1/tunnels", {
  token: localStorage.getItem("token")
})

const text = document.getElementById("information");

const item = proxies.data.data.find((i) => i.name == urlParams.get("name"));

text.innerText = "Listening on port: " + item.port;
text.innerText += "\nProxying: " + item.dest;

if (item.passwords) text.innerText += "\nPasswords: " + item.passwords.join();

text.innerText += `\nIs running: ${item.running ? "Yes" : "No"}`;

console.log(item);