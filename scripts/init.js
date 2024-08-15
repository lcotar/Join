/** Includes ALL init Functions for main- and subpages
 */

/** 
 * Init Kanban Board 
 */
async function initBoard() {    
    await loadUserData();    
    await loadTasks();
    await loadContacts();
    setCurrentUser();
    renderKanbanBoard();
    renderInitials();
    highlightActiveMenu("board");
}

/** 
 * Init Summary page
 */
async function initSummary() {
    await loadUserData();    
    setCurrentUser();
    await loadTasks();	    
    renderSummary();
    renderInitials();
    highlightActiveMenu("summary");
    
}

/** 
 * Init Add Task section
 */
async function initAddTask() {        
    await loadUserData();  
    await loadAllContacts(); 
    setCurrentUser();         
    renderAddTask();     
    generateCheckBox();  
    renderInitials();
    highlightActiveMenu("add-task");
}

/** 
 * Init content pages
 */
async function renderContent() {
    await loadUserData();
    setCurrentUser(); 
    renderInitials();
}
