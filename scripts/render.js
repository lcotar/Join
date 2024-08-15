/**
 * Render Kanban Board columns
 */
function renderKanbanBoard() {
    renderKanbanCard("to-do");
    renderKanbanCard("in-progress");
    renderKanbanCard("await-feedback");
    renderKanbanCard("done");
    addEventListener()
}

/**
 * Render Kanban card (divided into sub functions)
 * @param {string} [state="to-do"] 
 */
function renderKanbanCard(state = "to-do") {
    let currentColumn = document.getElementById(`kb-task-${state}`);
    let currentColumnContent = "";
    let countTasks = 0;
    for (let i = 0; i < taskId.length; i++) {
        if (task[taskId[i]].currentState == state) {
            countTasks++;
            currentColumnContent += renderCardHeader(taskId[i]);
            currentColumnContent += renderCardSubtasks(taskId[i]);
            currentColumnContent += renderCardFooter(taskId[i]);
        }
    }
    if (countTasks > 0) {
        currentColumn.innerHTML = currentColumnContent;
    } else {
        currentColumn.innerHTML = `<div id="no-task-to-do-${state}" class="no-task-info"><div class="no-task-info-inner">No tasks to do</div></div>`;
    }
}

/**
 * render header of the small review kanban cards of the board
 * @param {*} index - firebase ID of current task
 * @returns html string
 */
function renderCardHeader(index) {
    let cardHeader = `<div id="${index}" draggable="true" onclick="renderPreviewCard('${index}')" ondragstart="dragThisTask('${index}')" ondragend="shakeTask('${index}') "class="task-info">
                        <div class="task-cat ${task[index].category}">${task[index].category}</div>
                        <h4>${task[index].title}</h4>
                        <span>${task[index].description}</span>`;
    return cardHeader;
}

/**
 * render subtask of the small review kanban cards of the board
 * @param {*} index - firebase ID of current task
 * @returns html string
 */
function renderCardSubtasks(index) {
    let cardProgress = '<div class="progress">';
    if (task[index].subtask) {
        cardProgress += renderProgress(index);
    }
    cardProgress += `</div>`;
    return cardProgress;
}

/**
 * render progressbar of subtasks of the small review kanban cards of the board
 * @param {*} index - firebase ID of current task
 * @returns html string
 */
function renderProgress(index) {
    let subtasksCompleted = 0;
    let subtasksTotal = task[index].subtask.length;
    for (let i = 0; i < subtasksTotal; i++) {
        if (task[index].subtask[i] != undefined && task[index].subtask[i].status == true) {
            subtasksCompleted++;
        }
    }
    let percentage = 100 * (subtasksCompleted / subtasksTotal);
    return `<div class="progress-bar">
                <div class="current-progress" style="width: ${percentage}%;"></div>
            </div>
            <div class="progress-counter">${subtasksCompleted}/${subtasksTotal} subtasks</div>`;
}

/**
 * render footer of the small review kanban cards of the board
 * @param {*} index - firebase ID of current task
 * @returns html string
 */
function renderCardFooter(index) {
    let priority = task[index].priority;
    let cardFooter = `<div class="task-add-info">
                        <div class="participants">`;
    cardFooter += renderParticipants(index);
    cardFooter += `                    </div>
                        <img class="prio-icon" src="./assets/img/prio-${priority}.svg">
                    </div>
                </div>`;
    return cardFooter;
}

/**
 * render small colored circles with initials of participiants of the small review kanban cards of the board
 * @param {*} index - firebase ID of current task
 * @returns html string
 */
function renderParticipants(index) {
    let participiantId = task[index].assignetTo;
    let counter = 0;
    if (participiantId) {
        let participiantHTML = "";
        for (let i = 0; i < participiantId.length; i++) {
            let participiantData = contact[participiantId[i]];
            if (participiantData && counter < 2) {
                let participiantName = participiantData.name;
                let participiantInitials = getInitials(participiantName);
                let participiantColor = participiantData.color;
                participiantHTML += `<span style="background-color: ${participiantColor}" class="user-in">${participiantInitials}</span>`;
            }
            counter++;
        }
        if (counter > 3) {
            participiantHTML += `<span style="background-color: black" class="user-in">+${counter - 2}</span>`;
        }
        return participiantHTML;
    } else {
        return `<span></span>`;
    }
}

/**
 * render small colored circles with initials of participiants of the small review kanban cards of the board
 * @param {*} index - firebase ID of current task
 * @returns html string
 */
function renderParticipantsEditCard() {
    let participiantId = taskCache.assignetTo;
    let counter = 0;
    if (participiantId) {        
        let participiantHTML = "";
        for (let i = 0; i < participiantId.length; i++) {
            
            let participiantData = contact[participiantId[i]];
            if (participiantData) {                
                let participiantName = participiantData.name;
                let participiantInitials = getInitials(participiantName);
                let participiantColor = participiantData.color;
                participiantHTML += `<span style="background-color: ${participiantColor}" class="user-in">${participiantInitials}</span>`;
                counter++;
            }
        }
        return participiantHTML;
    } else {
        return `<span></span>`;
    }
}