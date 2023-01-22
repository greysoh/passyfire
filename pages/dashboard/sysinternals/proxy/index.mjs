import { generateDashboard } from "./genDashboard.mjs";
import { post } from "/libs/BLT-Wrap.mjs";

const proxies = await post("/api/v1/tunnels", {
  token: localStorage.getItem("token")
})

for (const i of proxies.data.data) {
  async function checkbox() {
    const data = await post(`/api/v1/tunnels/${i.running ? "stop" : "start"}`, {
      token: localStorage.getItem("token"),
      name: i.name
    });

    if (data instanceof axios.AxiosError) {
      return alert(
        `Tunnel ${i.running ? "disabling" : "enabling"} failed with code %s: %s`
          .replace("%s", login.response.status)
          .replace("%s", login.response.data.error)
      );
    }

    window.location.reload();
  }

  function detail() {
    window.open("details/index.html?name=" + i.name, "view", "popup,width=300,height=150");
  }

  async function rm() {
    const data = await post(`/api/v1/tunnels/remove`, {
      token: localStorage.getItem("token"),
      name: i.name
    })

    if (data instanceof axios.AxiosError) {
      return alert(
        "Removing tunnel failed with code %s: %s"
          .replace("%s", login.response.status)
          .replace("%s", login.response.data.error)
      );
    }

    window.location.reload();
  }

  const dash = generateDashboard(i, checkbox, detail, rm);
  document.getElementById("active-proxies").appendChild(dash);
}