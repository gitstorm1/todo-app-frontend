import { appEvents } from "../utils/EventEmitter.js";

const TODO_ID_PREFIX = "todo-"

/**
 * @param {string} todoId 
 */
function getTodoData(todoId) {
    return localStorage.getItem(TODO_ID_PREFIX + todoId);
}

function getAllTodosData() {

}

/**
 * @param {string} todoId 
 * @param {string} todoData 
 */
function saveTodoToLocalStorage(todoId, todoData) {
    localStorage.setItem(TODO_ID_PREFIX + todoId, todoData);
}

/**
 * @param {string} todoId 
 */
function deleteTodoFromLocalStorage(todoId) {
    localStorage.removeItem(TODO_ID_PREFIX + todoId);
}