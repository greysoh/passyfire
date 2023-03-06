import { get, post } from "/libs/BLT-Wrap.mjs";

const users = await post("/api/v1/users", {
  token: localStorage.getItem("token")
})

if (users instanceof axios.AxiosError) {
  alert(
    "Getting account configuration(s) failed with code %s: %s"
      .replace("%s", users.response.status)
      .replace("%s", users.response.data.error)
  );
  
  window.location.replace("../");
}

const user = users.data.data.find((i) => i.token == localStorage.getItem("token"));
console.assert(user); // Should ALWAYS work, esp. since the users above required a valid token to work.

const s = user.permissions;

// TODO: Automate this. Oh my fucking god.
document.getElementById("users.add").checked = s.users.add;
document.getElementById("users.remove").checked = s.users.remove;
document.getElementById("users.get").checked = s.users.get;
document.getElementById("users.getPasswords").checked = s.users.getPasswords;

document.getElementById("routes.add").checked = s.routes.add;
document.getElementById("routes.remove").checked = s.routes.remove;
document.getElementById("routes.start").checked = s.routes.start;
document.getElementById("routes.stop").checked = s.routes.stop;
document.getElementById("routes.get").checked = s.routes.get;
document.getElementById("routes.getPasswords").checked = s.routes.getPasswords;

const createBtn = document.getElementById("create");
createBtn.addEventListener("click", async() => {
  const data = await post(`/api/v1/users/add`, {
    token: localStorage.getItem("token"),
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,

    permissions: {
      users: {
        add: document.getElementById("users.add").checked,
        remove: document.getElementById("users.remove").checked,
        get: document.getElementById("users.get").checked,
        getPasswords: document.getElementById("users.getPasswords").checked
      },
      routes: {
        add: document.getElementById("routes.add").checked,
        remove: document.getElementById("routes.remove").checked,
        start: document.getElementById("routes.start").checked,
        stop: document.getElementById("routes.stop").checked,
        get: document.getElementById("routes.get").checked,
        getPasswords: document.getElementById("routes.getPasswords").checked
      }
    }
  })

  if (data instanceof axios.AxiosError) {
    return alert(
      "Adding user failed with code %s: %s"
        .replace("%s", data.response.status)
        .replace("%s", data.response.data.error)
    );
  }

  if (!data.data.success) {
    return alert("Unknown error");
  }

  window.location.replace("../");
})

createBtn.disabled = false;
createBtn.innerText = "Create User";