let BASE_URL =
  "https://join-6878f-default-rtdb.europe-west1.firebasedatabase.app/";

let BASE_URL_addTask =
  "https://join-6878f-default-rtdb.europe-west1.firebasedatabase.app/task";

let BASE_URL_Contacts =
  "https://join-6878f-default-rtdb.europe-west1.firebasedatabase.app/contact";

let subtask = [];
let assigningTo = [];
let allContacts = [];
let allContactIds = [];
let show = true;

/**
 * Loads guest data from the server and stores it in an array.
 * Retrieves a JSON file from a specified URL and converts the data into an array of objects.
 * Handles possible errors during retrieval and displays appropriate error messages in the console.
 */
async function loadGestFromServer() {
  try {
    const response = await fetch(`${BASE_URL_Contacts}.json`);
    if (!response.ok) {
      throw new Error("Netzwerkantwort war nicht ok.");
    }
    const data = await response.json();
    guesteArray = Object.keys(data).map((id) => ({
      id,
      ...data[id],
    }));
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

/**
 * Changes the priority of a task based on the click of a button.
 * Activates the clicked button, deactivates all others and saves the priority as text.
 * Removes the active class if the button is already active and updates the priority accordingly.
 */
function getTaskPrio(id) {
  const button = document.getElementById(id);

  if (button.classList.contains("active")) {
    button.classList.remove("active");
  } else {
    document.querySelectorAll(".addTaskBTN").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    userPriotity = button.innerText.trim();
  }
}

/**
 * Shows the elements for adding and deleting subtasks.
 * Hides the button for adding a new task and shows the delete and check buttons instead.
 * Changes the visibility and display of the corresponding elements based on their IDs.
 */
function showAddAndDeleteSubTask() {
  document.getElementById("addTaskBTNPlus").classList.add("d-none");
  document.getElementById("addTaskCheckDel").classList.remove("d-none");
  let BTNPlus = document.getElementById("addTaskBTNPlus");
  let del = document.getElementById("delSubtasks");
  let check = document.getElementById("check");
}

/**
 * Deletes the content of the subtask input field and restores the original buttons.
 * Sets the value of the subtask input field to empty, hides the delete and check buttons and displays the add button again.
 * Changes the display and visibility of the corresponding elements based on their IDs.
 */
function delTask() {
  document.getElementById("addTaskBTNPlus").classList.remove("d-none");
  document.getElementById("addTaskCheckDel").classList.add("d-none");
  document.getElementById("taskSubtasks").value = "";
}

/**
 * Adds a new subtask and updates the display of subtasks.
 * Checks whether the input field for subtasks contains a value, adds it to the global list of subtasks and updates the display.
 * Hides the check and delete buttons, shows the plus button again and resets the input field.
 */
function addNewSubTask() {
  let subtaskInput = document.getElementById("taskSubtasks");
  if (subtaskInput.value) {
    subtask.push({
      description: subtaskInput.value,
      status: false, // Standardstatus, kann je nach Anwendungslogik angepasst werden
    }); // Füge den neuen Subtask zur globalen subtask-Liste hinzu
  }
  getSubTaskAddTask(); // Update the display of the subtasks
  /*check.style.display = "none"; // Hide the check button
  del.style.display = "none"; // Hide the delete button
  BTNPlus.style.visibility = "initial"; // Show the plus button+/

  */
  document.getElementById("addTaskBTNPlus").classList.remove("d-none");
  document.getElementById("addTaskCheckDel").classList.add("d-none");
  subtaskInput.value = ""; // Reset the input field
}

/**
 * Refreshes the display of the list of subtasks on the web page.
 * Deletes the current content of the element displaying the subtasks and adds the current list of subtasks.
 * Iterates over the global list of subtasks and adds each subtask to the HTML content by calling the `renderGetSubtasks` function.
 */
function getSubTaskAddTask() {
  let getSubtask = document.getElementById("getSubtask");
  getSubtask.innerHTML = "";

  if (subtask) {
    for (let i = 0; i < subtask.length; i++) {
      const element = subtask[i]["description"];
      getSubtask.innerHTML += renderGetSubtasks(i, element);
    }
  }
}

/**
 * Deletes the content of the subtask area and resets all relevant input fields and variables.
 * Removes the contents of the div container with the ID “getSubtask”, resets the global variable “subtask” and the input field for subtasks, and resets the form.
 * Subsequently updates the display of subtasks by calling the function `getSubTaskAddTask`.
 */
function clearContent() {
  document.getElementById("showCheck").innerHTML = "";

  // Delete the content of the div container with the ID “getSubtask”
  document.getElementById("getSubtask").innerHTML = "";

  // Reset the global variable “subtask”
  subtask = [];

  // Empty the input field for subtasks
  document.getElementById("taskSubtasks").value = "";

  // Reset the form
  document.getElementById("myForm").reset();

  // Update the display of the subtasks
  getSubTaskAddTask();
}

/**
 * create Task and switching to the Board.
 */
function getValue(id) {
  return document.getElementById(id).value.trim();
}

/**
 * Creates a task object based on the form input and the current application state.
 * Reads the values of the title, description, due date, category and priority fields from the form as well as the assigned users and subtasks.
 * If the window name is set, the current state is set based on it and the created task object is returned.
 */
function getTaskFromForm() {
  const priorityElement = document.querySelector(".prioBTNS .active"); // Find the active priority button
  const priority = priorityElement ? priorityElement.id : "";

  if (window.name) {
    currentState = window.name;
  }

  const task = {
    title: getValue("taskTitle"),
    description: getValue("taskDescriptionArea"),
    dueDate: getValue("taskDate"),
    category: getValue("task_category"),
    priority,
    assignetTo: assigningTo,
    subtask: subtask,
    currentState: currentState,
  };
  return task;
}

let isCreatingTask = false;

/**
 * Creates a new task by collecting the form data and sending it to a server.
 * Prevents task creation if an already running creation is active, checks form validity and displays a loading indicator if successful.
 * Sends the task as JSON to a Firebase database and redirects the user to the board page upon successful creation.
 */
async function createTask() {
  if (isCreatingTask) {
    return;
  }
  isCreatingTask = true;

  let form = document.getElementById("myForm");
  const task = getTaskFromForm();

  if (!form.checkValidity()) {
    form.reportValidity();
    isCreatingTask = false;
    return;
  }

  try {
    showLoadingOverlay();

    const response = await fetch(
      "https://join-6878f-default-rtdb.europe-west1.firebasedatabase.app/task.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );

    if (!response.ok) throw new Error("Failed to create task");

    setTimeout(() => {
      window.location.href = "board.html";
    }, 1000);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isCreatingTask = false;
  }
}

/**
 * Creates a new task in the database by sending the transferred data to a server.
 * Sends the data as JSON to a specified URL in the Firebase database using a POST request.
 * The function uses `BASE_URL` and a fixed path to store the task.
 *
 * @param {Object} [data={}] - The data of the new task to be created.
 */
async function createNewTaskInStorage(data = {}) {
  path = "task/.json";
  //data = {title:"neuer Titel"};
  let response = await fetch(BASE_URL + path, {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * The function `EditNewSubTask` displays an edit button and input field for a specific subtask
 * based on the index `i`.
 * @param i - The parameter `i` in the `EditNewSubTask` function is used as an index to identify a
 * specific subtask.
 */
function EditNewSubTask(i) {
  let showEditSubtask = document.getElementById(`showTaskSubtaskEditBTN${i}`);
  if (showEditSubtask) {
    showEditSubtask.style.display = "flex"; // Ensure element exists before styling
  }

  let showInputSubtask = document.getElementById(
    `showTaskSubtaskEditInput${i}`
  );
  if (showInputSubtask) {
    showInputSubtask.value = subtask[i]["description"]; // Directly assign value if subtask is a string
  }
}

/**
 * The above code is a JavaScript function named `deleteNewSubTask` that takes an index `i` as a
 * parameter. Inside the function, it uses the `splice` method to remove one element at the specified
 * index `i` from the `subtasks` array. After removing the element, the function then calls another
 * function `getSubTaskAddTask()`. */
function delNewTask(i) {
  subtask.splice(i, 1);
  getSubTaskAddTask();
}

/**
 * The function `saveEditNewTask` updates a specific subtask in an array and then calls another
 * function to update the task.
 * @param i - The parameter `i` in the `saveEditNewTask` function is used as an index to access and
 * update a specific subtask in the `subtasks` array.
 */
function saveEditNewTask(i) {
  let showTaskSubtaskEditInput = document.getElementById(
    `showTaskSubtaskEditInput${i}`
  );
  if (showTaskSubtaskEditInput) {
    subtask[i].description = showTaskSubtaskEditInput.value; // Update the specific property if subtask is an object
    getSubTaskAddTask(); // Refresh the display
  }
}

/**
 * The function `toggleCheckboxes` toggles the visibility of checkboxes and clears the value of an
 * input field based on a boolean variable `show`.
 * @param event - The `event` parameter is an object that represents an event that occurs in the DOM
 * (Document Object Model), such as a click, keypress, or mouse movement. In this context, it is likely
 * being used to handle an event triggered by a user action, such as clicking on a checkbox or
 */
async function toggleCheckboxes(event) {
  event.preventDefault();
  event.stopPropagation();

  let assignedToInput = document.getElementById("checkBoxes");
  const checkboxes = document.getElementById("checkboxUsername");
  renderUserIcons();

  // Prüfen, ob das Dropdown-Menü geöffnet oder geschlossen wird
  if (show) {
    assignedToInput.style.display = "block"; // Dropdown öffnen
    show = false;
    if (checkboxes.innerHTML === "") {
      await loadCheckboxes(checkboxes);
    } else {
      updateCheckboxes(checkboxes); // Aktualisiere die Markierungen, ohne neu zu laden
    }
  } else {
    assignedToInput.style.display = "none"; // Dropdown schließen
    show = true;
  }
}

/**
 * Loads data from a server and displays the checkboxes in a specified container.
 * Retrieves a JSON file from a specified URL, converts the data and generates a checkbox for each row of data.
 * Empties the contents of the container before adding the new checkboxes and handles possible errors when retrieving the data.
 *
 * @param {HTMLElement} checkboxes - The HTML element in which the checkboxes are to be displayed.
 */
async function loadCheckboxes(checkboxes) {
  try {
    const response = await fetch(`${BASE_URL_Contacts}.json`);
    if (!response.ok) {
      throw new Error("Netzwerkantwort war nicht ok.");
    }
    const snapshot = await response.json();
    checkboxes.innerHTML = "";
    Object.keys(snapshot).forEach((key) => {
      const data = snapshot[key];
      checkboxes.innerHTML += renderGenerateCheckBox(data, key);
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

/**
 * Updates the status of checkboxes based on the assigned values.
 * Sets the `checked` status of each checkbox named “options” depending on whether its value is included in the `assigningTo` list.
 *
 * @param {HTMLElement} checkboxes - The HTML element containing the checkboxes to be updated.
 */
function updateCheckboxes(checkboxes) {
  document.querySelectorAll('[name="optionen"]').forEach((checkbox) => {
    checkbox.checked = assigningTo.includes(checkbox.value);
  });
}

/**
 * Extracts the initials from a complete name.
 * Splits the name into words, takes the first letter of each word and joins these letters into a string.
 * Returns the initials in the composed string.
 *
 * @param {string} name - The full name from which the initials are to be extracted.
 * @returns {string} - A string containing the initials of the name.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

/**
 * Generates lists of names, colors and initials based on the selected checkboxes.
 * Searches all selected checkboxes, finds the corresponding guests in `guesteArray`, and adds their names, colors and initials to the corresponding global lists.
 * The values of the checkboxes are used to identify the guests and only valid guests are added to the lists.
 */
function generateCheckBoxName() {
  const selectedGuest = Array.from(
    document.querySelectorAll('input[name="optionen"]:checked')
  )
    .map((checkbox) => guesteArray.find((g) => g.name === checkbox.value))
    .filter(Boolean);

  selectedGuest.forEach((guest) => {
    namelist.push(guest.name);
    colorList.push(guest.color);
    initials.push(getInitials(guest.name));
  });
}

/**
 * Loads data from a server and generates checkboxes for selecting users.
 * First empties the contents of the container for checkboxes, then retrieves a JSON file and creates a checkbox for each row of data.
 * The generated checkboxes are added to the container and errors are logged when retrieving the data.
 */
async function generateCheckBox() {
  const checkboxes = document.getElementById("checkboxUsername");
  checkboxes.innerHTML = ""; // Clear existing checkboxes

  try {
    const response = await fetch(`${BASE_URL_Contacts}.json`);
    if (!response.ok) {
      throw new Error("Netzwerkantwort war nicht ok.");
    }
    const snapshot = await response.json();
    Object.keys(snapshot).forEach((key) => {
      const data = snapshot[key];
      checkboxes.innerHTML += renderGenerateCheckBox(data, key);
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

/**
 * The function `searchNameFromGuestList` searches for a name from a guest list based on user input and
 * renders the results.
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
 * The function `getValues` retrieves the checked values of checkboxes with a specific name and calls
 * the `checkGuestsName` function with those values.
 * @param id - The `id` parameter in the `getValues` function is used to specify the ID of an HTML
 * element that will be targeted to display the selected values from checkboxes.
 */
function getValues(id) {
  let addTaskShowCheck = document.getElementById(id);
  const checkboxes = document.querySelectorAll(
    'input[name="optionen"]:checked'
  );
  addTaskShowCheck.innerHTML = "";

  let checkedValues = [];
  checkboxes.forEach((checkbox) => {
    checkedValues.push(checkbox.value);
  });
  checkGuestsName(checkedValues);
}

/**
 * The function `checkGuestsName` retrieves selected guest names and their corresponding colors from
 * checkboxes and displays their initials with respective colors on the webpage.
 * @param checkedValues - The `checkedValues` parameter in the `checkGuestsName` function is used to
 * determine if any checkboxes have been checked. If `checkedValues` is truthy, the function will
 * proceed to retrieve the selected checkboxes, find the corresponding guest information, and display
 * the initials of the selected guests with
 */
function checkGuestsName(checkedValues) {
  if (checkedValues) {
    const selectedCheckboxes = document.querySelectorAll(
      'input[name="optionen"]:checked'
    );
    const selectedGuests = [];
    selectedCheckboxes.forEach((checkbox) => {
      const guestName = checkbox.value;
      const guest = guesteArray.find((g) => g.name === guestName);
      if (guest) {
        selectedGuests.push({
          name: guest.name,
          color: guest.color,
        });
      }
    });
    showCheck.innerHTML = "";
    for (let index = 0; index < selectedGuests.length; index++) {
      const element = selectedGuests[index];
      let initial = getInitials(element.name);
      showCheck.innerHTML += /* html */ `
        <div class="addTask_checkboxName boardTask_userInitial showTask_userInitial" style="background-color: ${element.color};">${initial}</div>
      `;
    }
  }
}

function setDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const minDate = `${year}-${month}-${day}`;

  return minDate;
}
