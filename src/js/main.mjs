import { appEvents } from "./EventEmitter.mjs";

/** @type {HTMLUListElement} */
const todoList = document.getElementById("todoList");

/** @type {HTMLInputElement} */
const createTodoName = document.getElementById("createTodoName");

/** @type {HTMLButtonElement} */
const createTodoButton = document.getElementById("createTodo");

class Todo {
    #id;
    #name = "";

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

let todosArray = [];

function addNewTodo(todoName) {
    const newTodo = new Todo(todoName);

    todosArray.push(newTodo);

    appEvents.emit("todo:new", newTodo);
}

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

createTodoButton.addEventListener("click", () => {
    const todoName = createTodoName.value;

    if (todoName == "") {
        alert("Todo name cannot be empty!");
        return;
    }

    createTodoName.value = ""

    addNewTodo(todoName);

    createTodoName.focus();
});

appEvents.on("todo:new", (newTodo) => {
    /** @type {HTMLLIElement} */
    const todoLi = document.createElement("li");

    todoLi.dataset.todoId = newTodo.id;

    /** @type {HTMLButtonElement} */
    const completeTodo = document.createElement("button");
    completeTodo.classList.add("complete-todo-button");
    completeTodo.append("Complete");

    completeTodo.addEventListener("click", () => {
        removeTodoById(newTodo.id);
    });

    todoLi.append(newTodo.name);
    todoLi.append(completeTodo);

    todoList.append(todoLi);
});

appEvents.on("todo:removed", (removedTodo) => {
    const todoId = removedTodo.id;

    /** @type {HTMLLIElement} */
    const todoLi = todoList.querySelector(`li[data-todo-id="${todoId}"]`);

    if (todoLi && todoLi.parentNode) {
        todoLi.remove();
        console.log("Removed todo li for", removedTodo.name);
    }
});