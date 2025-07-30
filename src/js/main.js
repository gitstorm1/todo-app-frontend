import { appEvents } from "./utils/EventEmitter.js";
import { addNewTodo, getTodoById, removeTodoById } from "./todoService.js";

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

appEvents.on("todo:new", (newTodo) => {
    /** @type {HTMLLIElement} */
    const todoLi = document.createElement("li");

    todoLi.dataset.todoId = newTodo.id;

    /** @type {HTMLButtonElement} */
    const completeTodo = document.createElement("button");
    completeTodo.classList.add("complete-todo-button");
    completeTodo.append("Complete");

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

appEvents.on("todo:completed", (todo) => {
    /** @type {HTMLLIElement} */
    const todoLi = todoList.querySelector(`li[data-todo-id="${todo.id}"]`);

    /** @type {HTMLButtonElement} */
    const completeTodo = todoLi.querySelector(".complete-todo-button");
    completeTodo.textContent = "Undo-complete";

    todoLi.classList.add("strikethrough");
});

appEvents.on("todo:undo-completed", (todo) => {
    /** @type {HTMLLIElement} */
    const todoLi = todoList.querySelector(`li[data-todo-id="${todo.id}"]`);

    /** @type {HTMLButtonElement} */
    const completeTodo = todoLi.querySelector(".complete-todo-button");
    completeTodo.textContent = "Complete";

    todoLi.classList.remove("strikethrough");
});

appEvents.on("todo:removed", (removedTodo) => {
    /** @type {HTMLLIElement} */
    const todoLi = todoList.querySelector(`li[data-todo-id="${removedTodo.id}"]`);

    todoLi.remove();
});