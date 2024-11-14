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
  await load();
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
  await saveTask();
  clearAll();
  animation();
  setTimeout(function () {
    window.location.href = "./board.html";
  }, 1000);
}


/**this function gets all the values from inputfields and has the values for the TASK JSON */
function getTask() {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let date = document.getElementById("calendar").value;
  let task = {
    step: showColumn(),
    title: title,
    description: description,
    assignedContact: assignedContacts,
    contactColor: assignedContactColor,
    date: date,
    prio: assignedPrio,
    category: assignedCategory,
    categoryColor: assignedCategoryColor,
    subtasks: assignedSubtasks,
  };
  return task
}


/**this function gets the column for section of the task */
function showColumn() {
  if (typeof columns === 'undefined' || columns.length == 0) {
    return 'col-01';
  }
  else {
    return columns[0];
  }
}


/**this is the animation when a task is added to board */
function animation() {
  document.getElementById("animationBox").classList.remove("d-none");
  document.getElementById("animationBox").classList.add("animation");
}


/** checks if the Prio was chosen, if not there is an alert.*/
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


/** checks if the Category was chosen, if not there is an alert*/
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


/** saves the tasks to the server*/
async function saveTask() {
  await setItem("allTasks", JSON.stringify(allTasks));
}


/**this function saves only the categoryto the server for mathcing it with the board to only show used categories */
async function saveCategory() {
  await setItem("taskCategories", JSON.stringify(taskCategories));
  await setItem("taskColors", JSON.stringify(taskColors));
}


/**this function loads all items from the server */
async function load() {
  try {
    taskCategories = JSON.parse(await getItem("taskCategories"));
    taskColors = JSON.parse(await getItem("taskColors"));
    allTasks = JSON.parse(await getItem("allTasks"));
    addContacts = JSON.parse(await getItem("addContacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}


/** gets the date of today, so the user cannot chose previous dates*/
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


/** clears the PrioButtons and the Array*/
function resetPrio() {
  assignedPrio = [];
  const tabs = ["urgent", "medium", "low"];
  const defaultColors = ["white", "white", "white"];

  tabs.forEach((tab, index) => {
    document.getElementById(tab).style.backgroundColor = defaultColors[index];
  });
}


/** function to clear all inputfields*/
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


/**this function changes the checkboxes when a subtask is done or not and overwrites the array
 * @param i displays the number of the subtask in the array
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


/**this function deletes the subtask
 * @param index displays the number of the subtask in the subtaskarray
 */
function deleteSubtask(index) {
  assignedSubtasks.splice(index, 1);
  let subtaskContent = document.getElementById("subtaskContent");
  subtaskContent.innerHTML = "";
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


/**html for the subtasklist
 * @param subtaskObj this is the array for all the infromations of the subtask
 * @param i displays the chosen subtask and gives different ids to the html ids and the functions 
 */
function renderSubtaskHTML(subtaskObj, i) {
  return `<div class="option"> 
    <img id="subtaskImage${i}" onclick="checkSubtask(${i})" src="${subtaskObj.imageSrc}"> ${subtaskObj.value}
    <img id="subtaskBucket${i}" onclick="deleteSubtask(${i})" src="./icons/icon_bucket.svg">
    </div>`;
}
