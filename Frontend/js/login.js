localStorage.setItem("activeID", -1);

/*
function start() {
  loadUsers();
}*/

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Bitte geben Sie Email und Passwort ein.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/register_or_login/", {  // Verwende den richtigen Endpunkt
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login erfolgreich:", data);

      // Token speichern
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Weiterleitung zur geschützten Seite
      window.location.href = "./summary.html";
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Login fehlgeschlagen.");
    }
  } catch (error) {
    console.error("Fehler beim Login:", error);
    alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
  }
}



/** Load User*/
/*
async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users")); // Items als json laden
  } catch (e) {
    console.error("Loading error:", e); // Falls Users nicht gefunden
    alert("User nicht gefunden");
  }
} */

/* Guest-Login*/
async function guestLogin() {
  try {
    const response = await fetch("http://127.0.0.1:8000/guest_token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Gäste-Token erfolgreich erstellt:", data);

      // Token speichern
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Weiterleitung zur geschützten Seite
      window.location.href = "./summary.html";
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Fehler beim Erstellen des Gäste-Tokens.");
    }
  } catch (error) {
    console.error("Fehler beim Gäste-Login:", error);
    alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
  }
}
