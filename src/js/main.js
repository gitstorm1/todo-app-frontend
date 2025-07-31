// import { appEvents } from "./utils/EventEmitter.js";
import { addNewTodo, getTodoById, removeTodoById } from "./services/todoService.js";
import "./views/todoView.js";

/** @type {HTMLUListElement} */
const todoList = document.getElementById("todoList");

/** @type {HTMLInputElement} */
const createTodoName = document.getElementById("createTodoName");

/** @type {HTMLTextAreaElement} */
const createTodoDescription = document.getElementById("createTodoDescription");

/** @type {HTMLInputElement} */
const createTodoPriority = document.getElementById("createTodoPriority");

/** @type {HTMLButtonElement} */
const createTodoButton = document.getElementById("createTodo");

createTodoButton.addEventListener("click", () => {
    const todoName = createTodoName.value;
    const todoDescription = createTodoDescription.value;
    const todoPriority = Number(createTodoPriority.value);

    if (todoName == "") {
        alert("Todo name cannot be empty!");
        return;
    }

    addNewTodo(
        todoName,
        todoDescription,
        todoPriority
    );

    createTodoName.value = ""
    createTodoName.focus();
});

todoList.addEventListener("click", (event) => {
    /** @type {HTMLElement} */
    const target = event.target;

    if (target.classList.contains("complete-todo-button")) {
        /** @type {HTMLLIElement} */
        const todoLi = target.parentElement;

        const todo = getTodoById(todoLi.dataset.todoId);

        if (target.textContent === "Complete") {
            todo.complete();
        } else {
            todo.undoComplete();
        }
    }
});
