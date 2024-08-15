let taskIDs = [];
let nextUrgentTask = [];
let taskPriorityArray = [];


function renderSummary() {
    renderStates();
    renderGreeting();
}

function renderStates() {
    document.getElementById('sum-tasks-open').innerHTML = countStateOccurrences("to-do");
    document.getElementById('sum-tasks-done').innerHTML = countStateOccurrences("done");
    document.getElementById('sum-tasks-total').innerHTML = taskId.length;
    document.getElementById('sum-tasks-in-progress').innerHTML = countStateOccurrences("in-progress");
    document.getElementById('sum-tasks-await-feedback').innerHTML = countStateOccurrences("await-feedback");
    document.getElementById('sum-tasks-urgent').innerHTML = countUrgency();
}

function renderGreeting() {
    
    document.getElementById('greeted-person').innerHTML = ',' + currentUserName;
}

function countStateOccurrences(searchString) {
    let count = 0;
    for (let i = 0; i < taskId.length; i++) {
        if (task[taskId[i]] && task[taskId[i]].currentState === searchString) {
            count++;
        }
    }
    return count;
}

function countUrgency(priority = "high") {
    let count = 0;
    for (let i = 0; i < taskId.length; i++) {
        if (task[taskId[i]] && task[taskId[i]].priority === priority) {
            count++;
        }
    }
    return count;
}

async function loadUrgentTasksDeadline() {
    let nextDeadline = document.getElementById('next-deadline');
    let allTasks = await fetchAllTasks('/task');

    if (!allTasks) {
        return;
    }

    let taskKeysArray = Object.keys(allTasks);
    let priority = 'high';

    let tasksByPriority = await fetchTasksByPriority(taskKeysArray, priority);

    if (tasksByPriority.length == 0) {
        priority = 'medium';
        tasksByPriority = await fetchTasksByPriority(taskKeysArray, priority);
    }

    if (tasksByPriority.length == 0) {
        priority = 'low';
        tasksByPriority = await fetchTasksByPriority(taskKeysArray, priority);
    }

    let nextUrgentDate = allTasks[taskIDs[0]].dueDate;

    if (tasksByPriority.length == 1) {
        nextDeadline.innerHTML = nextUrgentDate;
        return;
    }


    for (let index = 1; index < tasksByPriority.length; index++) {
        const currentElement = tasksByPriority[index];
        if (currentElement.dueDate <= nextUrgentDate) {
            nextUrgentDate = currentElement.dueDate;
        }    
    }

    nextDeadline.innerHTML = formatDate(nextUrgentDate);
}

async function fetchTasksByPriority(taskKeysArray, priority) {
    let allTasks = await fetchAllTasks('/task');

    taskKeysArray.forEach(key => {
        if (allTasks[key].priority == priority) {
            taskIDs.push(key);
            taskPriorityArray.push({
                priority: allTasks[key].priority,
                dueDate: allTasks[key].dueDate
            });
        } 
    });
    return taskPriorityArray;
}

async function fetchAllTasks(path = "") {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJSON = await response.json();
    return responseToJSON;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function onload() {
    includeHTML();
    initSummary();        
    loadUrgentTasksDeadline();    
}