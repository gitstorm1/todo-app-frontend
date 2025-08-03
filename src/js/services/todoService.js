import { appEvents } from "../utils/EventEmitter.js";
import * as todoStorage from "./todoStorage.js";

const TODO_ID_PREFIX = "todo-"

class Todo {
    #id;
    #name;
    #completed = false;

    #description;
    #priority;

    #createdAt;

    /**
     * @param {string} name 
     */
    constructor(name, description="", priority=0, isCompleted=false) {
        this.#id = TODO_ID_PREFIX + crypto.randomUUID();
        this.#name = name;
        this.#completed = isCompleted;
        this.#description = description;
        this.#priority = priority;
        this.#createdAt = Date.now();
    }

    complete() {
        if (this.#completed) return;
        this.#completed = true;

        todoStorage.saveTodoToLocalStorage(this.#id, this.stringify());

        appEvents.emit("todo:completed", this);

        triggerTodosReorder();
    }

    undoComplete() {
        if (!this.#completed) return;
        this.#completed = false;

        todoStorage.saveTodoToLocalStorage(this.#id, this.stringify());

        appEvents.emit("todo:undo-completed", this);

        triggerTodosReorder();
    }

    stringify() {
        return JSON.stringify({
            id: this.#id,
            name: this.#name,
            completed: this.#completed,
            description: this.#description,
            priority: this.#priority,
            createdAt: this.#createdAt,
        });
    }

    /**
     * @param {string} idToSet 
     */
    setIdDangerous(idToSet) {
        if (!idToSet.startsWith(TODO_ID_PREFIX)) return;
        this.#id = idToSet;
    }

    /**
     * 
     * @param {number} createdAtToSet 
     */
    setCreatedAtDangerous(createdAtToSet) {
        this.#createdAt = createdAtToSet;
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

    get createdAt() {
        return this.#createdAt;
    }
}

/** @type {Todo[]} */
let todosArray = [];

/**
 * @param {string} todoData 
 * @returns {Todo}
 */
function createTodoFromTodoData(todoData) {
    const data = JSON.parse(todoData);
    const todo = new Todo(data.name, data.description, data.priority, data.completed);
    todo.setIdDangerous(data.id);
    todo.setCreatedAtDangerous(data.createdAt || Date.now());
    return todo;
}

function loadSavedTodos() {
    const todosData = todoStorage.getAllTodosData();

    for (let todoData of todosData) {
        const todo = createTodoFromTodoData(todoData);

        todosArray.push(todo);

        //appEvents.emit("todo:new", todo);
    }

    triggerTodosReorder();

    appEvents.emit("todo:saved-todos-loaded");
}

/**
 * @returns {Todo[]}
 */
function getSortedTodos() {
    return [...todosArray].sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;

        if (a.priority !== b.priority) return -(a.priority - b.priority);

        return a.createdAt - b.createdAt;
    });
}

function triggerTodosReorder() {
    appEvents.emit("todo:reorder", getSortedTodos());
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

    triggerTodosReorder();
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

export { loadSavedTodos, addNewTodo, getTodoById, deleteTodoById };