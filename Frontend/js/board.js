// for testing
let todos = [];

let currentDraggedElement;

let colId = {
  "col-01": "Todo",
  "col-02": "In<br>Progress",
  "col-03": "Await<br>Feedback",
  "col-04": "Done",
};

let btnLeft = "<div></div>";
let btnRight = "";

function init() {
  loadTodos();
  updateHTML();
}

/**
 * preload all todos for the board
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
    todos = newTodos.map((todo, index) => ({
      ...todo,
      id: index, // ID hinzufügen
    }));

    // Bestehende Logik aufrufen
    updateHTML();
    pushCategories();
  } catch (error) {
    console.error("Failed to load todos:", error);
  }
}


/**
 * update all board elements
 * fill the columns with tasks
 */
function updateHTML() {
  let col = [];

  for (let i = 1; i <= 4; i++) {
    col[i - 1] = todos.filter((t) => t["step"] == "col-0" + i);
    document.getElementById("col-0" + i).innerHTML = "";
    if (col[i - 1].length == 0) {
      document.getElementById("col-0" + i).innerHTML = generateEmptyTodo();
    }
    col[i - 1].forEach((todo) => {
      const element = todo;
      document.getElementById("col-0" + i).innerHTML += generateTodo(
        element,
        i
      );
    });
  }
}

/**
 * generate todo elements
 * @param {*} element todo data from the server
 * @returns html code for the task
 */
function generateTodo(element, col) {
  generateMobileColChnage(element, col);
  return `
  <div draggable='true' ondragstart='startDragging(${
    element["id"]
  })' class='todo'>
  <div class="btns-change-col">
    ${btnLeft}
    ${btnRight}
  </div>
  <div onclick="openOverlay(${element["id"]})">
    <div  class="todo-category-container">
      <div class="todo-category" style="background-color:${
        element["categoryColor"]
      }">${element["category"]}
      </div>  
    </div> 
    <div class="todo-title">${firstCharToUpperCase(element["title"])}</div>
    <div class="todo-content">${firstCharToUpperCase(
      element["description"]
    )}</div>
    ${generateSubtasks(element)}
    <div class="todo-footer">
      <div class="todo-avatar-container">
      ${generateContacts(element)}
      </div>
      <img src="${element["prio"][1]}">
    </div>
    </div>
    </div>
    `;
}

/**
 * generate column change buttons for mobile
 * @param element  todo element
 * @param col actual column
 */
function generateMobileColChnage(element, col) {
  colChangeId = element["id"];
  if (col == 1) {
    btnLeft = "<div></div>";
    btnRight = generateChangeButton(
      "col-02",
      "icons/arrow_right_default.svg",
      "right"
    );
  } else if (col == 2) {
    btnLeft = generateChangeButton(
      "col-01",
      "icons/arrow_left_default.svg",
      "left"
    );
    btnRight = generateChangeButton(
      "col-03",
      "icons/arrow_right_default.svg",
      "right"
    );
  } else if (col == 3) {
    btnLeft = generateChangeButton(
      "col-02",
      "icons/arrow_left_default.svg",
      "left"
    );
    btnRight = generateChangeButton(
      "col-04",
      "icons/arrow_right_default.svg",
      "right"
    );
  } else if (col == 4) {
    btnLeft = generateChangeButton(
      "col-03",
      "icons/arrow_left_default.svg",
      "left"
    );
    btnRight = "<div></div>";
  }
}

function generateChangeButton(col, imgSrc, dir) {
  if (dir == "left") {
    return `
  <div class="btn-col" onclick="mobileMoveTo('${col}', ${colChangeId})">
  <img src=${imgSrc}>  
  ${colId[col]}
  </div>
  `;
  } else {
    return `
  <div class="btn-col" onclick="mobileMoveTo('${col}', ${colChangeId})">
    ${colId[col]}
    <img src=${imgSrc}>
  </div>
  `;
  }
}

/**
 * generate contact list for the board tasks
 * @param {*} element todo data from the server
 * @returns html code with all generated contacs
 */
function generateContacts(element) {
  let contactList = "";

  // Überprüfe, ob "assigned_contact" existiert und ein Array ist
  if (Array.isArray(element["assigned_contact"]) && element["assigned_contact"].length > 0) {
    for (let i = 0; i < element["assigned_contact"].length; i++) {
      // Prüfe, ob "contact_color" existiert und den Index enthält
      if (!Array.isArray(element["contact_color"]) || !element["contact_color"][i]) {
        console.warn(`Missing contact color for contact ${i}`);
        continue;
      }

      // Initialen generieren
      const initials = generateInitials(element["assigned_contact"][i]);
      const contactColor = element["contact_color"][i];

      // HTML für den Kontakt hinzufügen
      contactList += `<div class="todo-avatar" style="background-color: ${contactColor}; left:${
        i * 30
      }px">${initials}</div>`;

      // Stoppe bei mehr als 4 Kontakten
      if (i >= 4) {
        break;
      }
    }
    return contactList;
  } else {
    // Fallback für keine Kontakte
    return `<div class="no-avatar" style="background-color: #FF4646;">No Contacts</div>`;
  }
}

/**
 * generate html code with all the subtask from the element
 * @param {*} element todo data from the server
 * @returns html code with generated subtasks
 */
function generateSubtasks(element) {
  if (element["subtasks"].length > 0) {
    let finishedTasks = element["subtasks"].filter((t) => t["status"] == true);

    let progress = (100 / element["subtasks"].length) * finishedTasks.length;
    return `<div class="todo-subtasks">
    <div class="status-bar">
      <div class="status-progress" style="width: ${progress}%"></div>
    </div>
    ${finishedTasks.length}/${element["subtasks"].length} Subtasks</div>`;
  } else {
    return "";
  }
}

/**
 * generate html code for empty columns
 * @returns empty task element
 */
function generateEmptyTodo() {
  return `
  <div class='emptyTodo'>
  <p>No Todos</p>
  </div>
    `;
}

/**
 * drag an drop logic
 * @param id id of the dragged element
 */
function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * change column and category for the dragged element
 * @param {*} category new category for the element
 */
function moveTo(category) {
  todos[currentDraggedElement]["step"] = category;
  updateHTML();
  saveBoard();
}

/**
 * change column and category for the dragged element
 * @param category new category for the element
 * @param element actual element
 */
function mobileMoveTo(category, element) {
  todos[element]["step"] = category;
  updateHTML();
  saveBoard();
}

/**
 * add or remove highlight while dragging
 * @param id id of the dragged element
 */
function highlight(id) {
  document.getElementById(id).classList.add("col-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("col-highlight");
}

/**
 * Save the current board data to the server
 */
async function saveBoard() {
  try {
    const url = "http://127.0.0.1:8000/api/tasks/";

    for (const todo of todos) {
      // Überprüfen, ob ein Datum vorhanden ist, andernfalls aktuelles Datum verwenden
      const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

      const payload = {
        id: todo.id || null, // ID setzen, falls vorhanden
        title: todo.title || "",
        description: todo.description || "",
        category: todo.category || "",
        category_color: todo.categoryColor || "#000000", // Standardfarbe
        step: todo.step || "col-01", // Standardspalte
        prio: todo.prio || ["LOW", "./icons/priority_low.svg"], // Standardpriorität
        subtasks: todo.subtasks || [], // Leere Liste als Fallback
        assigned_contact: todo.assigned_contact || [],
        contact_color: todo.contact_color || [],
        date: todo.date || currentDate, // Standarddatum, falls leer
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Failed to save task:", payload.title, errorDetails);
        throw new Error(`Server error: ${response.status}`);
      }
    }
    updateHTML();

    console.log("All tasks successfully saved to the server.");
  } catch (error) {
    console.error("Failed to save the board to the server:", error);
  }
  updateHTML();
}



// make the first character of a string (element) uppercase
function firstCharToUpperCase(element) {
  return element.charAt(0).toUpperCase() + element.slice(1);
}

/**
 * search logic for the kanban
 */
function searchTasks() {
  let col = [];
  let substring = document.getElementById("board-search").value.toLowerCase();
  console.log(substring);

  for (let i = 1; i <= 4; i++) {
    console.log(todos["title"]);
    col[i - 1] = todos.filter(
      (t) =>
        t["step"] == "col-0" + i &&
        (t["title"].toLowerCase().includes(substring) ||
          t["description"].toLowerCase().includes(substring))
    );
    console.log(col[i - 1]);
    document.getElementById("col-0" + i).innerHTML = "";
    if (col[i - 1].length == 0) {
      document.getElementById("col-0" + i).innerHTML = generateEmptyTodo();
    }
    col[i - 1].forEach((todo) => {
      document.getElementById("col-0" + i).innerHTML += generateTodo(todo);
    });
  }
}
