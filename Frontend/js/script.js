let sumTodos = [];
let users = [];

let userName = "";
let userColor = "";
let userIndex = localStorage.getItem("activeID");

/* 
Websiten Schutz
*/

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      console.log('Logout-Link gefunden. Event-Listener wird hinzugefügt.');
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Logout-Link wurde geklickt!');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = './login.html';
      });
    } else {
      console.log('Fehler: Logout-Link konnte nicht gefunden werden!');
    }
  }, 500); // Verzögerung von 500ms
});


// Avatar-Menü schließen, wenn außerhalb geklickt wird
function closeAvatarMenuOutside(event) {
  const avatarMenu = document.getElementById('avatar-menu');
  if (avatarMenu && !avatarMenu.contains(event.target)) {
    avatarMenu.classList.add('d-none');
    console.log('Avatar-Menü wurde geschlossen.');
  }
}

/*document.addEventListener('DOMContentLoaded', () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
      // Kein Zugriffstoken gefunden -> Weiterleitung
      alert('Du bist nicht eingeloggt. Bitte logge dich ein.');
      window.location.href = 'Frontend/login.html';
  }
});*/

const monthsName = [
  null,
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

/**
 * first start of the index page
 */

function indexStart() {
  document.getElementById("index-main").style.display = "none";
  setTimeout(() => {
    document.getElementById("index-main").style.display = "block";
  }, 1500);
}

/**
 * initial page load
 */

async function loadPage() {
  await loadUsers();
  await loadTodos();
  updateHeader();
  changeAvatarColor();
  updateNavbar();
}

/**
 * save actual user to the local storage
 * @param navId array index of the actual user
 */

function setNavID(navId = 1) {
  localStorage.setItem("nav-id", navId);
}

function updateNavbar() {
  navId = localStorage.getItem("nav-id");
  if (navId == "none") {
    return;
  } else {
    document.getElementById(navId).style.backgroundColor = "#091931";
  }
}

/**
 * save todos from server to local array
 */
  
async function loadTodos() {
  try {
    // Anfrage an den Server
    const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Überprüfen, ob die Anfrage erfolgreich war
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // JSON-Daten aus der Antwort extrahieren
    const newTodos = await response.json();

    // Lokales Array aktualisieren
    sumTodos = newTodos.map((todo, index) => ({
      ...todo,
      id: index, // ID hinzufügen
    }));

    // Bestehende Logik aufrufen
  } catch (error) {
    console.error("Failed to load todos:", error);
  }
}

/**
 * load users from server to local array
 */
async function loadUsers() {
  // Token aus dem localStorage holen
  const token = localStorage.getItem("access_token");
  users = []; // Benutzerinformationen hier speichern

  // Wenn kein Token vorhanden ist, den Gastbenutzernamen verwenden
  if (!token) {
    console.log("Kein Token gefunden, der Benutzer ist nicht eingeloggt.");
    getUserData(); // Setze Gastdaten
    userName = "Gast"; // Gastbenutzername setzen
    return;
  }

  try {
    // Benutzerdaten mit einer GET-Anfrage abrufen
    const response = await fetch("http://127.0.0.1:8000/register_or_login/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Token im Header übergeben
      },
    });

    if (!response.ok) {
      // Fehler beim Abrufen der Daten behandeln
      const errorData = await response.json();
      console.error("Fehler beim Abrufen der Benutzerdaten:", errorData);
      getUserData(); // Setze Gastdaten bei Fehler
      userName = "Gast"; // Standardwert für Benutzername
    } else {
      const data = await response.json();
      

      // Globale Benutzername-Variable setzen
      userName = data.username || "Mr Nobody"; // Falls kein Username, setze "Mr Nobody"

      // Daten in die users-Variable speichern
      users.push({
        username: userName,
        email: data.email || "Keine E-Mail verfügbar",
      });

    }
  } catch (error) {
    console.error("Netzwerk- oder Serverfehler:", error);
    getUserData(); // Fehlerfall: Nutze lokale Daten (Guest)
    userName = "Gast"; // Standardwert für Benutzername
  }
}



/**
 * Standardwerte für den Gastbenutzer setzen, falls der Benutzer nicht eingeloggt ist
 */
function getUserData() {
  const userIndex = localStorage.getItem("activeID");

  if (userIndex == -1 || userIndex == null) {
    // Standardwert für Gäste
    userName = "Guest";
  } else {
    // Wenn der Benutzer im localStorage existiert, nutze den gespeicherten Namen
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users[userIndex]) {
      userName = users[userIndex].username || "Mr Nobody"; // Falls kein Username, setze "Mr Nobody"
    } else {
      userName = "Mr Nobody";
    }
  }
}

/**
 * update summary data
 */

async function updateSummaryCounter() {
  await loadPage();
  await updateSummaryGreeting();

  document.getElementById("task-board-counter").innerHTML = sumTodos.length;
  let todoProgress = sumTodos.filter((t) => t["step"] == "col-02");
  document.getElementById("todo-inprogress-counter").innerHTML =
    todoProgress.length;
  let todoAwait = sumTodos.filter((t) => t["step"] == "col-03");
  document.getElementById("todo-await-counter").innerHTML = todoAwait.length;
  let todoOpen = sumTodos.filter((t) => t["step"] == "col-01");
  document.getElementById("todo-open-counter").innerHTML = todoOpen.length;
  let todoDone = sumTodos.filter((t) => t["step"] == "col-04");
  document.getElementById("todo-done-counter").innerHTML = todoDone.length;

  let todoUrgent = sumTodos.filter((t) => t["prio"][0] == "URGENT");
  document.getElementById("todo-prio-counter").innerHTML = todoUrgent.length;

  document.getElementById("next-date").innerHTML = getNextDate(todoUrgent);
}

async function updateSummaryGreeting() {
  document.getElementById("sum-greet").innerHTML = getGreeting();
  document.getElementById("sum-name").innerHTML = userName;
}

/**
 * get greeting string from actual time
 * @returns greeting time
 */

function getGreeting() {
  let currentDate = new Date();
  let currentHour = currentDate.getHours();
  if (currentHour >= 0 && currentHour < 12) {
    return "Good Morning,";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good Afternoon,";
  } else if (currentHour >= 18) {
    return "Good Evening,";
  } else {
    return "Hello,";
  }
}

/**
 * generate 2 characters from the first character of the first and last name
 * @param name full name as string
 * @returns 2 characters as initial string
 */

function generateInitials(name) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return "__"; // Fallback für ungültige Eingaben
  }

  let initials = name.trim().split(" ");
  if (initials.length === 1 && initials[0].length > 1) {
    // Einzelnes Wort mit mindestens 2 Zeichen
    return initials[0][0].toUpperCase() + initials[0][1].toUpperCase();
  } else if (initials.length === 2) {
    // Zwei Wörter
    return initials[0][0].toUpperCase() + initials[1][0].toUpperCase();
  } else if (initials.length >= 3) {
    // Mehr als zwei Wörter
    return initials[0][0].toUpperCase() + initials[2][0].toUpperCase();
  } else {
    return "__"; // Fallback für unerwartete Fälle
  }
}


/**
 * show actual user in the header
 */

function updateHeader() {
  let initials = generateInitials(userName);
  document.getElementById("avatar-initials").innerHTML = initials;
}

/**
 * check and show the next task
 * @param element todo task from the server
 * @returns next task to clear
 */

function getNextDate(element) {
  if (element.length > 0) {
    let nextdate = "3000-01-01";
    element.forEach((todo) => {
      if (todo["date"] < nextdate) {
        nextdate = todo["date"];
      }
    });
    let monthFull = monthsName[parseInt(nextdate.substring(5, 7))];
    return `${nextdate.substring(8)}. ${monthFull} ${nextdate.substring(0, 4)}`;
  } else {
    return "No urgent task available";
  }
}

// header

function changeAvatarColor() {
  document.querySelector(".header-avatar").style.backgroundColor = userColor;
}

/**
 * show and hide the header menu
 */

function toggleAvatarMenu() {
  if (document.getElementById("avatar-menu").classList.contains("d-none")) {
    document.getElementById("avatar-menu").classList.remove("d-none");
  } else {
    document.getElementById("avatar-menu").classList.add("d-none");
  }
}

/**
 * close the header menu by clicking outside the menu
 */

function closeAvatarMenuOutside(event) {
  const avatarMenu = document.getElementById("avatar-menu");
  const avatarInitials = document.getElementById("avatar-initials");

  if (!avatarMenu.contains(event.target) && event.target !== avatarInitials) {
    avatarMenu.classList.add("d-none");
  }
}
