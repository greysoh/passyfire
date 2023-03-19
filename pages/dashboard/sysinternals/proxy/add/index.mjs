import { post } from "/libs/BLT-Wrap.mjs";

document.getElementById("create").addEventListener("click", async() => {
  const name = document.getElementById("name").value;
  const port = document.getElementById("port").value;
  const url = document.getElementById("url").value;
  const passwords = document.getElementById("passwords_orig").value;

  if (!passwords.includes(",")) {
    const warn = confirm("Passwords have to be a comma seperated value (unless you only have one password), but there was no commas specified. Would you like to continue?");
    if (!warn) return;
  }

  const password = passwords.split(",");

  const data = await post("/api/v1/tunnels/add", {
    token: localStorage.getItem("token"),
    tunnel: {
      name: name,
      port: port,
      dest: url,
      passwords: password,
      UDPEnabled: false // TODO
    }
  });

  if (data instanceof axios.AxiosError) {
    return alert(
      "Tunnel creation failed with code %s: %s"
        .replace("%s", data.response.status)
        .replace("%s", data.response.data.error)
    );
  }

  if (!data.data.success) {
    return alert("Unknown error.");
  }

  window.close();
});