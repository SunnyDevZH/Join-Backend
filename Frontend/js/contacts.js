let addContacts = [];

window.addEventListener("load", load);

/** Render Contact*/
function renderContacts() {
  let mycontact = document.getElementById("mycontact");
  mycontact.innerHTML = "";

  /** Sort Contact*/
  addContacts.sort((a, b) => a.name.localeCompare(b.name));

  let currentLetter = null;

  for (let i = 0; i < addContacts.length; i++) {
    const contact = addContacts[i];

    const firstLetter = contact.name[0];

    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      mycontact.innerHTML += `<div class="alphabet-group">${currentLetter}</div>`;
    }

    mycontact.innerHTML += `
    <div onclick="currentcontact(${i}); selectContact(this);" class="rendercontact">
        <div class="circle" style="background-color: ${contact.color}">
            <span class="initials">${getInitials(contact.name)}</span>
        </div>
        <div class="flex-direction">
            <div>
                <b>${contact.name}</b>
            </div>
            <div>
                <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
        </div>
    </div>`;
  }
}

/** Render Current Contact
 * Mehr infos unter {@link https://infos.ch}
 * @param {index} i des jeweiligen Kontakt
 * @returns
 */
function currentcontact(i) {
  let currentcontactDiv = document.getElementById("currentcontact");
  currentcontactDiv.innerHTML = "";

  currentcontactDiv.innerHTML += `
        <div class="contactBoxOne">
            <div class="circle" style="background-color: ${
              addContacts[i].color
            }">
                <span class="initials">${addContacts[i].name.substring(
                  0,
                  2
                )}</span>
            </div>
            <div class="flex-direction">
                <div>
                    <b>${addContacts[i].name}</b>
                </div>
                <div class="edit">
                    <div>
                        <img onclick="deletecontact(${i})" src="./img/delete.png" alt="delete" width="100px">
                    </div>
                    <div>
                        <img onclick="editContainer(${i})" src="./img/edit.png" alt="edit" width="80px">
                    </div>
                </div>
            </div>
        </div>
        <div class="contactBox">
            <div>
                <b>Contact Information</b>
            </div>
            <div>
                <p>E-mail:</p>
                <a href="">${addContacts[i].email}</a>
            </div>
            <div>
                <p>Tel:</p>
                <p>${addContacts[i].phone}</p>
            </div>
        </div>`;
}

/** Render Add Contact*/
function addContact() {
  let contactContainer = document.getElementById("contactContainer");
  contactContainer.innerHTML = contactTemplate();
}

function contactTemplate() {
  return `
    <div id="add" class="add">
        <div class="container">
            <div class="addcontainer">
                <div class="betterteam">
                    <img src="./img/join.png" alt="join">
                    <h1>Add contact</h1>
                    <p>Tasks are better with a team!</p>
                    <div class="line2"></div>
                </div>
                <div class="inputcointainer">
                    <div class="close" onclick="cancelContact('add')">x</div>
                    <div class="input">
                        <div>
                            <img class="displaynone1" src="./img/user.png" alt="user" style="width: 120px;">
                        </div>
                        <div>
                            <div class="inputsytle">
                                <div class="displayflex">
                                    <input required type="text" id="name" placeholder="Name">
                                    <img class="loginimg" src="./img/name.png" alt="name" width="30px"> 
                                </div>
                                <div class="displayflex">
                                    <input required type="email" id="email" placeholder="Email">
                                    <img class="loginimg" src="./img/mail.png" alt="mail" width="25px"> 
                                </div>
                                <div class="displayflex">
                                    <input required type="number" id="phone" placeholder="Phone">
                                    <img class="loginimg" src="./img/tel.png" alt="mail" width="30px"> 
                                </div>
                            </div>
                            <div class="buttonfield">
                                <button onclick="cancelContact('add')">Cancel</button>
                                <button class="createButton" onclick="addNotiz()">Create contact</button>
                            </div>
                            <div id="message1"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div> `;
}

/** Edit
 *
 * @param {index} i des jeweiligen Kontakt
 * @returns
 */
function editContainer(i) {
  let editContainer = document.getElementById("editContainer");
  editContainer.innerHTML = renderEdit(i);
}

function renderEdit(i) {
  return `
  <div id="edit${i}" class="add">
        <div class="container">
            <div class="addcontainer">
                <div class="betterteam">
                    <img src="./img/join.png" alt="join">
                    <h1>Edit contacts</h1>
                    <div class="line2"></div>
                </div>
                <div class="inputcointainer">
                    <div class="close" onclick="cancelContact('edit${i}')">x</div>
                    <div class="input">
                        <div>
                          <div class="circle" style="background-color: ${
                            addContacts[i].color
                          }">
                            <span class="initials">${addContacts[
                              i
                            ].name.substring(0, 2)}</span>
                          </div>
                        </div>
                        <div>
                            <div class="inputsytle">
                                <div class="displayflex">
                                    <input required type="text" id="name" value="${
                                      addContacts[i].name
                                    }">
                                    <img class="loginimg" src="./img/name.png" alt="name" width="30px"> 
                                </div>
                                <div class="displayflex">
                                    <input required type="email" id="email" value="${
                                      addContacts[i].email
                                    }">
                                    <img class="loginimg" src="./img/mail.png" alt="mail" width="25px"> 
                                </div>
                                <div class="displayflex">
                                    <input required type="number" id="phone" value="${
                                      addContacts[i].phone
                                    }">
                                    <img class="loginimg" src="./img/tel.png" alt="mail" width="30px"> 
                                </div>
                            </div>
                            <div class="buttonfield">
                                <button onclick="deletecontact(${i})">Delete </button>
                                <button class="createButton" onclick="edit(${i})">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div> `;
}

/** Back*/
function cancelContact(elementId) {
  const contactElement = document.getElementById(elementId);
  if (contactElement) {
    contactElement.style.display = "none";
  }
}


//////////////////////////////////////////////
//////////// Backend POST/////////////////////
//////////////////////////////////////////////

/** Add Contact */
async function addNotiz() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;

  var messageContainer = document.getElementById("message1");

  // Überprüfen, ob alle Felder ausgefüllt sind
  if (name.trim() === "" || email.trim() === "" || phone.trim() === "") {
    messageContainer.style.display = "block"; // Zeige das Nachrichten-Container an
    var messageElement = document.createElement("p");
    messageElement.textContent = "Bitte füllen Sie alle Felder aus."; // Fehlermeldung
    messageContainer.innerHTML = ""; // Lösche vorherige Nachrichten, falls vorhanden
    messageContainer.appendChild(messageElement);
    return;
  }

  // Überprüfen, ob der Kontakt bereits existiert (nach exakter Übereinstimmung der Felder)
  try {
    const responseCheck = await fetch(`http://127.0.0.1:8000/api/contacts/?name=${name}&email=${email}&phone=${phone}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (responseCheck.ok) {
      const existingContacts = await responseCheck.json();

      if (existingContacts.length > 0) {
        // Zeige Nachricht im Frontend, wenn der Kontakt bereits existiert
        messageContainer.style.display = "block";
        var messageElement = document.createElement("p");
        messageElement.textContent = "Dieser Kontakt existiert bereits.";
        messageContainer.innerHTML = ""; // Lösche vorherige Nachrichten, falls vorhanden
        messageContainer.appendChild(messageElement);
        return;
      }
    } else {
      console.error("Fehler bei der Kontaktüberprüfung.");
      return;
    }
  } catch (error) {
    console.error("Es gab ein Problem bei der Kontaktüberprüfung:", error);
    return;
  }

  // Erstelle den neuen Kontakt
  let color = getRandomColor();
  let contact = { name, email, phone, color };

  // Sende den neuen Kontakt an das Backend
  try {
    const response = await fetch('http://127.0.0.1:8000/api/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });

    if (response.ok) {
      window.location.href = "contacts.html"; // Weiterleitung zur Kontaktseite
    } else {
      console.error("Fehler beim Hinzufügen des Kontakts.");
    }
  } catch (error) {
    console.error("Es gab ein Problem: " + error.message);
  }
}


//////////////////////////////
///////////Backend PUT/////////
/////////////////////////////

/** Edits
 *
 * @param {index} i des jeweiligen Kontakt
 * @returns
 */

async function edit(i) {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  const color = getRandomColor(); // Zufällige Farbe generieren

  // Holen der ID des zu bearbeitenden Kontakts
  const contactId = addContacts[i].id; // Annahme, dass der Kontakt eine 'id' hat

  // Erstellen des Objekts mit den bearbeiteten Kontaktinformationen
  const editedContact = { name, email, phone, color };

  try {
    // PUT-Anfrage an das Backend, um den Kontakt zu aktualisieren
    const response = await fetch(`http://127.0.0.1:8000/api/contacts/${contactId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedContact), // Die bearbeiteten Daten werden im Body geschickt
    });

    if (response.ok) {
      // Wenn die Anfrage erfolgreich war, den Kontakt im Frontend auch aktualisieren
      const updatedContact = await response.json(); // Die Antwort vom Backend

      // Aktualisieren des Kontakts im lokalen Array (addContacts)
      addContacts[i] = updatedContact;

      // Kontakte neu rendern
      renderContacts();

      // Weiterleiten zur "contacts.html"-Seite (falls erforderlich)
      window.location.href = "contacts.html";
    } else {
      // Fehlerbehandlung, wenn die Anfrage fehlschlägt
      console.error("Fehler beim Aktualisieren des Kontakts");
    }
  } catch (error) {
    console.error("Fehler bei der Anfrage:", error);
  }
}
//////////////////////////////
///////////Backend Get/////////
//////////////////////////////

async function load() {
  try {
    // Anfrage an das Backend senden, um die Kontakte abzurufen
    const response = await fetch('http://127.0.0.1:8000/api/contacts/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Optional: Falls du eine Authentifizierung benötigst:
        // 'Authorization': 'Bearer ' + 'dein-jwt-token-hier',
      }
    });

    if (response.ok) {
      // Kontakte erfolgreich abgerufen
      const contacts = await response.json();  // Die Daten werden als JSON zurückgegeben
      addContacts = contacts;  // Kontakte in deiner Anwendung speichern
      renderContacts();  // Funktion aufrufen, um die Kontakte anzuzeigen
    } else {
      throw new Error('Fehler beim Abrufen der Kontakte');
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
    // Hier kannst du eine Fehlernachricht anzeigen, wenn das Abrufen der Kontakte fehlschlägt
  }
  renderContacts();
  
}

////////////////////////////////
///////////Backend Delete/////////
////////////////////////////////

/** Delet Contacts
 *
 * @param {index} i des jeweiligen Kontakt
 * @returns
 */
async function deletecontact(i) {
  const contactId = addContacts[i].id; // Die ID des zu löschenden Kontakts

  try {
    // Sende eine DELETE-Anfrage an den Server, um den Kontakt zu löschen
    const response = await fetch(`http://127.0.0.1:8000/api/contacts/${contactId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Wenn die Anfrage erfolgreich war, entferne den Kontakt aus dem lokalen Array
      addContacts.splice(i, 1);

      // Speichern der aktualisierten Kontakte im lokalen Speicher
      await setItem("addContacts", JSON.stringify(addContacts));

      // Kontakte neu rendern
      renderContacts();

      // Weiterleiten zur "contacts.html"-Seite (falls erforderlich)
      window.location.href = "./contacts.html";
    } else {
      // Fehlerbehandlung, wenn die Anfrage fehlschlägt
      console.error("Fehler beim Löschen des Kontakts");
    }
  } catch (error) {
    console.error("Fehler bei der Anfrage:", error);
  }
}

/** Generate Color*/
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;  // Ein Hex-Farbcode wie #A3C9F7
}

// Auswahl markieren //

let selectedContact = null;

function selectContact(contactElement) {
  if (selectedContact !== null) {
    selectedContact.classList.remove("selected");
  }

  selectedContact = contactElement;
  selectedContact.classList.add("selected");
}

/** Get Initials
 *
 * @param {name} name ist der Name von Contact
 * @returns
 */
function getInitials(name) {
  // Zerlegen Sie den Namen in Worte
  const words = name.split(" ");

  // Überprüfen, ob der Name mindestens zwei Wörter hat
  if (words.length >= 2) {
    // Extrahieren Sie den ersten Buchstaben des ersten und zweiten Worts
    const firstInitial = words[0].charAt(0);
    const secondInitial = words[1].charAt(0);
    return firstInitial + secondInitial;
  } else if (words.length === 1) {
    // Wenn der Name nur ein Wort hat, extrahieren Sie den ersten Buchstaben davon
    return words[0].charAt(0);
  } else {
    // Wenn der Name leer ist, geben Sie einen leeren String zurück
    return "";
  }
}
