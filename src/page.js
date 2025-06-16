class Page {
    constructor(name, background) {
        this.name = name;
        this.background = background;
        this.getTodos();
    }
    
    toJSON() {
        return {
            name: this.name,
            todos: this.todos,
            background: this.background
        };
    }

    getTodos() {
        const todos = localStorage.getItem(this.name.toLowerCase()) || "[]";

        this.todos = JSON.parse(todos); 
    }

    saveTodos() {
        const todosJSON = JSON.stringify(this.todos);
        localStorage.setItem(this.name.toLowerCase(), todosJSON);
    }

    deleteTodoItem(todoIndex) {
        this.todos = this.todos.filter((_, i)=> i !== todoIndex);
        this.saveTodos();
        updateTodoList();
    }

    show() {
        const title = document.getElementById("title");

        title.textContent = this.name;

        const body = document.querySelector("body");
        body.style.backgroundImage = `url("../assets/${this.background}")`;
    }
}

function savePages(pages) {
    let pagesJSON = JSON.stringify(pages.map(page => ({
        name: page.name,
        background: page.background
    })));

    localStorage.setItem('pages', pagesJSON);
}

function loadPages() {
    const pageData = localStorage.getItem("pages") || "[]";

    if (pageData != "[]") {
        return JSON.parse(pageData).map(obj => new Page(obj.name, obj.background));
    }

    return [ new Page("Daily", "daily.jpg"), new Page("Goals", "goals.jpg") ];
}