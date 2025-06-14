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