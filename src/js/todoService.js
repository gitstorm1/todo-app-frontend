import { appEvents } from "./utils/EventEmitter.js";

class Todo {
    #id;
    #name;

    /**
     * @param {string} name 
     */
    constructor(name) {
        this.#id = crypto.randomUUID();
        this.#name = name;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }
}

/** @type {Todo[]} */
let todosArray = [];

/**
 * @param {string} todoName 
 */
function addNewTodo(todoName) {
    const newTodo = new Todo(todoName);

    todosArray.push(newTodo);

    appEvents.emit("todo:new", newTodo);
}

/**
 * @param {string} targetTodoId 
 */
function removeTodoById(targetTodoId) {
    let targetTodo;
    todosArray = todosArray.filter((currentTodo) => {
        if (currentTodo.id === targetTodoId) {
            targetTodo = currentTodo;
            return false;
        }
        return true;
    });
    if (targetTodo) {
        appEvents.emit("todo:removed", targetTodo);
    }
}

export { addNewTodo, removeTodoById };