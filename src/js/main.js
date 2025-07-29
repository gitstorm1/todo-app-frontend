import { appEvents } from "./utils/EventEmitter.js";
import { addNewTodo, removeTodoById } from "./todoService.js";

/** @type {HTMLUListElement} */
const todoList = document.getElementById("todoList");

/** @type {HTMLInputElement} */
const createTodoName = document.getElementById("createTodoName");

/** @type {HTMLButtonElement} */
const createTodoButton = document.getElementById("createTodo");

createTodoButton.addEventListener("click", () => {
    const todoName = createTodoName.value;
    
    createTodoName.value = ""

    if (todoName == "") {
        alert("Todo name cannot be empty!");
        return;
    }

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
    }
});