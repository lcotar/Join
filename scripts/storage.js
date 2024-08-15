/**
 *  Load all tasks from firebase
 *  @param {string} path
 */
async function loadTasks(path = "task") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        task = await response.json();
        Object.keys(task).forEach(id => {
            taskId.push(id);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
}

/**
 *  Load all contacts from firebase
 *  @param {string} path
 */
async function loadContacts(path = "contact") {
    contactId.length = 0;
    try {
        let response = await fetch(BASE_URL + path + ".json");
        contact = await response.json();
        Object.keys(contact).forEach(id => {
            contactId.push(id);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
}

/**
 *  Load all contacts from firebase
 *  @param {string} path
 */
async function loadAllContacts(path = "contact") {
    allContactIds.length = 0;
    try {
        let response = await fetch(BASE_URL + path + ".json");
        allContacts = await response.json();
        Object.keys(allContacts).forEach(id => {
            allContactIds.push(id);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
}


/**
 *  Remove / delete a task from storage
 *  @param {string} index
 */
async function deleteThisTask(index) {
    let path = "task/" + index + ".json";
    let response = await fetch(BASE_URL + path, {
        method: "DELETE",
        header: {
            "Content-Type": "application/json",
        }
    });
    document.getElementById('preview-task-area').classList.add('d-none');
    task.length = 0;
    taskId.length = 0;
    await loadTasks();
    closeDeleteRequestTask();
    renderKanbanBoard();
}

/**
 *  Remove / delete a subtask from firebase storage
 *  @param {string} index - identifier of the main task
 *  @param {number} idSubtask - ID of the subtask to remove
 */
async function deleteThisSubTask(index, idSubtask) {
    let path = "task/" + index + "/subtask/" + idSubtask + ".json";
    alert (path);
    let response = await fetch(BASE_URL + path, {
        method: "DELETE",
        header: {
            "Content-Type": "application/json",
        }
    });
}

/**
 *  Update a task in firebase storage
 *  @param {Object[]} data - complete task as JSON array 
 */
async function updateTaskInStorage(data = {}) {
    path = "task/" + currentDraggedTask + ".json";
    let response = await fetch(BASE_URL + path, {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

/**
 *  Update a task in firebase storage
 *  @param {Object[]} data - complete task as JSON array 
 *  @param {string} idTask - identifier of the main task
 */
async function updateEditedTaskInStorage(data = {}, idTask) {
    path = "task/" + idTask + ".json";
    let response = await fetch(BASE_URL + path, {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

/**
 *  Create a new task in firebase storage
 *  @param {Object[]} data - complete task as JSON array 
 */
async function createNewTaskInStorage(data = {}) {
    path = "task/.json";
    let response = await fetch(BASE_URL + path, {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

/**
 *  Remove / delete a task from storage
 *  @param {string} path - Path in firebase 
 */
async function loadUserData(path = "user") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        user = await response.json();
        Object.keys(user).forEach(id => {
            uid.push(id);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
}

/**
 *  Set current user when logged in 
 */
function setCurrentUser() {
    loggedInUserId = localStorage.getItem('user');
    setCurrentUserName();
}

/**
 *  Set current user name to show correct salutation when logged in
 *  @param {string} uid
 */
function setCurrentUserName(uid) {
    currentUID = localStorage.getItem('user');
    if (currentUID) {
        currentUserName = user[currentUID].name;
    }
}

/**
 *  Logout a user
 */
function logoutCurrentUser() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('username');
    loggedInUserId = "";
    window.location.href = 'index.html';
}