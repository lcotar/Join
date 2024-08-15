/** Declaration of global variables, available in 
 *  all JavaScript files
 */

/** Database URL */
const BASE_URL = "https://join-6878f-default-rtdb.europe-west1.firebasedatabase.app/";

/** Available Avatar Colors */
const AVATAR_COLOR = ["#ff7a00", "#ff5eb3", "#6e52ff",
                      "#9327ff", "#00bee8", "#1fd7c1",
                      "ff745e#", "#ffa35e", "#fc71ff",
                      "#ffdc00", "#0038ff", "#c3ff2b",
                      "#ffe62b", "#ff4646"]

/** Tasks for Kanban Board */
let taskCache = [];
let task = [];
let taskId = [];
let currentDraggedTask;

/** Contact Data */
let contact = [];
let contactId = [];

let show = true;