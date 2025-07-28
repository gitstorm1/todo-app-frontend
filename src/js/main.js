/** @type {HTMLUListElement} */
const todoList = document.getElementById("todoList");

/** @type {HTMLInputElement} */
const createTodoName = document.getElementById("createTodoName");

/** @type {HTMLButtonElement} */
const createTodoButton = document.getElementById("createTodo");

let todosArray = [];

function addNewTodo(todoName) {
    todosArray.push(todoName);
}

function removeTodoByName(todoName) {
    todosArray = todosArray.filter((currentTodoName) => currentTodoName != todoName);
}

createTodoButton.addEventListener("click", () => {
    const todoName = createTodoName.value;

    createTodoName.value = ""

    if (todoName == "") {
        alert("Todo name cannot be empty!");
        return;
    }

    addNewTodo(todoName);

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

    createTodoName.focus();

    console.log(todosArray);
});