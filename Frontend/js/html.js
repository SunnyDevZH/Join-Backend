
function renderDetailTask(task) {
  return `
    <div class="todo-category width" style="background-color:${task["category_color"]
    }">
    ${task["category"]}
    </div>
    <h2>${firstCharToUpperCase(task["title"])}</h2>
    <span class="margin-top">${firstCharToUpperCase(task["description"])}</span>
    <div class="detailAlign"><p class="violett">Due Date:</p> &nbsp   ${generateDate(
      task
    )}</div>
    <div class="detailAlign"><p class="violett">Priority:</p> &nbsp   ${generatePrio(
      task
    )} &nbsp
    <img src="${task["prio"][1]}"></div>
    <div class="margin-top"> ${generateDetailContacts(task)}</div>
    <div class="detailSubtasks"> ${generateDetailSubtasks(task)}</div>
    </div>
    <div class="detail-buttons">
    <div id="delete-btn">
    <button class="stroke" type="button" onclick="deleteTask(${task["id"]
    })" class="detail-btn">
    <svg class="stroke" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_75592_9951" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
    <rect x="0.144531" width="24" height="24" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_75592_9951)">
    <path d="M7.14453 21C6.59453 21 6.1237 20.8042 5.73203 20.4125C5.34036 20.0208 5.14453 19.55 5.14453 19V6C4.8612 6 4.6237 5.90417 4.43203 5.7125C4.24036 5.52083 4.14453 5.28333 4.14453 5C4.14453 4.71667 4.24036 4.47917 4.43203 4.2875C4.6237 4.09583 4.8612 4 5.14453 4H9.14453C9.14453 3.71667 9.24036 3.47917 9.43203 3.2875C9.6237 3.09583 9.8612 3 10.1445 3H14.1445C14.4279 3 14.6654 3.09583 14.857 3.2875C15.0487 3.47917 15.1445 3.71667 15.1445 4H19.1445C19.4279 4 19.6654 4.09583 19.857 4.2875C20.0487 4.47917 20.1445 4.71667 20.1445 5C20.1445 5.28333 20.0487 5.52083 19.857 5.7125C19.6654 5.90417 19.4279 6 19.1445 6V19C19.1445 19.55 18.9487 20.0208 18.557 20.4125C18.1654 20.8042 17.6945 21 17.1445 21H7.14453ZM7.14453 6V19H17.1445V6H7.14453ZM9.14453 16C9.14453 16.2833 9.24036 16.5208 9.43203 16.7125C9.6237 16.9042 9.8612 17 10.1445 17C10.4279 17 10.6654 16.9042 10.857 16.7125C11.0487 16.5208 11.1445 16.2833 11.1445 16V9C11.1445 8.71667 11.0487 8.47917 10.857 8.2875C10.6654 8.09583 10.4279 8 10.1445 8C9.8612 8 9.6237 8.09583 9.43203 8.2875C9.24036 8.47917 9.14453 8.71667 9.14453 9V16ZM13.1445 16C13.1445 16.2833 13.2404 16.5208 13.432 16.7125C13.6237 16.9042 13.8612 17 14.1445 17C14.4279 17 14.6654 16.9042 14.857 16.7125C15.0487 16.5208 15.1445 16.2833 15.1445 16V9C15.1445 8.71667 15.0487 8.47917 14.857 8.2875C14.6654 8.09583 14.4279 8 14.1445 8C13.8612 8 13.6237 8.09583 13.432 8.2875C13.2404 8.47917 13.1445 8.71667 13.1445 9V16Z" fill="#2A3647"/>
    </g>
    </svg>
    Delete</button>
    </div>
    <div class="line height"></div>
    <div id="edit-btn">
    <button class="stroke" type ="button" onclick="editTask(${task["id"]
    })" class="detail-btn">
    <svg class="stroke" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_75592_9969" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
    <rect x="0.144531" width="24" height="24" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_75592_9969)">
    <path d="M5.14453 19H6.54453L15.1695 10.375L13.7695 8.975L5.14453 17.6V19ZM19.4445 8.925L15.1945 4.725L16.5945 3.325C16.9779 2.94167 17.4487 2.75 18.007 2.75C18.5654 2.75 19.0362 2.94167 19.4195 3.325L20.8195 4.725C21.2029 5.10833 21.4029 5.57083 21.4195 6.1125C21.4362 6.65417 21.2529 7.11667 20.8695 7.5L19.4445 8.925ZM17.9945 10.4L7.39453 21H3.14453V16.75L13.7445 6.15L17.9945 10.4Z" fill="#2A3647"/>
    </g>
    </svg>
    Edit</button>
    </div>`;
}


function renderEditTaskHTML(task) {
  return `
  <form onsubmit="addEditTask(${task["id"]});return false">
            <div onclick="hideContactList(event)" class="input-column">
              <div class="left-column">
                <div class="input-form margin">
                  <span>Title</span>
                  <input id="title" required placeholder="Enter a Title" />
                </div>
                <div class="input-form margin">
                  <span>Description</span>
                  <textarea id="description" required placeholder="Enter a Description"></textarea>
                </div>
                <div class="input-form margin">
                  <span>Assigned to</span>
                  <div class="input-with-button">
                    <input class="width" disabled placeholder="Select Contacts to Assign" />
                      <img id="addContactButton" class="input-image" onclick="showContactList()" src="./icons/dropdown.svg" />
                  </div>
                  <div class="list d-none" id="contactList"></div>
                </div>
              </div>
              <div class="line"></div>
              <div class="right-column">
                <div class="input-form margin">
                  <span>Due date</span>
                  <input type="date" id="calendar" required placeholder="dd/mm/yyyy" />
                </div>
                <div class="input-form margin">
                  <span>Prio</span>
                  <div class="prio-buttons">
                    <button class="prio" type="button" id="urgent" onclick="addEditedPrio('urgent')">
                      URGENT <img id="urgent-img" src="./icons/priority_urgent.svg" />
                    </button>
                    <button class="prio" type="button" id="medium" onclick="addEditedPrio('medium')">
                      MEDIUM <img id="medium-img" src="./icons/priority_medium.svg" />
                    </button>
                    <button class="prio" type="button" id="low" onclick="addEditedPrio('low')">
                      LOW <img id="low-img" src="./icons/priority_low.svg" />
                    </button>
                  </div>
                  <div id="priorityAlert"></div>
                </div>
                <div class="input-form">
                <span>Subtasks</span>
                <div>
                  <input id="subtask" minlength="3" placeholder="Add new subtask" />
                  <div class"addedit">
                    <img onclick="editSubtask()" id="addSubtaskButton" src="./icons/plus.svg" />
                  </div>
                  
                </div>
              </div>
                  <div id="subtaskContent"></div>
                </div>
              </div>
            </div>
            <div class="ok-button">
              <button type="submit">
                OK<img src="./icons/correct_white.svg" />
              </button>
            </div>
          </form>`;
}