const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

const dailyPage = new Page("Daily", "daily.jpg"); 
const goalsPage = new Page("Goals", "goals.jpg");

let pages = [ dailyPage, goalsPage ];

let currentPage = pages[0];

currentPage.show();
updateTodoList();

loadMenu(pages);

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

    currentPage.todos.push(todoObject);
    updateTodoList();
    currentPage.saveTodos();
    todoInput.value = "";
}

function updateTodoList() {
    todoListUL.innerHTML = "";
    currentPage.todos.forEach((todo, todoIndex)=>{
        todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    })
}

function createPage(pageJSON) {
    const obj = JSON.parse(pageJSON);

    return new Page(obj.name, obj.todos, obj.background);    
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
        currentPage.deleteTodoItem(todoIndex);
    })

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", ()=> {
        currentPage.todos[todoIndex].completed = checkbox.checked;
        currentPage.saveTodos();
    })

    checkbox.checked = todo.completed;
    return todoLI;
}

function loadMenu(pages) {
    const menu = document.getElementById("menu"); 

    menu.innerHTML = `
        <button id="add-page-button" class="menu-button">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
            </svg>
        </button>
    `

    let button = document.getElementById("add-page-button");
    button.addEventListener('click', ()=>{
        newPage();
    });

    for (let i = 0; i < pages.length; i++) {
        let menuLI = document.createElement("li");
        
        menuLI.className = "menu";

        let link = document.createElement("a");
        link.id = `${i}`;
        link.href = "#";
        link.textContent = pages[i].name;

        menu.append(menuLI);
        menuLI.append(link);

        link.addEventListener("click", ()=>{
            currentPage = pages[link.id];
            currentPage.show();
            updateTodoList();
        });
    }
}

function newPage() {
    window.location.href = "new-page.html";
}