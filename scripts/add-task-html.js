let currentState = [
  {
    toDo: [],
  },

  {
    inProgress: [],
  },

  {
    awaitFeedback: [],
  },

  {
    done: [],
  },
];

let priority = [
  {
    high: [],
  },

  {
    medium: [],
  },

  {
    low: [],
  },
];

/**
 * The function `renderGenerateCheckBox` generates HTML code for a checkbox element with user
 * initials and name.
 * @param element - The `element` parameter in the `renderGenerateCheckBox` function seems to
 * represent an object with properties like `name`, `color`, and possibly other properties. The
 * function generates HTML markup for a checkbox element based on the properties of this `element`
 * object.
 * @param i - The `i` parameter in the `renderGenerateCheckBox` function is used as an index or
 * identifier for the element being rendered. It is typically used to uniquely identify elements in a
 * list or array, such as when generating checkboxes dynamically in a loop.
 * @returns The function `renderGenerateCheckBox` is returning an HTML template string that
 * generates a checkbox element with a label, user initials, and a name based on the input element and
 * index `i`.
 */
function renderGenerateCheckBox(element, key) {
  return /*html*/ `        
    <label class="lblCheckBox">
        <div class="checkboxName">
            <div class="boardTask_userInitial checkboxInitial" style="background-color:${
              element.color
            }">
                ${getInitials(element.name)}
            </div>
            <p>${element.name}</p>
        </div>
        <div class="checkboxWrapper27">
            <label class="checkbox">
                <input type="checkbox" name="optionen" value="${key}" onchange="handleCheckboxChange(event)">
                <span class="checkboxIcon paddingRight"></span>
            </label>
        </div>
    </label>
  `;
}

function handleCheckboxChange(event) {
  const contactId = event.target.value;

  if (event.target.checked) {
    if (!assigningTo.includes(contactId)) {
      assigningTo.push(contactId);
    }
  } else {
    const index = assigningTo.indexOf(contactId);
    if (index > -1) {
      assigningTo.splice(index, 1);
    }
  }
}

/**
 * The function `renderSearchNameFromList` generates HTML markup for displaying a guest's name and
 * initial with a checkbox.
 * @param element - The `element` parameter in the `renderSearchNameFromList` function represents
 * an object containing information about a guest. It likely has properties such as `name`, `color`,
 * and other relevant details.
 * @param initial - The `initial` parameter in the `renderSearchNameFromList` function represents
 * the initial of a guest's name. It is used to display the initial inside a colored box next to the
 * guest's full name in the rendered HTML output.
 * @returns The function `renderSearchNameFromList` returns an HTML template string that includes
 * a label element containing the guest's name and initial, along with a checkbox input element.
 */
function searchNameFromGuestList() {
  let idInput = document.getElementById("taskAssignedTo").value;
  idInput = idInput.toLowerCase();

  let id = document.getElementById("checkboxUsername");

  id.innerHTML = "";
  for (let i = 0; i < guesteArray.length; i++) {
    const element = guesteArray[i];
    let initial = getInitials(element.name);
    if (element.name.toLowerCase().includes(idInput)) {
      id.innerHTML += renderSearchNameFromList(element, initial);
    }
  }
}

/**
 * The function `renderGetSubtasks` generates HTML elements for displaying and editing subtasks
 * within a task.
 * @param i - The parameter `i` in the `renderGetSubtasks` function is used as an index or
 * identifier for the subtask being rendered. It is used to dynamically generate unique IDs for
 * elements within the rendered HTML template.
 * @param element - The `element` parameter in the `renderGetSubtasks` function represents the
 * content of a subtask that will be displayed in the rendered HTML. It is used to dynamically generate
 * a section of HTML code for displaying and editing subtasks within a task.
 * @returns The `renderGetSubtasks` function returns a string containing HTML elements for
 * displaying a subtask with options to edit and delete.
 */
function renderGetSubtasks(i, element) {
  return /* html */ `
    <div class="showTaskSubtaskEditBTN" id="showTaskSubtaskEditBTN${i}">
        <input type="text" id="showTaskSubtaskEditInput${i}" value="${element}">
        <div class="editingDeleting">
            <img src="./assets/img/delete.svg" alt="" onclick="delNewTask(${i})" class="delSubtask">
            <img src="./assets/img/check.svg" alt="" onclick="saveEditNewTask(${i})" class="subtaskTakeover">
        </div>
    </div>

    <div class="editSubtasks_delEdit">
        <div class="showTask"><li>${element}</li></div>
        <div class="showSubTask">
            <img class="imgHoverBTN" src="./assets/img/edit.svg" onclick="EditNewSubTask(${i})">
            <div class="crossLine"></div>
            <img class="imgHoverBTN" src="./assets/img/delete.svg"  onclick="delNewTask(${i})">
        </div>
    </div>
    `;
}

/**
 * Displays an overlay element that serves as a loading indicator.
 * Creates a `div` element, positions it as a fixed overlay over the entire page, and adds it to the `body`.
 * The overlay element has a semi-transparent black background and displays the text “Loading...” in white.
 */
function showLoadingOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "loadingOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.innerHTML = `<div style="color: white; font-size: 24px;">Loading...</div>`;
  document.body.appendChild(overlay);
}
