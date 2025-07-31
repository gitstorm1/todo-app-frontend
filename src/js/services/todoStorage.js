import { appEvents } from "../utils/EventEmitter.js";

const TODO_ID_PREFIX = "todo-"

/**
 * @param {string} todoId 
 */
function getTodoData(todoId) {
    return localStorage.getItem(todoId);
}

function getAllTodosData() {
    const todosData = []
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key.startsWith(TODO_ID_PREFIX)) continue;
        todosData.push(localStorage.getItem(key));
    }
    return todosData;
}

/**
 * @param {string} todoId 
 * @param {string} todoData 
 */
function saveTodoToLocalStorage(todoId, todoData) {
    localStorage.setItem(todoId, todoData);
    appEvents.emit("todo:saved-to-localstorage", todoId);
}

/**
 * @param {string} todoId 
 */
function deleteTodoFromLocalStorage(todoId) {
    localStorage.removeItem(todoId);
    appEvents.emit("todo:deleted-from-localstorage", todoId);
}

export { getTodoData, getAllTodosData, saveTodoToLocalStorage, deleteTodoFromLocalStorage };