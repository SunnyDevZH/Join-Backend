let allTasks = [];
let taskCategories = [];
let taskColors = [];
let addContacts = [];

let isClicked = false;
let isClicked2 = false;

let assignedPrio = [];
let assignedCategory;
let assignedCategoryColor;
let assignedContacts = [];
let assignedContactColor = [];
let assignedSubtasks = [];

async function initAddTask() {
  getNewDate();
  loadContacts();
  loadCategoriesAndColors();
  keypress();
  keypressAddTask();
}

/**  function to get all values from all inputfields and to push it in an JSON, and then in an array */
async function addTask() {
  let task = getTask();
  if (!requirePrio()) {
    return; // Stops the function when the prio was not chosen
  }
  if (!requireCategory()) {
    return;
  }
  allTasks.push(task);
  await saveTaskToServer(task);  // Save the task to the server
  clearAll();
  animation();
  //setTimeout(function () {
   // window.location.href = "./board.html";
  //}, 1000);
}

/**this function gets all the values from inputfields and has the values for the TASK JSON */
function getTask() {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let date = document.getElementById("calendar").value;
  let task = {
    step: showColumn(), // bleibt gleich
    title: title, // bleibt gleich
    description: description, // bleibt gleich
    assigned_contact: assignedContacts, // geändert
    contact_color: assignedContactColor, // geändert
    date: date, // bleibt gleich
    prio: assignedPrio, // bleibt gleich
    category: assignedCategory, // bleibt gleich
    category_color: assignedCategoryColor, // geändert
    subtasks: assignedSubtasks, // bleibt gleich
  };
  return task;
}

/**this function gets the column for section of the task */
function showColumn() {
  if (typeof columns === 'undefined' || columns.length == 0) {
    return 'col-01';
  } else {
    return columns[0];
  }
}

/**this is the animation when a task is added to board */
function animation() {
  document.getElementById("animationBox").classList.remove("d-none");
  document.getElementById("animationBox").classList.add("animation");
}

/** checks if the Prio was chosen, if not there is an alert. */
function requirePrio() {
  let alertArea = document.getElementById("priorityAlert");
  alertArea.classList.add("d-none");

  if (assignedPrio.length === 0) {
    alertArea.textContent = "Please choose a Priority.";
    alertArea.classList.remove("d-none");
    return false;
  }
  return true;
}

/** checks if the Category was chosen, if not there is an alert */
function requireCategory() {
  let alertArea = document.getElementById("categoryAlert");
  alertArea.classList.add("d-none");

  if (!assignedCategory) {
    alertArea.textContent = "Please choose a Category.";
    alertArea.classList.remove("d-none");
    return false;
  }
  return true;
}

/** saves the tasks to the server */
async function saveTaskToServer(task) {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`Failed to save task: ${response.statusText}`);
    }

    const data = await response.json();  // Response from server
    console.log('Task saved successfully:', data);
  } catch (error) {
    console.error('Error saving task:', error);
  }
}

async function loadContacts() {
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
    
    } else {
      throw new Error('Fehler beim Abrufen der Kontakte');
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
    // Hier kannst du eine Fehlernachricht anzeigen, wenn das Abrufen der Kontakte fehlschlägt
  }
 
  
}

/**
 * This function saves the category to the server for matching it with the board to only show used categories.
 */
async function saveCategory() {
  const url = "http://127.0.0.1:8000/api/categories/"; // Lokale Server-URL

  // Standardfarbe definieren
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  try {
    // Bestehende Kategorien vom Server abrufen
    const existingCategoriesResponse = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!existingCategoriesResponse.ok) {
      throw new Error("Failed to fetch existing categories");
    }

    const existingCategories = await existingCategoriesResponse.json();
    const existingCategoryNames = existingCategories.map(category => category.name);

    // Filtern: Nur neue Kategorien hinzufügen
    const filteredCategories = [];
    const filteredColors = [];

    taskCategories.forEach((category, index) => {
      if (!existingCategoryNames.includes(category)) {
        filteredCategories.push(category);
        filteredColors.push(taskColors[index] || generateRandomColor()); // Fehlende Farben auffüllen
      }
    });

    // Wenn es keine neuen Kategorien gibt, beende die Funktion
    if (filteredCategories.length === 0) {
      console.log("No new categories to save.");
      return;
    }

    // Daten für den POST-Request vorbereiten
    const payload = {
      taskCategories: filteredCategories,
      taskColors: filteredColors,
    };

    // Neue Kategorien an den Server senden
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully saved categories to server:", data);

  } catch (error) {
    console.error("Error saving categories to server:", error);
  }
}

async function loadCategoriesAndColors() {
  try {
    // Anfrage an das Backend senden, um die Kategorien und Farben abzurufen
    const response = await fetch('http://127.0.0.1:8000/api/categories/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Optional: Falls du eine Authentifizierung benötigst:
        // 'Authorization': 'Bearer ' + 'dein-jwt-token-hier',
      }
    });

    if (response.ok) {
      // Kategorien und Farben erfolgreich abgerufen
      const categories = await response.json();  // Die Daten werden als JSON zurückgegeben

      // taskCategories und taskColors Arrays füllen
      taskCategories = categories.map(category => category.name);
      taskColors = categories.map(category => category.color);

    } else {
      throw new Error('Fehler beim Abrufen der Kategorien und Farben');
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kategorien und Farben:", error);
    // Hier kannst du eine Fehlernachricht anzeigen, wenn das Abrufen der Daten fehlschlägt
  }
}

/** gets the date of today, so the user cannot choose previous dates */
function getNewDate() {
  let today = new Date().toISOString().split("T")[0];
  document.getElementById("calendar").setAttribute("min", today);
}

/** function to check which prio is clicked 
 * @param clickedTab displays the prio 
*/
function addPrio(clickedTab) {
  let alertArea = document.getElementById("priorityAlert");
  alertArea.classList.add("d-none");
  resetImages();
  document.getElementById(clickedTab).classList.add("white-text");
  let priority;
  let image;
  if (clickedTab === "urgent") {
    checkPrio(clickedTab);
    changeImage(clickedTab);
    priority = "URGENT";
    image = "./icons/priority_urgent.svg";
  } else if (clickedTab === "medium") {
    checkPrio(clickedTab);
    changeImage(clickedTab);
    priority = "MEDIUM";
    image = "./icons/priority_medium.svg";
  } else if (clickedTab === "low") {
    checkPrio(clickedTab);
    changeImage(clickedTab);
    priority = "LOW";
    image = "./icons/priority_low.svg";
  }
  assignedPrio.push(priority, image);
}

/** changes the color of the Prio tab and sets back the other prioButtons
 * @param clickedTab displays the prio 
 */
function checkPrio(clickedTab) {
  assignedPrio = [];
  const tabs = ["urgent", "medium", "low"];
  const colors = ["#FF3D00", "#FFA800", "#7AE229"];

  tabs.forEach((tab, index) => {
    const backgroundColor = clickedTab === tab ? colors[index] : "white";
    document.getElementById(tab).style.backgroundColor = backgroundColor;
    const textColor = clickedTab === tab ? "white" : "black";
    document.getElementById(tab).style.color = textColor;
  });
}

/**this function changes the image auf the Prio Image to a white one, when the button is clicked
 * @param clickedTab displays the prio
 */
function changeImage(clickedTab) {
  const imgPath = "./icons/priority_" + clickedTab + "_default.svg";
  document.getElementById(clickedTab + "-img").src = imgPath;
}

/**this function sets the image back to the normal one, when another button is clicked */
function resetImages() {
  document.getElementById("urgent-img").src = "./icons/priority_urgent.svg";
  document.getElementById("medium-img").src = "./icons/priority_medium.svg";
  document.getElementById("low-img").src = "./icons/priority_low.svg";
}

/** clears the PrioButtons and the Array */
function resetPrio() {
  assignedPrio = [];
  const tabs = ["urgent", "medium", "low"];
  const defaultColors = ["white", "white", "white"];

  tabs.forEach((tab, index) => {
    document.getElementById(tab).style.backgroundColor = defaultColors[index];
  });
}

/** function to clear all inputfields */
function clearAll() {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const date = document.getElementById("calendar");
  const subtask = document.getElementById("subtask");
  title.value = "";
  description.value = "";
  date.value = "";
  subtask.value = "";
  resetPrio();
  resetCategory();
  resetContact();
  resetSubtasks();
  columns = [];
}


/**funtion to renderCategories onclick */
function renderCategories() {
  let contentList = document.getElementById("contentCategories");
  if (isClicked == false) {
    contentList.classList.remove("d-none");
    contentList.innerHTML += renderNewCategoryHTML();
    for (i = 0; i < taskCategories.length; i++) {
      let taskCategory = taskCategories[i];
      let taskColor = taskColors[i];
      contentList.innerHTML += renderCategoryHTML(taskCategory, taskColor, i);
    }
    isClicked = true;

  } else {
    hideCategoryList();
    contentList.innerHTML = "";
    isClicked = false;
  }
}


/**this function adds a new category and display it in the category inputfield */
function addNewCategory() {
  let input = document.getElementById("categoryInput");
  let addButton = document.getElementById("addCategoryButton");
  addButton.classList.add("d-none");
  let addNewButton = document.getElementById("addNewCategoryButton");
  addNewButton.classList.remove("d-none");
  input.disabled = false;
  resetCategory();
  input.placeholder = "Add New Category";
  input.style.color = "black";
  hideCategoryList();
}


/**this function pushes the newCategory in the taskcategory und taskcolor array */
function pushNewCategory() {
  let input = document.getElementById("categoryInput");
  let newInput = input.value;
  newInput = newInput.charAt(0).toUpperCase() + newInput.slice(1);
  newInput = newInput.trim();
  let newColor = getRandomColor();
  if (taskColors.includes(newColor)) {
    getRandomColor();
  }
  if (
    newInput.length >= 3 &&
    !taskCategories.includes(newInput) &&
    !taskColors.includes(newColor)
  ) {
    taskCategories.push(newInput);
    taskColors.push(newColor);
    resetCategoryInput();
    saveCategory();
  } else {
    resetCategoryInput();
    let alert = document.getElementById("categoryAlert");
    alert.innerHTML = "Please add new Category";
  }
}


/**sets back the category Inputfield */
function resetCategoryInput() {
  let input = document.getElementById("categoryInput");
  document.getElementById("addCategoryButton").classList.remove("d-none");
  document.getElementById("addNewCategoryButton").classList.add("d-none");
  input.value = "";
  input.disabled = true;
  input.placeholder = "Select Task Category";
}


/** hides the categoryList if a category is chosen
 * @param event displays the event where the click came from
*/
function hideCategoryList(event) {
  let contentList = document.getElementById("contentCategories");

  if (event && event.target && event.target.id === "addCategoryButton") {
    event.preventDefault();
  } else {
    contentList.classList.add("d-none");
  }
}


/**renders the contactList from the Array*/
function renderContactList() {
  let contactList = document.getElementById("contactList");
  if (isClicked2 == false) {
    contactList.classList.remove("d-none");
    for (i = 0; i < addContacts.length; i++) {
      let contact = addContacts[i]["name"];
      let contactColor = addContacts[i]["color"];
      contactList.innerHTML += renderContactHTML(contact, contactColor, i);
    }
    contactList.innerHTML += addNewContactToTask();
    isClicked2 = true;
  } else {
    hideContactList();
    contactList.innerHTML = "";
    isClicked2 = false;
  }
}


/**this function hides the contactList when something else is clicked
 * @param event displays where the click came from
 */
function hideContactList(event) {
  let contactList = document.getElementById("contactList");

  if (event && event.target && event.target.id === "addContactButton") {
    event.preventDefault();
  } else if (event && event.target && (event.target.id === "contactList" || contactList.contains(event.target))) {
    event.preventDefault();
  } else {
    contactList.classList.add("d-none");
  }
}


/**this function is the last items of the contactlist
 * the user will be redirected to the contactsite
 */
function addNewContactToTask() {
  return `<div><button onclick="referToContacts()" class="button btn-black width-button">
  <a href="./contacts.html">Add New Contact +</a></button></div>`;
}


function referToContacts() {
  window.location.href = "./contacts.html"; 
}


/** choses the category and shows only this category in the Inputfield
 * @param i displays which category element was chosen
*/
function chooseCategory(i) {
  let alertArea = document.getElementById("categoryAlert");
  alertArea.classList.add("d-none");

  const selectedCategoryElement = document.getElementById(`category${i}`);
  const selectedCategory = selectedCategoryElement.innerText;
  const selectedColor = selectedCategoryElement
    .querySelector("circle")
    .getAttribute("fill");

  categoryInput.value = assignedCategory = selectedCategory;
  categoryInput.style.backgroundColor = assignedCategoryColor = selectedColor;
  categoryInput.style.color = "white";
  categoryInput.style.fontWeight = "bold";
  hideCategoryList();
  document.getElementById("categoryAlert").classList.add("d-none");
}


/** resets chosen category*/
function resetCategory() {
  assignedCategory = "";
  assignedCategoryColor = "";
  const categoryInput = document.getElementById("categoryInput");
  const defaultCategory = "";
  const defaultColor = "";

  categoryInput.value = defaultCategory;
  categoryInput.style.backgroundColor = defaultColor;
  assignedCategory = defaultCategory;
  assignedCategoryColor = defaultColor;
  hideCategoryList();
}


/**adds the chosen contacts to the task and sets a highlight to the background
 * @param i displays which contact was clicked
*/
function addContactToTask(i) {
  let chosenContact = document.getElementById(`contact${i}`);
  let contact = chosenContact.querySelector(".contact-name").innerText;
  let contactColor = addContacts[i]["color"];
  let checkBox = document.getElementById(`checkboxContact${i}`);
  if (chosenContact.style.backgroundColor !== "rgb(42, 54, 71)") {
    chosenContact.style.backgroundColor = "#2a3647";
    chosenContact.style.color = "white";
    checkBox.src = "./icons/checkbutton_checked_white.svg";
    if (!assignedContacts.includes(contact)) {
      assignedContacts.push(contact);
      assignedContactColor.push(contactColor);
    }
  } else {
    checkBox.src = "./icons/checkbutton_default.svg";
    chosenContact.style.backgroundColor = "white";
    chosenContact.style.color = "black";
    let index = assignedContacts.indexOf(contact);
    let colorIndex = assignedContactColor.indexOf(contactColor);
    if (index > -1 || colorIndex > -1) {
      assignedContacts.splice(index, 1);
      assignedContactColor.splice(colorIndex, 1);
    }
  }
}


/** resets the Contacts*/
function resetContact() {
  renderContactList();
  let contactList = document.getElementById("contactList");
  contactList.classList.add("d-none");
  assignedContacts = [];
  let contacts = document.querySelectorAll('[id^="contact"]');
  contacts.forEach((contact) => {
    contact.style.backgroundColor = "white";
  });
}


/** this function adds subtasks to the mainTask and pushes it in the array*/
function addSubtask() {
  let subtaskContent = document.getElementById("subtaskContent");
  let newSubtask = document.getElementById("subtask");
  let addButton = document.getElementById("addSubtaskButton");
  let newSubtaskValue = newSubtask.value;
  if (newSubtaskValue.length < 3) {
    addButton.disabled;
  } else if (newSubtaskValue.length >= 3) {
    addButton.enabled;
    let subtaskObj = {
      value: newSubtaskValue,
      imageSrc: "./icons/checkbutton_default.svg",
      status: false,
    };
    assignedSubtasks.push(subtaskObj);
    subtaskContent.innerHTML += renderSubtaskHTML(
      subtaskObj,
      assignedSubtasks.length - 1
    );
  }

  newSubtask.value = "";
}


function keypress(event) {
  let newSubtask = document.getElementById("subtask");
  newSubtask.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && newSubtask.value.trim() !== "") {
      event.preventDefault();
      addSubtask();
    }
  });
}


function keypressAddTask(event) {
  let form = document.getElementById("myForm");
  form.addEventListener("keypress", function (event) {
    if (event.key === 'Enter') {
      addTask();
    }
  });
}


/** This function toggles the checkbox state of a subtask and updates the array
 * @param i The index of the subtask in the array
 */
function checkSubtask(i) {
  let checkbox = document.getElementById(`subtaskImage${i}`);
  if (checkbox.src.includes("checkbutton_checked")) {
    checkbox.src = "./icons/checkbutton_default.svg";
    assignedSubtasks[i].imageSrc = "./icons/checkbutton_default.svg";
    assignedSubtasks[i].status = false;
  } else {
    checkbox.src = "./icons/checkbutton_checked.svg";
    assignedSubtasks[i].imageSrc = "./icons/checkbutton_checked.svg";
    assignedSubtasks[i].status = true;
  }
}



/** This function deletes a subtask and re-renders the list
 * @param index displays the number of the subtask in the subtask array
 */
function deleteSubtask(index) {
  // Entferne das Subtask-Objekt aus dem Array
  assignedSubtasks.splice(index, 1);

  // Aktualisiere die HTML-Liste
  let subtaskContent = document.getElementById("subtaskContent");
  subtaskContent.innerHTML = ""; // Liste leeren

  // Neu rendern: Alle verbleibenden Subtasks anzeigen
  assignedSubtasks.forEach((subtaskObj, i) => {
    subtaskContent.innerHTML += renderSubtaskHTML(subtaskObj, i);
  });
}



/** resets ALL Subtasks*/
function resetSubtasks() {
  let subtaskContent = document.getElementById("subtaskContent");
  subtaskContent.innerHTML = "";
  assignedSubtasks = [];
}

/** HTML for the subtask list
 * @param subtaskObj This is the object containing all information for the subtask
 * @param i The index of the subtask in the array
 */
function renderSubtaskHTML(subtaskObj, i) {
  return `<div class="option" id="subtask-${i}"> 
    <img id="subtaskImage${i}" onclick="checkSubtask(${i})" src="${subtaskObj.imageSrc}"> 
    ${subtaskObj.value}
    <img id="subtaskBucket${i}" onclick="deleteSubtask(${i})" src="./icons/icon_bucket.svg">
    </div>`;
}




/** function to getRandomColor for the new Categories */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


/**this is the SVG which shows the color for the category
 * @param taskColor displays the saved color of the taskcategory
 */
function renderSVG(taskColor) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
    <circle cx="10" cy="10.5" r="9" fill="${taskColor}" stroke="white" stroke-width="2"></circle>
    </svg>`;
}


/**html for the addnewcategory section of the categorylist */
function renderNewCategoryHTML() {
  return `<div class="option" id="newCategory" onclick="addNewCategory()">Add New Category</div>`;
}


/**html code for the category list
 * @param taskCategory displays the saved category in the array
 * @param taskcolor displays the saved color to the category
 * @param i gives a different id to the functions in the html code
 */
function renderCategoryHTML(taskCategory, taskColor, i) {
  return `<div class="option space-between">
            <div class="space-between" id="category${i}" onclick="chooseCategory(${i})"> ${taskCategory} ${renderSVG(
    taskColor
  )}  
            </div>
            </div>`;
}


/**this function renders the contactlist html and changes the backgroundcolor, textcolor and checkbox, when a contact is chosen
 * @param contact displays the chosen contact
 * @param contactColor displays the saved contactcolor
 * @param i gives different ids to the functions and ids in the html
 */
function renderContactHTML(contact, contactColor, i) {
  let backgroundColor = assignedContacts.includes(contact) ? "#2a3647" : "";
  let checkBox = assignedContacts.includes(contact)
    ? "./icons/checkbutton_checked_white.svg"
    : "./icons/checkbutton_default.svg";
  let color = assignedContacts.includes(contact) ? "white" : "black";

  return `<div id="contact${i}" class="option" onclick="addContactToTask(${i})" style="background-color: ${backgroundColor}; color: ${color}"><div class="contact-circle" style="background-color: ${contactColor}">
    ${generateInitials(
    contact
  )}</div> <span class="contact-name">${contact}</span>
    <img id="checkboxContact${i}" src="${checkBox}">
    </div>`;
}


