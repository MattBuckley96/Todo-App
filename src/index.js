const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

class Page {
    constructor(name, todos, background) {
        this.name = name;
        this.todos = todos;
        this.background = background;
    }
    
    toJSON() {
        return {
            name: this.name,
            todos: this.todos,
            background: this.background
        };
    }
}

let allTodos = getTodos();

const dailyPage = new Page("Daily", allTodos, "daily.jpg"); 
const goalsPage = new Page("Goals", allTodos, "goals.jpg");

loadPage(dailyPage);
updateTodoList();

todoForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTodo();
})

function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText.length <= 0) {
        return;
    }

    const todoObject = {
        text: todoText,
        completed: false
    }

    allTodos.push(todoObject);
    updateTodoList();
    saveTodos();
    todoInput.value = "";
}

function updateTodoList() {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex)=>{
        todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    })
}

function createPage(pageJSON) {
    const obj = JSON.parse(pageJSON);

    return new Page(obj.name, obj.todos, obj.background);    
}

// loads the page onto the screen
function loadPage(page) {
    const title = document.getElementById("title");

    title.textContent = page.name;

    const body = document.querySelector("body");
    body.style.backgroundImage = `url("../assets/${page.background}")`;
}

function createTodoItem(todo, todoIndex) {
    const todoID = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;

    todoLI.className = "todo";
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoID}">
        <label class="custom-checkbox" for="${todoID}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>
        <label for="${todoID}" class="todo-text">
            ${todoText}
        </label>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `

    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=>{
        deleteTodoItem(todoIndex);
    })

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", ()=> {
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    })

    checkbox.checked = todo.completed;
    return todoLI;
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
}

function saveTodos() {
    const todosJSON = JSON.stringify(allTodos);
    localStorage.setItem("daily", todosJSON);
}

function getTodos() {
    const todos = localStorage.getItem("daily") || "[]";

    return JSON.parse(todos);
}