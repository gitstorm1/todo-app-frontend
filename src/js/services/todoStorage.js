import { appEvents } from "../utils/EventEmitter.js";

const TODO_ID_PREFIX = "todo-"

/**
 * @param {string} todoId 
 */
function getTodoData(todoId) {
    return localStorage.getItem(TODO_ID_PREFIX + todoId);
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
    localStorage.setItem(TODO_ID_PREFIX + todoId, todoData);
}

/**
 * @param {string} todoId 
 */
function deleteTodoFromLocalStorage(todoId) {
    localStorage.removeItem(TODO_ID_PREFIX + todoId);
}