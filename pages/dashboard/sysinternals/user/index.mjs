import { genAccount } from "./genUser.mjs";
import { post } from "/libs/BLT-Wrap.mjs";

const proxies = await post("/api/v1/users", {
  token: localStorage.getItem("token")
})

for (const i of proxies.data.data) {
  async function rm() {
    const data = await post(`/api/v1/tunnels/remove`, {
      token: localStorage.getItem("token"),
      name: i.name
    })

    if (data instanceof axios.AxiosError) {
      return alert(
        "Removing user failed with code %s: %s"
          .replace("%s", login.response.status)
          .replace("%s", login.response.data.error)
      );
    }

    window.location.reload();
  }

  const dash = genAccount(i, rm);
  document.getElementById("active-users").appendChild(dash);
}