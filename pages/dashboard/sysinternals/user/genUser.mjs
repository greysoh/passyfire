export function genAccount(entry, rmHandler) {
  const mainDiv = document.createElement("div");
  mainDiv.className = "user";

  const nameDiv = document.createElement("div");
  nameDiv.className = "name";
  nameDiv.innerHTML = "&nbsp;" + entry.name;

  const rmBtn = document.createElement("button");
  rmBtn.className = "rmbtn"
  rmBtn.innerText = "Delete";
  rmBtn.addEventListener("click", rmHandler);

  mainDiv.appendChild(nameDiv);
  mainDiv.appendChild(rmBtn);

  return mainDiv;
}