let currentTask = '';

/**
 * Start dragging process in desktop view
 * @param {*} index 
 */
function dragThisTask(index) {
    currentDraggedTask = index;
}

/**
 * Shake kanban card when dragged into new column
 * @param {*} index 
 */
function shakeTask(index) {
    document.getElementById(`${index}`).classList.add('shake');
}

/**
 * Allow container to be dragged and dropped
 * @param {*} index 
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Open add task form to create a new task with the state of the current column
 * @param {*} index 
 */
function addTaskFromBoard(currentState = "to-do") {
    window.name = currentState;
    window.location.href = 'add-task.html';
}

/**
 * Move task into new column and update the task in storage
 * @param {*} state 
 */
function moveTaskTo(state = "to-do") {
    task[currentDraggedTask].currentState = state;
    let updatedTask = generateUpdatedTaskAsJson();
    updateTaskInStorage(updatedTask);
    renderKanbanBoard();
    dishighlight(state);
}

/**
 * Close a tasks preview in kanban board
 */
function closePreview() {
    document.getElementById('preview-task-area').classList.add('d-none');
    renderKanbanBoard();
}

/**
 * Open a tasks preview in kanban board
 */
function openPreview(index) {
    document.getElementById('preview-task-area').classList.remove('d-none');
}

/**
 * Generate a JSON of the updated task to update it in storage
 */
function generateUpdatedTaskAsJson() {
    let assignetTo = task[currentDraggedTask].assignetTo;
    let subTask = task[currentDraggedTask].subtask;
    let updatedTask = {
        assignetTo: assignetTo,
        category: `${task[currentDraggedTask].category}`,
        currentState: `${task[currentDraggedTask].currentState}`,
        description: `${task[currentDraggedTask].description}`,
        dueDate: `${task[currentDraggedTask].dueDate}`,
        priority: `${task[currentDraggedTask].priority}`,
        title: `${task[currentDraggedTask].title}`,
        subtask: subTask
    };
    return updatedTask;
}

/**
 * Filter function: search string in all task descriptions and titles and hide the rest
 */
function filterTasks() {
    let searchString = document.getElementById('filter-tasks').value.toLowerCase();
    for (let i = 0; i < taskId.length; i++) {
        if (!task[taskId[i]].title.toLowerCase().includes(searchString) && !task[taskId[i]].description.toLowerCase().includes(searchString)) {
            document.getElementById(`${taskId[i]}`).classList.add('d-none');
        } else {
            document.getElementById(`${taskId[i]}`).classList.remove('d-none');
        }
    }
}

/**
 * Delete current task in preview card
 */
function deleteRequestTask(index) {
    document.getElementById("delete-request-task").style.display = "flex";
    currentTask = index;
}

/**
 * this function closes the window to ask if a contact should be deleted for sure
 */
function closeDeleteRequestTask() {
    document.getElementById("delete-request-task").style.display = "none";
}

/**
 * Open edit task card and close preview card
 */
function editSubtask(i, idTask) {
    document.getElementById(`subtask-preview-${i}`).classList.add("d-none");
    document.getElementById(`subtask-edit-${i}`).classList.remove("d-none");
}

/**
 * Save subtask if edited
 */
function saveEditedSubtask(i, idTask) {
    let newSubtask = document.getElementById(`subtask-description-${i}`).value;
    document.getElementById(`subtask-preview-${i}`).classList.remove("d-none");
    document.getElementById(`subtask-edit-${i}`).classList.add("d-none");
    document.getElementById(`description-preview-${i}`).innerHTML = newSubtask;
    taskCache.subtask[i].description = newSubtask;
}

/**
 * Delete a subtask in storage
 */
async function deleteEditedSubtask(i, idTask) {
    task[idTask].subtask.splice(i, 1);
    let editedTask = generateEditedTaskAsJson(idTask);
    document.getElementById(`subtask-${i}`).classList.add('d-none');
    await updateEditedTaskInStorage(editedTask, idTask);
}

/**
 * Update task and render board and preview card
 */
async function updateCurrentTask(idTask) {
    renderKanbanBoard();
    renderPreviewCard(idTask);
    document.getElementById(`edit-task-area`).classList.add("d-none");
}

/**
 * Open dropdown menu with contacts
 */
function showContacts(index) {
    document.getElementById('dropdown-contacts').classList.toggle('d-none');
    taskCache.assignetTo = getSelectedParticipiants();
    updateAvatars(index);
}

/**
 * Close edit task view
 */
function closeEditTask(idTask) {
    renderPreviewCard(idTask);
    document.getElementById(`edit-task-area`).classList.add("d-none");
    document.getElementById(`preview-task-area`).classList.remove("d-none");
}

/**
 * Open edit task view
 */
function openEditTask(idTask) {
    document.getElementById('edit-task-area').classList.remove('d-none');
    document.getElementById('preview-task-area').classList.add('d-none');
}

/**
 * Generate a JSON of an edited task
 */
function generateEditedTaskAsJson(idTask) {
    let assignetTo = task[idTask].assignetTo;
    let subTask = task[idTask].subtask;
    let updatedTask = {
        assignetTo: assignetTo,
        category: `${task[idTask].category}`,
        currentState: `${task[idTask].currentState}`,
        description: `${task[idTask].description}`,
        dueDate: `${task[idTask].dueDate}`,
        priority: `${task[idTask].priority}`,
        title: `${task[idTask].title}`,
        subtask: subTask
    };
    return updatedTask;
}

/**
 * Add new subtask and assign it to current opened task in edit form
 */
function addSubtask(idTask) {
    let newSubtaskDescription = document.getElementById('add-subtask-input').value;
    if (taskCache.subtask) {
        taskCache.subtask.push({
            description: newSubtaskDescription,
            status: false
        });
    }
    else {
        let mySubtask = [{ description: newSubtaskDescription, status: false }];
        taskCache.subtask = mySubtask;
    }
    renderEditCard(idTask);
}

/**
 * Save the edited task in a cache to update it in database
 */
async function updateTaskArray(idTask) {
    taskCache.title = document.getElementById('task-title').value;
    taskCache.description = document.getElementById('task-description').value;
    taskCache.category = document.getElementById('task-category').value;
    taskCache.dueDate = document.getElementById('task-due-date').value;
    taskCache.assignetTo = getSelectedParticipiants();
    task[idTask] = taskCache;
    await updateEditedTaskInStorage(taskCache, idTask);
    closeEditTask(idTask);
}

/**
 * Get all participiants assignet to this task
 */
function getSelectedParticipiants() {
    let dropdown = document.getElementById('dropdown-contacts');
    let checkboxes = dropdown.querySelectorAll('input[type="checkbox"]')
    let selectedContacts = [];
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            selectedContacts.push(checkbox.value);
        }
    })
    return selectedContacts;
}

/**
 * Change priority of current task
 */
function changePriority(priority) {
    taskCache.priority = priority;
    document.getElementById('btn-prio-low').classList.remove('green');
    document.getElementById('btn-prio-medium').classList.remove('yellow');
    document.getElementById('btn-prio-high').classList.remove('red');
    document.getElementById('img-prio-high-color').classList.add('d-none');
    document.getElementById('img-prio-high-white').classList.add('d-none');
    document.getElementById('img-prio-med-white').classList.add('d-none');
    document.getElementById('img-prio-med-color').classList.add('d-none');
    document.getElementById('img-prio-low-white').classList.add('d-none');
    document.getElementById('img-prio-low-color').classList.add('d-none');
    if (priority === 'low') {
        document.getElementById('btn-prio-low').classList.add('green');
        document.getElementById('img-prio-low-white').classList.remove('d-none');
        document.getElementById('img-prio-med-color').classList.remove('d-none');
        document.getElementById('img-prio-high-color').classList.remove('d-none');
    } else if (priority === 'medium') {
        document.getElementById('btn-prio-medium').classList.add('yellow');
        document.getElementById('img-prio-low-color').classList.remove('d-none');
        document.getElementById('img-prio-med-white').classList.remove('d-none');
        document.getElementById('img-prio-high-color').classList.remove('d-none');
    } else {
        document.getElementById('btn-prio-high').classList.add('red');
        document.getElementById('img-prio-low-color').classList.remove('d-none');
        document.getElementById('img-prio-med-color').classList.remove('d-none');
        document.getElementById('img-prio-high-white').classList.remove('d-none');
    }
}

/**
 * Change / update state of subtasks (checkboxes)
 */
function updateSubtaskState(i) {
    let currentState = document.getElementById(`checkbox-${i}`).checked;
    taskCache.subtask[i].status = currentState;
}

/**
 * Add some event listeners for mobile drag&drop on touchscreens
 */
function addEventListener() {
    let classes = [`kb-task-to-do`, `kb-task-in-progress`, `kb-task-await-feedback`, `kb-task-done`];
    for (let i = 0; i < classes.length; i++) {
        let currentColumn = document.getElementById(classes[i]);
        let kanbanCards = currentColumn.querySelectorAll('.task-info');
        kanbanCards.forEach(element => addDragAndDropListeners(element));
    }
}

/**
 * Create listeners and assign it to the kanban cards
 */
function addDragAndDropListeners(element) {
    if (!element.touchStartAdded || !element.touchmoveAdded || !element.touchendAdded || !element.touchendAdded) {
        let offsetX, offsetY;
        let initialParent;
        let touchStartX = 0;
        let touchStartY = 0;
        let isDragging = false;

        if (!element.touchStartAdded) {
            element.addEventListener('touchstart', handleTouchStart, false);
            element.touchStartAdded = true;
        }

        if (!element.touchmoveAdded) {
            element.addEventListener('touchmove', handleTouchMove, false);
            element.touchmoveAdded = true;
        }

        if (!element.touchendAdded) {
            element.addEventListener('touchend', handleTouchEnd, false);
            element.touchendAdded = true;
        }

        /**
        * Start dragging on touchscreen
        */
        function handleTouchStart(e) {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isDragging = false;
            const rect = element.getBoundingClientRect();
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;
            initialParent = element.parentNode;
            e.preventDefault();
        }

        /**
        * Move dragging on touchscreen
        */
        function handleTouchMove(e) {
            const touch = e.touches[0];
            if (Math.abs(touch.clientX - touchStartX) > 10 || Math.abs(touch.clientY - touchStartY) > 10) {
                isDragging = true;
                element.style.left = `${touch.clientX - offsetX}px`;
                element.style.top = `${touch.clientY - offsetY}px`;
                let targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
                let potentialParent = findParentContainer(targetElement);
                let newParent;
                dishighlightAll();
                if (potentialParent && potentialParent.id) {
                    newParent = potentialParent.id.replace("kb-task-", "");
                    highlight(newParent);
                }
                e.preventDefault();
            }
        }


        /**
        * End of dragging on touchscreen
        */
        async function handleTouchEnd(e) {
            if (!isDragging) {
                handleClick(e);
            } else {
                const touch = e.changedTouches[0];
                const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
                const potentialParent = findParentContainer(targetElement);
                dishighlightAll();

                let currentParent = initialParent.id.replace("kb-task-", "");;
                let newParent
                if (potentialParent && potentialParent.id) {
                    newParent = potentialParent.id.replace("kb-task-", "");;
                    currentDraggedTask = element.id;

                    if (currentParent != newParent) {
                        task[currentDraggedTask].currentState = newParent;
                        let assignetTo = task[currentDraggedTask].assignetTo;
                        let subTask = task[currentDraggedTask].subtask;
                        let updatedTask = {
                            assignetTo: assignetTo,
                            category: `${task[currentDraggedTask].category}`,
                            currentState: `${task[currentDraggedTask].currentState}`,
                            description: `${task[currentDraggedTask].description}`,
                            dueDate: `${task[currentDraggedTask].dueDate}`,
                            priority: `${task[currentDraggedTask].priority}`,
                            title: `${task[currentDraggedTask].title}`,
                            subtask: subTask
                        };
                        await updateTaskInStorage(updatedTask);
                        renderKanbanBoard();
                    }
                }
            }
        }

        /**
         * dishighlight all columns in mobile view
         */
        function dishighlightAll() {
            dishighlight("to-do");
            dishighlight("in-progress");
            dishighlight("await-feedback");
            dishighlight("done");
        }

        /**
         * open preview card on mobile screen / touchscreen if card is dragged less than 10 px
         */
        function handleClick(event) {
            renderPreviewCard(element.id);
        }

        /**
         * find new column where kanban card will be dragged into
         */
        function findParentContainer(element) {
            while (element) {
                if (element.classList && element.classList.contains('kanban-tasks')) {
                    return element;
                }
                element = element.parentNode;
            }
            return null;
        }
    }
}

document.addEventListener("DOMContentLoaded", addEventListener);

/**
* Highlight column on current mous/finger position while dragging
*/
function highlight(state) {
    document.getElementById(`kb-task-${state}`).classList.add('kanban-tasks-highlight');
    if (document.getElementById(`no-task-to-do-${state}`)) {
        document.getElementById(`no-task-to-do-${state}`).classList.add('d-none');
    }
}

/**
* Dishighlight column on current mous/finger position while dragging
*/
function dishighlight(state) {
    document.getElementById(`kb-task-${state}`).classList.remove('kanban-tasks-highlight');
    if (document.getElementById(`no-task-to-do-${state}`)) {
        document.getElementById(`no-task-to-do-${state}`).classList.remove('d-none');
    }
}

