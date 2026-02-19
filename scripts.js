const form = document.getElementById("add-form");
const input = document.getElementById("item-input");
const itemsList = document.getElementById("items-list");
const removeAlert = document.getElementById("remove-alert");
const alertCloseButton = document.getElementById("alert-close");

const items = [
  { id: crypto.randomUUID(), name: "Pão de forma", done: false },
  { id: crypto.randomUUID(), name: "Café preto", done: false },
  { id: crypto.randomUUID(), name: "Suco de laranja", done: false },
  { id: crypto.randomUUID(), name: "Bolacha", done: false },
];

let alertTimeoutId = null;

function renderItems() {
  itemsList.innerHTML = "";

  items.forEach((item) => {
    const itemElement = document.createElement("li");
    itemElement.className = `item${item.done ? " is-done" : ""}`;
    itemElement.dataset.id = item.id;

    const itemMain = document.createElement("div");
    itemMain.className = "item-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "item-checkbox";
    checkbox.checked = item.done;
    checkbox.setAttribute("aria-label", `Marcar ${item.name}`);

    const itemName = document.createElement("span");
    itemName.className = "item-name text-paragraph";
    itemName.textContent = item.name;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-button";
    removeButton.setAttribute("aria-label", `Remover ${item.name}`);

    const removeIcon = document.createElement("img");
    removeIcon.src = "./img/icons/trash.svg";
    removeIcon.alt = "";

    removeButton.appendChild(removeIcon);
    itemMain.append(checkbox, itemName);
    itemElement.append(itemMain, removeButton);

    itemsList.appendChild(itemElement);
  });
}

function hideRemoveAlert() {
  removeAlert.hidden = true;
  if (alertTimeoutId) {
    clearTimeout(alertTimeoutId);
    alertTimeoutId = null;
  }
}

function showRemoveAlert() {
  removeAlert.hidden = false;
  if (alertTimeoutId) {
    clearTimeout(alertTimeoutId);
  }

  alertTimeoutId = setTimeout(() => {
    removeAlert.hidden = true;
    alertTimeoutId = null;
  }, 3000);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const itemName = input.value.trim();
  if (!itemName) {
    return;
  }

  items.push({
    id: crypto.randomUUID(),
    name: itemName,
    done: false,
  });

  renderItems();
  input.value = "";
  input.focus();
});

itemsList.addEventListener("change", (event) => {
  const target = event.target;
  if (
    !(target instanceof HTMLInputElement) ||
    !target.classList.contains("item-checkbox")
  ) {
    return;
  }

  const itemElement = target.closest(".item");
  if (!itemElement) {
    return;
  }

  const itemId = itemElement.dataset.id;
  const item = items.find((currentItem) => currentItem.id === itemId);
  if (!item) {
    return;
  }

  item.done = target.checked;
  itemElement.classList.toggle("is-done", item.done);
});

itemsList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const removeButton = target.closest(".remove-button");
  if (!removeButton) {
    return;
  }

  const itemElement = removeButton.closest(".item");
  if (!itemElement) {
    return;
  }

  const itemId = itemElement.dataset.id;
  const itemIndex = items.findIndex((currentItem) => currentItem.id === itemId);
  if (itemIndex < 0) {
    return;
  }

  items.splice(itemIndex, 1);
  renderItems();
  showRemoveAlert();
});

alertCloseButton.addEventListener("click", hideRemoveAlert);

renderItems();
