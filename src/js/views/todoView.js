import { appEvents } from "../utils/EventEmitter.js";

/** @type {HTMLUListElement} */
const todoList = document.getElementById("todoList");

function showTodoAsCompleted(todo) {
    /** @type {HTMLLIElement} */
    const todoLi = todoList.querySelector(`li[data-todo-id="${todo.id}"]`);

    /** @type {HTMLButtonElement} */
    const completeTodo = todoLi.querySelector(".complete-todo-button");
    completeTodo.textContent = "Undo-complete";

    todoLi.classList.add("strikethrough");
}

function createTodoLi(todo) {
    /** @type {HTMLLIElement} */
    const todoLi = document.createElement("li");

    todoLi.dataset.todoId = todo.id;

    /** @type {HTMLButtonElement} */
    const completeTodo = document.createElement("button");
    completeTodo.classList.add("complete-todo-button");
    completeTodo.append("Complete");

    /** @type {HTMLButtonElement} */
    const deleteTodo = document.createElement("button");
    deleteTodo.classList.add("delete-todo-button");
    deleteTodo.append("Delete");

    /** @type {HTMLBRElement} */
    const lineBreak1 = document.createElement("br");
    /** @type {HTMLBRElement} */
    const lineBreak2 = document.createElement("br");
    /** @type {HTMLBRElement} */
    const lineBreak3 = document.createElement("br");

    todoLi.append(todo.name);
    todoLi.appendChild(completeTodo);
    todoLi.appendChild(deleteTodo);
    todoLi.appendChild(lineBreak1);
    todoLi.append(`Description: ${todo.description || "N/A"}`);
    todoLi.appendChild(lineBreak2);
    todoLi.append(`Priority: ${todo.priority}`);
    todoLi.appendChild(lineBreak3);
    todoLi.append(`Created at: ${new Date(todo.createdAt).toLocaleString()}`);
    todoList.appendChild(todoLi);

    if (todo.completed) showTodoAsCompleted(todo);
}

appEvents.on("todo:new", (newTodo) => {
    createTodoLi(newTodo);
});

appEvents.on("todo:reorder", (sortedTodos) => {
    const todoLiMap = new Map();
    for (const todoLiElement of todoList.children) {
        todoLiMap.set(todoLiElement.dataset.todoId, todoLiElement);
    }
    todoList.innerHTML = "";
    for (const todo of sortedTodos) {
        const todoLiElement = todoLiMap.get(todo.id);
        if (todoLiElement) {
            todoList.appendChild(todoLiElement);
        } else {
            createTodoLi(todo);
        }
    }
});

appEvents.on("todo:completed", (todo) => {
    showTodoAsCompleted(todo);
});

appEvents.on("todo:undo-completed", (todo) => {
    /** @type {HTMLLIElement} */
    const todoLi = todoList.querySelector(`li[data-todo-id="${todo.id}"]`);

    /** @type {HTMLButtonElement} */
    const completeTodo = todoLi.querySelector(".complete-todo-button");
    completeTodo.textContent = "Complete";

    todoLi.classList.remove("strikethrough");
});

appEvents.on("todo:deleted", (deletedTodo) => {
    /** @type {HTMLLIElement} */
    const todoLi = todoList.querySelector(`li[data-todo-id="${deletedTodo.id}"]`);

    if (todoLi) {
        todoLi.remove();
    } else {
        console.warn("todo:deleted event occured but the li element is not there");
    }
});