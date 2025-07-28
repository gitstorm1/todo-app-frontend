import { appEvents } from "./EventEmitter.mjs";

/** @type {HTMLUListElement} */
const todoList = document.getElementById("todoList");

/** @type {HTMLInputElement} */
const createTodoName = document.getElementById("createTodoName");

/** @type {HTMLButtonElement} */
const createTodoButton = document.getElementById("createTodo");

let todosArray = [];

function addNewTodo(todoName) {
    todosArray.push(todoName);
    appEvents.emit("todo:new", todoName);
}

function removeTodoByName(todoName) {
    todosArray = todosArray.filter((currentTodoName) => currentTodoName != todoName);
    appEvents.emit("todo:removed", todoName);
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

appEvents.on("todo:new", (todoName) => {
    /** @type {HTMLLIElement} */
    const todo = document.createElement("li");

    /** @type {HTMLButtonElement} */
    const completeTodo = document.createElement("button");
    completeTodo.classList.add("complete-todo-button");
    completeTodo.append("Complete");

    completeTodo.addEventListener("click", () => {
        removeTodoByName(todoName);
        todo.remove();
    });

    todo.append(todoName);
    todo.append(completeTodo);

    todoList.append(todo);
});