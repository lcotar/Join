/**
 * Render the full form for adding a task.
 * Combines the HTML output of multiple sub-functions that each create different parts of the form, including title, description, assignment, due date, priority, category, subtasks and footer.
 * Sets the combined HTML string as the content of the form element with the ID “myForm”.
 */
async function renderAddTask() {
  let addTaskForm = renderAddTaskTitle();
  addTaskForm += renderAddTaskDescription();
  addTaskForm += renderAddTaskAssignetTo();
  addTaskForm += renderAddTaskDueDate();
  addTaskForm += renderAddTaskPrio();
  addTaskForm += renderAddTaskCategorie();
  addTaskForm += renderAddTaskSubtasks();
  addTaskForm += renderAddTaskFooter();
  document.getElementById("myForm").innerHTML = addTaskForm;

  let inputField = document.getElementById("taskSubtasks");

  if (inputField) {
    inputField.addEventListener("focus", () => {
      document
        .getElementById("outer-input-field")
        .classList.add("mark-outer-input-field");
    });
    inputField.addEventListener("blur", () => {
      document
        .getElementById("outer-input-field")
        .classList.remove("mark-outer-input-field");
    });
  }

  let container = document.getElementById("checkBoxes");
  if (container) {
    document.addEventListener("click", function (event) {
      if (!container.contains(event.target)) {
        toggleDropdown(event);
      }
    });
  }
}

/**
 * Close contact dropdown when dropped out and click anywhere
 * @param {} event
 */
async function toggleDropdown(event) {
  let assignedToInput = document.getElementById("checkBoxes");
  if (!show) {
    assignedToInput.style.display = "none";
    show = true;
  }
}

/**
 * Renders the HTML code for the title area of a task form.
 * Returns an HTML string containing an input field for the task title and a corresponding label caption.
 * The input field is marked as required and contains placeholder text that prompts the user to enter a title.
 *
 * @returns {string} The HTML code for the title area of the task form.
 */
function renderAddTaskTitle() {
  return /* html */ `<div class="addTaskForm">
                <div class="addTaskLeft addTaskWidth">
                    <div class="addTaskTitle formRow">
                        <label for="" class="titleAddTask">Title<b class="require">*</b></label>
                        <input type="text" name="title" id="taskTitle" class="addTaskInput" placeholder="Enter a Title" required/>
                    </div>`;
}

/**
 * Renders the HTML code for the description area of a task form.
 * Returns an HTML string containing a textarea field for the description of the task and a corresponding label caption.
 * The textarea field is marked as required and contains placeholder text that prompts the user to enter a description.
 *
 * @returns {string} The HTML code for the description area of the task form.
 */
function renderAddTaskDescription() {
  return /* html */ `<div class="addTaskDescription formRow">
                <label class="lblDescription" for="">Description<b class="require">*</b></label>
                <div class="addTaskTextArea">
                    <textarea name="description" id="taskDescriptionArea" class="DescriptionTXTArea" cols="30" rows="10"
                         placeholder="Enter a Description" required></textarea>
                </div>
            </div>`;
}

/**
 * Render the HTML code for the task assignment section of a form.
 * Returns an HTML string containing an input field for selecting assigned users, a drop-down menu for selecting options and an area for displaying the checkboxes.
 * The input field has a placeholder text and a click event that toggles the visibility of the checkboxes.
 *
 * @returns {string} The HTML code for the section for assigning tasks in the form.
 */
function renderAddTaskAssignetTo() {
  return /*html */ `<div class="addTaskAssigned formRow">
      <label class="lblAssigned">Assigned to</label>
      <div id="choosing-contact" class="choosingContact" onclick="toggleCheckboxes(event)">
        <img class="dropdown-arrow" src="./assets/img/dropdown-arrow-down.png" alt=""/>
        <input type="text" name="assignedTo" class="AssignedToContact addTaskInput" id="taskAssignedTo" placeholder="Select options"/>
      </div>
      <div class="checkboxName" id="checkBoxes" onclick="event.stopPropagation()">
        <div class="dropdownUsername" id="checkboxUsername" ></div>
      </div>
    </div>
    <div class="showCheck" id="showCheck">        
    </div></div>`;
}

/**
 * render user icons for assigned contacts after closing dropdown
 */
function renderUserIcons() {
  let userIcons = document.getElementById(`showCheck`);
  let userIconHtml = "";
  for (let i = 0; i < assigningTo.length; i++) {
    let userName = allContacts[`${assigningTo[i]}`].name;
    let colorCode = allContacts[`${assigningTo[i]}`].color;
    userName = getInitials(userName);
    userIconHtml += `<span style="background-color: ${colorCode}" class="user-in">${userName}</span>`;
  }
  userIcons.innerHTML = userIconHtml;
}

/**
 * Render the HTML code for the due date field of a task form.
 * Returns an HTML string containing an input field for the due date of the task and a corresponding label caption.
 * The input field uses the date input type and is marked as required.
 *
 * @returns {string} The HTML code for the due date field in the task form.
 */
function renderAddTaskDueDate() {
  return /*html */ `<div class="addTaskLine"></div>
            <div class="addTaskRight addTaskWidth">
            <div class="addTaskDueDate formRow">
                <label for="" class="addTaskDate" >Due date<b class="require">*</b></label>
                <div class="taskCalender">
                    <input for="" id="taskDate" class="addDate addTaskInput" type="date" required min="${setDate()}"/>
                </div>
            </div>`;
}

/**
 * Render the HTML code for the priority section of a task form.
 * Returns an HTML string containing three buttons for selecting the priority (high, medium, low), including icons and corresponding labels.
 * Each button has an `onclick` event that calls the `getTaskPrio` function to set the selected priority.
 *
 * @returns {string} The HTML code for the priority area in the task form.
 */
function renderAddTaskPrio() {
  return /*html */ `<div class="addTaskPrio formRow">
                <label for="">Prio</label>
                <div class="prioBTNS">
                    <button id="high" type="button" class="addTaskBTN addTaskHover urgents" value="1" onclick="getTaskPrio('high')">
                        Urgent
                        <div class="addTaskBTNImg">
                            <img src="./assets/img/prio-high.svg" alt="" class="urgentIMG">
                        </div>
                    </button>
                    <button id="medium" type="button" class="addTaskBTN addTaskHover mediums active" value="1" onclick="getTaskPrio('medium')">
                        Medium
                        <div class="addTaskBTNImg">
                            <img src="./assets/img/prio-medium.svg" alt="" class="mediumIMG">           
                        </div>
                    </button>
                    <button id="low" type="button" class="addTaskBTN addTaskHover lows" value="1" onclick="getTaskPrio('low')">
                        Low
                        <div class="addTaskBTNImg">
                            <img src="./assets/img/prio-low.svg" alt="" class="lowIMG"/>
                        </div>
                    </button>
                </div>
            </div>`;
}

/**
 * Renders the HTML code for the category area of a task form.
 * Returns an HTML string containing a drop-down menu for selecting the task category and a corresponding label caption.
 * The drop-down menu contains two options: “Technical Task” and “User Story”, and is marked as required.
 *
 * @returns {string} The HTML code for the category section in the task form.
 */
function renderAddTaskCategorie() {
  return /*html */ `<div class="addTaskCategory formRow">
                <label class="lblCategory" for="">Category<b class="require">*</b></label>
                <select id="task_category" class="taskCategorySelection" required>
                    <option value="" hidden>Select task category</option>
                    <option value="technical">Technical Task</option>
                    <option value="story">User Story</option>
                </select>
            </div>`;
}

/**
 * Renders the HTML code for the subtask area of a task form.
 * Returns an HTML string containing an input field for new subtasks, buttons for adding and deleting subtasks, and icons for interaction.
 * The layout includes a plus symbol for adding subtasks, buttons for deleting and confirming subtasks and an area for displaying the added subtasks.
 *
 * @returns {string} The HTML code for the subtask area in the task form.
 */
function renderAddTaskSubtasks_OLD() {
  return /*html */ `<div class="addTaskSubtasks formRow">
                <label class="lblSubtasks">Subtasks</label>
                <div class="addTaskPlus" id="addTaskBTNPlus">
                    <img class="addTaskPlusIMG" id="addNewTask" src="./assets/img/icon/add.svg" onclick="showAddAndDeleteSubTask()"/>
                </div>
                <div class="addTaskCheckDel" id="addTaskCheckDel">
                    <img id="delSubtasks" src="./assets/img/icon/close.svg" alt="" onclick="delTask()" class="delContent"/>
                    <img id="check" src="./assets/img/check.svg" onclick="addNewSubTask()" class="accept"/>
                </div>
                    <input class="addTaskSubs addTaskInput" id="taskSubtasks" placeholder="Add new subtask" type="text"/>
                </div>
            <div class="getSubtask" id="getSubtask"></div>
        </div>
    </div>`;
}

function renderAddTaskSubtasks() {
  return /*html */ `<div class="addTaskSubtasks formRow">
                        <label class="lblSubtasks">Subtasks</label>
                        <div id="outer-input-field" class="addTaskSubs addTaskInput flex-input">
                            <input class="inner-input-field" id="taskSubtasks" placeholder="Add new subtask" type="text"/>
                            <div class="addTaskPlus flex-end" id="addTaskBTNPlus">
                                <img class="addTaskPlusIMG" id="addNewTask" src="./assets/img/icon/add.svg" onclick="showAddAndDeleteSubTask()"/>
                            </div>
                            <div class="addTaskCheckDel flex-icons d-none" id="addTaskCheckDel">
                                <img id="delSubtasks" src="./assets/img/icon/close.svg" alt="" onclick="delTask()" class="delContent"/>
                                <img id="check" src="./assets/img/check.svg" onclick="addNewSubTask()" class="accept"/>
                            </div>
                        </div>
                <div class="getSubtask" id="getSubtask"></div>
            </div>
        </div>`;
}

/**
 * Renders the HTML code for the footer area of a task form.
 * Returns an HTML string containing a hint message for required fields and two buttons for resetting and creating the task.
 * The buttons contain icons and have `onclick` events that call the `clearContent` and `createTask` functions.
 *
 * @returns {string} The HTML code for the footer area in the task form.
 */
function renderAddTaskFooter() {
  return /*html */ `<div class="addTaskFooter">
                <p class="requiring"><b class="require">*</b>This field is required</p>
                <div class="BTNFooter">
                    <button class="clearBTNFooter" onclick="clearContent()">
                        Clear
                        <img src="./assets/img/icon/close.svg" alt="" class="cancelX"/>
                    </button>
                    <button class="creatingBTNFooter" onclick="createTask()">
                        Create Task
                        <img src="./assets/img/icon/check.svg" alt="" class="check" type="submit"/>
                    </button>
                </div>
            </div>`;
}
