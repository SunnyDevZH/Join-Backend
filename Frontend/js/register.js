try {
  let users = [];
} catch {}

async function init() {
  loadUsers();
  generateRandomColor();
}

/** Register*/
async function register() {
  let names = document.getElementById("names").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  var messageContainer = document.getElementById("message");

  if (names.trim() === "" || email.trim() === "" || password.trim() === "") {
    messageContainer.style.display = "block"; // Stellen Sie sicher, dass das Nachrichtencontainer sichtbar ist

    var messageElement = document.createElement("p");
    messageElement.textContent = "Bitte füllen Sie alle Felder aus.";
    messageContainer.innerHTML = ""; // Löschen Sie den vorherigen Inhalt, falls vorhanden
    messageContainer.appendChild(messageElement);

    return;
  }

  let contact = {
    names: names,
    email: email,
    password: password,
    color: generateRandomColor(),
  };

  users.push(contact);

  await setItem("users", JSON.stringify(users)); // Daten von Users auf Server laden
  resetForm();
  window.location.href = "./index.html";
}

/** Reset Form*/
function resetForm() {
  names.value = ""; // Feld leeren
  email.value = "";
  password.value = "";
}

/** Generate Color*/
function generateRandomColor() {
  const colorCode =
    "#" +
    Math.floor(Math.random() * 16777216)
      .toString(16)
      .padStart(6, "0");
  return colorCode;
}

/** Load User*/
async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e); // Falls Users nicht gefunden
    alert("User nicht gefunden");
  }
}

/** Checkbox*/
function checkBox() {
  var checkbox = document.getElementById("checkbox");
  var messageContainer = document.getElementById("message");

  if (checkPasswort()) {
    if (checkbox.checked) {
      register();
    } else {
      messageContainer.style.display = "block"; // Stellen Sie sicher, dass das Nachrichtencontainer sichtbar ist

      var messageElement = document.createElement("p");
      messageElement.textContent =
        "Bitte akzeptieren Sie die Bedingungen, um fortzufahren.";
      messageContainer.innerHTML = ""; // Löschen Sie den vorherigen Inhalt, falls vorhanden
      messageContainer.appendChild(messageElement);

      return;
    }
  } else {
    messageContainer.style.display = "block"; // Stellen Sie sicher, dass das Nachrichtencontainer sichtbar ist

    var messageElement = document.createElement("p");
    messageElement.textContent = "Passwörter stimmen nicht überein.";
    messageContainer.innerHTML = ""; // Löschen Sie den vorherigen Inhalt, falls vorhanden
    messageContainer.appendChild(messageElement);

    return;
  }
}

function checkPasswort() {
  let password = document.getElementById("password").value;
  let passwordtwo = document.getElementById("passwordtwo").value;

  var messageContainer = document.getElementById("message");

  if (password == passwordtwo && password != "") {
    return true;
  } else {
    messageContainer.style.display = "block"; // Stellen Sie sicher, dass das Nachrichtencontainer sichtbar ist

    var messageElement = document.createElement("p");
    messageElement.textContent = "Das Passwort stimmt nicht überein.";
    messageContainer.innerHTML = ""; // Löschen Sie den vorherigen Inhalt, falls vorhanden
    messageContainer.appendChild(messageElement);

    return false;
  }
}
