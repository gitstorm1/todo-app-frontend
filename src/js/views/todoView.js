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

appEvents.on("todo:new", (newTodo) => {
    /** @type {HTMLLIElement} */
    const todoLi = document.createElement("li");

    todoLi.dataset.todoId = newTodo.id;

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

    todoLi.append(newTodo.name);
    todoLi.appendChild(completeTodo);
    todoLi.appendChild(deleteTodo);
    todoLi.appendChild(lineBreak1);
    todoLi.append(`Description: ${newTodo.description || "N/A"}`);
    todoLi.appendChild(lineBreak2);
    todoLi.append(`Priority: ${newTodo.priority}`);

    todoList.appendChild(todoLi);

    if (newTodo.completed) showTodoAsCompleted(newTodo);
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