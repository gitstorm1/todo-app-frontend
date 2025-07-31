import { appEvents } from "../utils/EventEmitter.js";
import * as todoStorage from "./todoStorage.js";

const TODO_ID_PREFIX = "todo-"

class Todo {
    #id;
    #name;
    #completed = false;

    #description;
    #priority;

    /**
     * @param {string} name 
     */
    constructor(name, description="", priority=0, isCompleted=false) {
        this.#id = TODO_ID_PREFIX + crypto.randomUUID();
        this.#name = name;
        this.#completed = isCompleted;
        this.#description = description;
        this.#priority = priority;
    }

    complete() {
        if (this.#completed) return;
        this.#completed = true;

        todoStorage.saveTodoToLocalStorage(this.#id, this.stringify());

        appEvents.emit("todo:completed", this);
    }

    undoComplete() {
        if (!this.#completed) return;
        this.#completed = false;

        todoStorage.saveTodoToLocalStorage(this.#id, this.stringify());

        appEvents.emit("todo:undo-completed", this);
    }

    stringify() {
        return JSON.stringify({
            id: this.#id,
            name: this.#name,
            completed: this.#completed,
            description: this.#description,
            priority: this.#priority,
        });
    }

    get id() {
        return this.#id;
    }

    get completed() {
        return this.#completed;
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
 * @param {string} todoData 
 * @returns {Todo}
 */
function createTodoFromTodoData(todoData) {

}

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

    todoStorage.saveTodoToLocalStorage(newTodo.id, newTodo.stringify());

    appEvents.emit("todo:new", newTodo);
}

/**
 * @param {string} todoId 
 * @returns {Todo | undefined}
 */
function getTodoById(todoId) {
    return todosArray.find((todo) => todo.id === todoId);
}

/**
 * @param {string} targetTodoId 
 */
function deleteTodoById(targetTodoId) {
    let targetTodo;
    todosArray = todosArray.filter((currentTodo) => {
        if (currentTodo.id === targetTodoId) {
            targetTodo = currentTodo;
            return false;
        }
        return true;
    });
    if (targetTodo) {
        todoStorage.deleteTodoFromLocalStorage(targetTodo.id);
        appEvents.emit("todo:deleted", targetTodo);
    }
}

export { addNewTodo, getTodoById, deleteTodoById };