import { post } from "./libs/BLT-Wrap.mjs";

if (localStorage.getItem("token_rst")) {
  document.getElementById("login-text").innerText = "Oops! We ran into an issue, and need you to log back in. " + document.getElementById("login-text").innerText;
  localStorage.removeItem("token"); // Remove the token in case it wasn't already removed.
}

if (localStorage.getItem("token")) {
  window.location.replace("dashboard/");
}

document.getElementById("login").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const login = await post("/api/v1/users/login", {
    username: username,
    password: password,
  });

  if (login instanceof axios.AxiosError) {
    alert(
      "Login failed with code %s: %s"
        .replace("%s", login.response.status)
        .replace("%s", login.response.data.error)
    );
    
    return;
  }

  localStorage.setItem("token", login.data.data.token);
  window.location.replace("dashboard/")

  console.log(login);
});
