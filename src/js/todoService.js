import { appEvents } from "./utils/EventEmitter.js";

class Todo {
    #id;
    #name;

    #description;
    #priority;

    /**
     * @param {string} name 
     */
    constructor(name, description="", priority=1) {
        this.#id = crypto.randomUUID();
        this.#name = name;
        this.#description = description;
        this.#priority = priority;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }

    get priority() {
        return this.#priority;
    }
}

/** @type {Todo[]} */
let todosArray = [];

/**
 * @param {string} todoName 
 */
function addNewTodo(todoName, todoDescription, todoPriority) {
    const newTodo = new Todo(
        todoName,
        todoDescription,
        todoPriority
    );

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