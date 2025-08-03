import * as todoService from "../services/todoService.js";

export class TodoController {
    /** @type {HTMLUListElement} */
    #todoList;

    /** @type {HTMLInputElement} */
    #createTodoName;

    /** @type {HTMLTextAreaElement} */
    #createTodoDescription;

    /** @type {HTMLInputElement} */
    #createTodoPriority;

    /** @type {HTMLButtonElement} */
    #createTodoButton;

    constructor() {
        this.#initializeVariables();
        this.#setupEventListeners();
        this.#handleSavedTodos();
    }

    #initializeVariables() {
        this.#todoList = document.getElementById("todoList");
        this.#createTodoName = document.getElementById("createTodoName");
        this.#createTodoDescription = document.getElementById("createTodoDescription");
        this.#createTodoPriority = document.getElementById("createTodoPriority");
        this.#createTodoButton = document.getElementById("createTodo");
    }

    #setupEventListeners() {
        this.#createTodoButton.addEventListener("click", () => {
            const todoName = this.#createTodoName.value;
            const todoDescription = this.#createTodoDescription.value;
            const todoPriority = Number(this.#createTodoPriority.value);
        
            if (todoName == "") {
                alert("Todo name cannot be empty!");
                return;
            }
        
            todoService.addNewTodo(
                todoName,
                todoDescription,
                todoPriority
            );
        
            this.#createTodoName.value = ""
            this.#createTodoName.focus();
        });
        
        this.#todoList.addEventListener("click", (event) => {
            /** @type {HTMLElement} */
            const target = event.target;
        
            if (target.classList.contains("complete-todo-button")) {
                /** @type {HTMLLIElement} */
                const todoLi = target.parentElement;
        
                const todo = todoService.getTodoById(todoLi.dataset.todoId);
        
                if (target.textContent === "Complete") {
                    todo.complete();
                } else {
                    todo.undoComplete();
                }
            } else if (target.classList.contains("delete-todo-button")) {
                /** @type {HTMLLIElement} */
                const todoLi = target.parentElement;
        
                todoService.deleteTodoById(todoLi.dataset.todoId);
            }
        });
    }

    #handleSavedTodos() {
        todoService.loadSavedTodos();
    }
}