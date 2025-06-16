const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let isEditing = false;

let pages = loadPages(); 
savePages(pages);

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
        <button id="edit-page-button" class="menu-button">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
            </svg>
        </button>
        <a class="dummy">.</a>
    `

    let add = document.getElementById("add-page-button");
    add.addEventListener('click', ()=>{
        newPage();
    });

    let edit = document.getElementById("edit-page-button");
    edit.addEventListener('click', ()=>{
        isEditing = !isEditing;
        loadMenu(pages);
    });

    if (!pages) {
        return;
    }

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

        if (!isEditing) {
            continue;
        }

        let deleteButton = document.createElement("button");
        deleteButton.className = "delete-page-button";
        deleteButton.innerHTML = `
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        `

        deleteButton.addEventListener('click', ()=>{
            deletePage(i);
        });

        menuLI.prepend(deleteButton);
    }
}

function deletePage(index) {
    const page = pages[index];

    // remove todos
    localStorage.removeItem(page.name.toLowerCase());

    pages.splice(index, 1);

    savePages(pages);

    currentPage = pages[0];
    currentPage.show();
    updateTodoList();
    loadMenu(pages);
}

function newPage() {
    window.location.href = "new-page.html";
}