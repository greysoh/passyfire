import { genAccount } from "./genUser.mjs";
import { post } from "/libs/BLT-Wrap.mjs";

import { enableGuest, disableGuest } from "./guestToggle.mjs";

const proxies = await post("/api/v1/users", {
  token: localStorage.getItem("token"),
});

if (proxies instanceof axios.AxiosError) {
  throw alert(
    "Getting users failed with code %s: %s"
      .replace("%s", proxies.response.status)
      .replace("%s", proxies.response.data.error)
  );
}

const guestEnabled = proxies.data.data.find((i) => i.username == "guest");

document.getElementById("guest").innerText = `${
  proxies.data.data.find((i) => i.username == "guest") ? "Disable" : "Enable"
} Guest Access`;
document.getElementById("guest").disabled = false;

document.getElementById("guest").onclick = guestEnabled ? disableGuest : enableGuest;

for (const i of proxies.data.data) {
  async function rm() {
    const data = await post(`/api/v1/users/remove`, {
      token: localStorage.getItem("token"),
      username: i.username,
    });

    if (data instanceof axios.AxiosError) {
      return alert(
        "Removing user failed with code %s: %s"
          .replace("%s", data.response.status)
          .replace("%s", data.response.data.error)
      );
    }

    window.location.reload();
  }

  const dash = genAccount(i, rm);
  document.getElementById("active-users").appendChild(dash);
}
