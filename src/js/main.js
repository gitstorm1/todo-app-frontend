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

    /** @type {HTMLBRElement} */
    const lineBreak1 = document.createElement("br");
    /** @type {HTMLBRElement} */
    const lineBreak2 = document.createElement("br");

    todoLi.append(newTodo.name);
    todoLi.appendChild(completeTodo);
    todoLi.appendChild(lineBreak1);
    todoLi.append(`Description: ${newTodo.description || "N/A"}`);
    todoLi.appendChild(lineBreak2);
    todoLi.append(`Priority: ${newTodo.priority}`);

    todoList.appendChild(todoLi);
});

appEvents.on("todo:removed", (removedTodo) => {
    const todoId = removedTodo.id;

    /** @type {HTMLLIElement} */
    const todoLi = todoList.querySelector(`li[data-todo-id="${todoId}"]`);

    if (todoLi && todoLi.parentNode) {
        todoLi.remove();
    }
});