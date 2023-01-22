export function generateDashboard(entry, checkBoxHandler, detailHandler, rmHandler) {
  const mainDiv = document.createElement("div");
  mainDiv.className = "proxy";

  const nameDiv = document.createElement("div");
  nameDiv.className = "name";
  nameDiv.innerText = entry.name;

  const enablerDiv = document.createElement("div");
  
  const enableSpan = document.createElement("span");
  enableSpan.innerText = " ";

  const enableCheckbox = document.createElement("input");
  enableCheckbox.type = "checkbox";
  enableCheckbox.checked = entry.running;
  enableCheckbox.addEventListener("click", checkBoxHandler)

  enablerDiv.appendChild(enableSpan);
  enablerDiv.appendChild(enableCheckbox);

  const detailBtn = document.createElement("button");
  detailBtn.className = "dvhandler"
  detailBtn.innerText = "Detailed view";
  detailBtn.addEventListener("click", detailHandler);

  const rmBtn = document.createElement("button");
  rmBtn.className = "rmbtn"
  rmBtn.innerText = "Delete";
  rmBtn.addEventListener("click", rmHandler);

  mainDiv.appendChild(enablerDiv);
  mainDiv.appendChild(nameDiv);
  mainDiv.appendChild(detailBtn);
  mainDiv.appendChild(rmBtn);

  return mainDiv;
}