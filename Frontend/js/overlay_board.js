let columns = [];
let editedContacts = [];
let editedContactColor = [];
let editedPrio = [];
let editedSubtasks = [];
let editedCol;
let editedCategory;
let editedCategoryColor;


/**this function pushes all the categories of the board in the arrays taskCategories and taskcolors */
async function pushCategories() {
    taskCategories = [];
    taskColors = [];

    for (i = 0; i < todos.length; i++) {
        if (!taskCategories.includes(todos[i]["category"])) {
            taskCategories.push(todos[i]["category"]);
            taskColors.push(todos[i]["categoryColor"]);
        }
    }
    await saveCategory();
    await loadCategory();
}


/**this function opens the overlay and shows the detailTask
 * @param index displays the number of the chosen task in the todos Array
 */
function openOverlay(index) {
    const task = todos[index];
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    document.getElementById("overlay-container").classList.remove("d-none");
    document.getElementById("showEditTask").classList.add("d-none");
    document.getElementById("showNewTask").classList.add("d-none");
    let detail = document.getElementById("showDetailTask");
    detail.classList.remove("d-none");
    pushSubtasks(index);
    detail.innerHTML = "";
    detail.innerHTML += renderDetailTask(task);
}


/**this function rebuilds the date which was saved after the mockup
 * @param task displays the chosen task
*/
function generateDate(task) {
    let date = task["date"];
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}


/**this function generates the prio of the chosen task and returns it in a readable version
 * @param task displays the chosen task
 */
function generatePrio(task) {
    let prio = task["prio"][0];
    return prio.charAt(0).toUpperCase() + prio.slice(1).toLowerCase();
}


/**this function generates the detailCOntacts from the saved task and shows the contactList
 * when there are more than 4 chosen contacts it shows and More
 * @param task displays the chosen task
 */
function generateDetailContacts(task) {
    let detailContactList = "";
    let contacts = task["assignedContact"];

    if (contacts.length > 0) {
        detailContactList = ` <p class="violett">Assigned to:</p>`;
        for (i = 0; i < Math.min(contacts.length, 4); i++) {
            let contact = contacts[i];
            contactColor = task["contactColor"][i];
            detailContactList += renderDetailContactList(contact, contactColor);
        }
        if (contacts.length > 4) {
            detailContactList += `And more`;
        }
    }
    return detailContactList;
}


/**html for the contactList
 * @param contact displays the saved contacts
 * @param contactColor displays the saved colors for the contacts
 */
function renderDetailContactList(contact, contactColor) {
    return `<div class="detailContact">
        <div class="contact-circle" style="background-color: ${contactColor}">${generateInitials(contact)}</div>&nbsp
        <div>${contact}</div></div>`;
}


/**this functions pushes all the subtask of one task in the editedSubtasks array
 * @param index displays the index of the subtask in the array
 */
function pushSubtasks(index) {
    for (i = 0; i < todos[index]['subtasks'].length; i++) {
        editedSubtasks.push(todos[index]["subtasks"][i])
    };
}


/**this function generate the subtaskList of the chosen Task
 * @param task displays the chosen task
 */
function generateDetailSubtasks(task) {
    let index = todos.indexOf(task);
    let detailSubtaskList = "";
    if (editedSubtasks.length > 0) {
        detailSubtaskList += "<p class='violett'>Subtasks</p>";

        for (let i = 0; i < editedSubtasks.length; i++) {
            let subtaskCheckBox = editedSubtasks[i]["imageSrc"];
            detailSubtaskList += renderDetailSubtasks(index, i, subtaskCheckBox);
        }
    }
    return detailSubtaskList;
}


/**html for the subtaskList
 * @param index number of the subtask in the array
 * @param i gives a different id and function to the html
 * @param subtaskCheckBox displays the checkbox whether it is checked or not and displays it
 */
function renderDetailSubtasks(index, i, subtaskCheckBox) {
    return `<div class="detailSubtask nospace-between">
    <img id="check${i}" onclick="changeDetailCheckbox(${index}, ${i})" src="${subtaskCheckBox}">&nbsp
    ${firstCharToUpperCase(editedSubtasks[i]["value"])}
    </div>`;
}


/**this function overwrites the checkbox and the status to display the progress of the subtasks in the board
 * @param index is the number of the task in the todos array
 */
async function updateTodosArray(index) {
    todos[index]["subtasks"] = editedSubtasks;
    await saveBoard();
    init();
}


/**changes the checkbox when it is clicked and overwrites it in the editedSubtasks array
 * @param index number of the task in the todos array
 * @param i number of the subtask in the editedSubtasks array
 */
function changeDetailCheckbox(index, i) {
    let checkBox = document.getElementById(`check${i}`);
    if (checkBox.src.includes("checkbutton_default")) {
        checkBox.src = "./icons/checkbutton_checked.svg";
        editedSubtasks[i]["imageSrc"] = "./icons/checkbutton_checked.svg";
        editedSubtasks[i]["status"] = true;
    } else {
        editedSubtasks[i]["imageSrc"] = "./icons/checkbutton_default.svg";
        editedSubtasks[i]["status"] = false;
        checkBox.src = "./icons/checkbutton_default.svg";
    }

    updateTodosArray(index);
}


/**this function deletes the whole task from the board
 * @param taskId number of the task in the totods array
 */
async function deleteTask(taskId) {
    const index = todos.findIndex((task) => task["id"] === taskId);
    if (index !== -1) {
        todos.splice(index, 1);
    }
    document.getElementById("overlay-container").classList.add("d-none");
    document.body.style.overflow = 'auto';
    await saveBoard();
    init();
}


/** this function shows the values of the chosen task to be edited
 * @param i number of the task in the todos array
 */
function editTask(i) {
    const task = todos[i];
    document.getElementById("showDetailTask").classList.add("d-none");
    let editTask = document.getElementById("showEditTask");
    editTask.classList.remove("d-none");
    editTask.innerHTML = renderEditTaskHTML(task);
    getNewDate();
    showEditedTask(task);
}


/**gets all the values for the taskEdit
 * @param task displays the chosen task
 */
function showEditedTask(task) {
    document.getElementById("title").value = task["title"];
    document.getElementById("description").value = task["description"];
    document.getElementById("calendar").value = task["date"];
    displayContacts(task);
    displayPrio(task);
    showEditedSubtasks(task);
}


/**gets all the contacts for the contactList
 * @param task displays the chosen task
 */
function displayContacts(task) {
    pushContacts(task);
    let contactContent = document.getElementById("contactList");
    contactContent.innerHTML = "";
    for (i = 0; i < addContacts.length; i++) {
        let contact = addContacts[i]['name'];
        let contactColor = addContacts[i]['color'];
        contactContent.innerHTML += renderEditedContactHTML(
            contact,
            contactColor,
            i, task,
        );
    } contactContent.innerHTML += addNewContactToTask();
}


/** this functions shows the contactList */
function showContactList() {
    let contactContent = document.getElementById("contactList");
    if (contactContent.classList.contains("d-none")) {
        contactContent.classList.remove("d-none");
    } else {
        hideContactList();
    }
}


/**this function pushes all the chosen contacts of the saved task in the editedContacts and editedCOntactColor array
 * @param task displays the chosen task
 */
function pushContacts(task) {
    for (i = 0; i < task["assignedContact"].length; i++) {
        editedContacts.push(task["assignedContact"][i]);
        editedContactColor.push(task["contactColor"][i]);
    }
}


/**this functions adds contacts to the editedContacts array and gives them a new backgroundcolor, textcolor and checkbox
 * @param i number of the contact in the addcontacts array
 */
function addEditedContactToTask(i) {
    let chosenContact = document.getElementById(`contact${i}`);
    let contact = chosenContact.querySelector('.contact-name').innerText;
    let contactColor = addContacts[i]['color'];
    let checkBox = document.getElementById(`checkbox-contact${i}`);
    if (chosenContact.style.backgroundColor !== "rgb(42, 54, 71)") {
        chosenContact.style.color = "white";
        checkBox.src = "./icons/checkbutton_checked_white.svg";
        chosenContact.style.backgroundColor = "#2a3647";
        if (!editedContacts.includes(contact)) {
            editedContacts.push(contact);
            editedContactColor.push(contactColor);
        }
    } else {
        chosenContact.style.backgroundColor = "white";
        chosenContact.style.color = "black";
        checkBox.src = "./icons/checkbutton_default.svg";
        let index = editedContacts.indexOf(contact);
        let colorIndex = editedContactColor.indexOf(contactColor);
        if (index > -1 || colorIndex > -1) {
            editedContacts.splice(index, 1);
            editedContactColor.splice(colorIndex, 1);
        }
    }
}


/**html for the contactlist
 * @param contact all the contacts in the addContact Array
 * @param color all the colors for the contacts in the addContact array
 * @param i gives another id and number to the functions
 * @param task displays chosen task
 */
function renderEditedContactHTML(contact, contactColor, i, task) {
    let backgroundColor = task['assignedContact'].includes(contact)
        ? "#2a3647"
        : "";
    let checkBox = task['assignedContact'].includes(contact)
        ? "./icons/checkbutton_checked_white.svg"
        : "./icons/checkbutton_default.svg";
    let color = task['assignedContact'].includes(contact) ? "white" : "black";

    return `<div id="contact${i}" class="option" onclick="addEditedContactToTask(${i})" style="background-color: ${backgroundColor}; color: ${color};">
    <div class="contact-circle" style="background-color: ${contactColor}">${generateInitials(contact)}</div> <span class="contact-name">${contact}</span>
    <img id="checkbox-contact${i}" src="${checkBox}">
  </div>`;
}


/**this function shows the prio of the chosen task and pushes it to the editedPrio Array
 * @param task displays the chosen task
 */
function displayPrio(task) {
    const prio = task.prio[0];
    const button = document.getElementById(prio.toLowerCase());
    const colors = {
        URGENT: "#FF3D00",
        MEDIUM: "#FFA800",
        LOW: "#7AE229",
    };
    const image = `./icons/priority_${prio.toLowerCase()}.svg`;
    changeImage(prio.toLowerCase());
    document.getElementById(prio.toLowerCase()).classList.add("white-text");
    button.style.backgroundColor = colors[prio];
    editedPrio.push(prio, image);
}


/**this function saves a edited prio and removes the former chosen one from the array
 * @param clickedTab displays the prio of the tab
 */
function addEditedPrio(clickedTab) {
    editedPrio = [];
    const priority = clickedTab.toUpperCase();
    const image = `./icons/priority_${priority.toLowerCase()}.svg`;

    checkEditedPrio(clickedTab);
    changeImage(clickedTab);
    document.getElementById(clickedTab).classList.add("white-text");

    editedPrio.push(priority, image);
}


/**when the button is clicked changes it the background color and the textcolor
 * @param clickedTab displays the prio
 */
function checkEditedPrio(clickedTab) {
    const tabs = ["urgent", "medium", "low"];
    const colors = ["#FF3D00", "#FFA800", "#7AE229"];

    tabs.forEach((tab, index) => {
        const backgroundColor = clickedTab === tab ? colors[index] : "white";
        document.getElementById(tab).style.backgroundColor = backgroundColor;
        document.getElementById(tab).classList.remove("white-text");
    });
    resetImages();
}


/**this function loads only the category from the server */
async function loadCategory() {
    try {
        taskCategories = JSON.parse(await getItem("taskCategories"));
        taskColors = JSON.parse(await getItem("taskColors"));
    } catch (e) {
        console.error("Loading error:", e);
    }
}


/**shows all the subtasks from the editedSubtasks array of the task*/
function showEditedSubtasks() {
    let subtaskElement = document.getElementById("subtaskContent");
    subtaskElement.innerHTML = "";
    for (let i = 0; i < editedSubtasks.length; i++) {
        let subtaskCheckBox = editedSubtasks[i]["imageSrc"];
        subtaskElement.innerHTML += renderShowEditedSubtasks(subtaskCheckBox, i);
    }
}


/** html for the subtaskslist
 * @param subtaskCheckBox this is the image whether the subtask is done or not
 * @param i gives a different id and number to the functions
 */
function renderShowEditedSubtasks(subtaskCheckBox, i) {
    return `<div class="detailSubtask">
    <img id="unchecked${i}" onclick="changeCheckbox(${i})" src="${subtaskCheckBox}">&nbsp
    ${firstCharToUpperCase(editedSubtasks[i]["value"])} 
    <div class="subtasks-icons">
    <img onclick="editChosenSubtask(${i})" src="./icons/icon_edit.svg">
    <img onclick="deleteEditedSubtask(${i})" src="./icons/icon_bucket.svg">
    </div></div>`;
}


/**the user can edit more subtasks to the list */
function editSubtask() {
    let subtaskElement = document.getElementById("subtaskContent");
    let newSubtask = document.getElementById("subtask").value;
    let addButton = document.getElementById("addSubtaskButton");
    if (newSubtask.length < 3) {
        addButton.disabled;
    } else if (newSubtask.length >= 3) {
        addButton.enabled;
        let subtaskObj = {
            value: newSubtask,
            imageSrc: "./icons/checkbutton_default.svg",
            status: false,
        };
        if (!editedSubtasks.includes(subtaskObj)) {
            editedSubtasks.push(subtaskObj);
            subtaskElement.innerHTML += renderEditSubtaskHTML(newSubtask, i)
        };
    }
    document.getElementById("subtask").value = "";
}


/**html for the new subtasks */
function renderEditSubtaskHTML(newSubtask, i) {
    return `<div class="detailSubtask">
    <img id="unchecked${editedSubtasks.length - 1}" 
    onclick="changeCheckbox(${editedSubtasks.length - 1})" 
    src="./icons/checkbutton_default.svg">${firstCharToUpperCase(newSubtask)} 
    <div class="subtasks-icons">
    <img onclick="editChosenSubtask(${i})" src="./icons/icon_edit.svg">
    <img onclick="deleteSubtask(${i})" src="./icons/icon_bucket.svg">
    </div>`;
}


/**function to change the value of the chosen subtask
 * @param i displays the number of the chosen subtask in the editedSubtasks Array
 */
function editChosenSubtask(i) {
    let input = document.getElementById('subtask');
    input.value = editedSubtasks[i]['value'];

    let img = document.getElementById('plus');
    img.src = "./icons/icon_checkmark.svg";
    img.onclick = function () { overwriteSubtask(i) };
}


/**this function overwrites the subtask in the editedSubtasksArray
 * @param i displays the number of the chosen subtask in the editedSubtasks Array
 */
function overwriteSubtask(i) {
    let input = document.getElementById('subtask');
    let newValue = input.value;
    editedSubtasks[i].value = newValue;
    showEditedSubtasks();
    input.value = '';
    let img = document.getElementById('plus');
    img.src = "./icons/plus.svg";
    img.onclick = function () { editSubtask() };
}


/** this function changes the checkbox of the chosen subtask
 * @param i displays the number of the chosen subtask in the editedSubtasks Array
 */
function changeCheckbox(i) {
    let checkBox = document.getElementById(`unchecked${i}`);
    if (checkBox.src.includes("checkbutton_default")) {
        editedSubtasks[i].imageSrc = "./icons/checkbutton_checked.svg";
        editedSubtasks[i].status = true;
        checkBox.src = "./icons/checkbutton_checked.svg";
    } else {
        editedSubtasks[i].imageSrc = "./icons/checkbutton_default.svg";
        editedSubtasks[i].status = false;
        checkBox.src = "./icons/checkbutton_default.svg";
    }
}


/**this function gets all the values for the editedTask
 * @param i displays the number of the task in the todos array
 */
async function getEditedTask(i) {
    let task = todos[i];
    let editedTitle = document.getElementById("title").value;
    let editedDescription = document.getElementById("description").value;
    let editedDate = document.getElementById("calendar").value;
    let editedTask = {
        step: task["step"],
        title: editedTitle,
        description: editedDescription,
        assignedContact: editedContacts,
        contactColor: editedContactColor,
        date: editedDate,
        prio: editedPrio,
        category: task["category"],
        categoryColor: task["categoryColor"],
        subtasks: editedSubtasks,
    };
    return editedTask;
}


/**this function overwrites and saves the editedTask in the todos array
 * @param i displays the number of the edited task in the todos Array
 */
async function addEditTask(i) {
    let editedTask = await getEditedTask(i);
    todos[i] = editedTask;
    await saveBoard();
    init();
    closeOverlay();
}


/**closes the overlay and sets the body back to overflow auto */
function closeOverlay() {
    document.getElementById("overlay-container").classList.add("d-none");
    clearAllEditTask();
    document.body.style.overflow = 'auto';
}


/**this function clears all arrays for the editedtask */
function clearAllEditTask() {
    editedContacts = [];
    editedContactColor = [];
    editedPrio = [];
    editedSubtasks = [];
    editedCol;
    editedCategory;
    editedCategoryColor;
    checkEditedPrio();
    resetEditedPrio();
}


/**this function deletes subtasks
 * @param index displays the number of the subtask in the editedSubtasks Array
 */
function deleteEditedSubtask(index) {
    editedSubtasks.splice(index, 1);
    let subtaskContent = document.getElementById('subtaskContent');
    subtaskContent.innerHTML = '';
    showEditedSubtasks();
}


/**resets the textcolor of the task */
function resetEditedPrio() {
    const priorities = ['urgent', 'medium', 'low'];
    priorities.forEach(priority => {
        document.getElementById(priority).style.color = 'black';
    });
}


/**this function opens the addTask overlay when the plus or the add task button on the board site is clicked
 * @param chosenColumn displays the column where the task will be shown on the board site
 */
function newTaskColumn(chosenColumn) {
    clearAll();
    document.getElementById('overlay-container').classList.remove('d-none');
    document.getElementById('showDetailTask').classList.add('d-none');
    document.getElementById('showEditTask').classList.add('d-none');
    document.getElementById('showNewTask').classList.remove('d-none');
    getNewDate(); 
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    columns.push(chosenColumn);
    keypress();
}
/////////////////////
// overlay logic END
