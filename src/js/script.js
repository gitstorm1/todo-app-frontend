/** @type {HTMLButtonElement} */
const createTodo = document.getElementById("createTodo");
/** @type {HTMLInputElement} */
const createTodoName = document.getElementById("createTodoName");
/** @type {HTMLUListElement} */
const todoList = document.getElementById("todoList");

createTodo.addEventListener("click", () => {
    const todoName = createTodoName.value;

    createTodoName.value = ""

    if (todoName == "") {
        alert("Todo name cannot be empty!");
        return;
    }

    /** @type {HTMLLIElement} */
    const todo = document.createElement("li");

    /** @type {HTMLButtonElement} */
    const completeTodo = document.createElement("button");
    completeTodo.classList.add("complete-todo-button");
    completeTodo.append("Complete");

    completeTodo.addEventListener("click", () => {
        todo.remove();
    });

    todo.append(todoName);
    todo.append(completeTodo);

    todoList.append(todo);

    createTodoName.focus();
});