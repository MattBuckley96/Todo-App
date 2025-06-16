const pageForm = document.querySelector('form');

const back = document.getElementById("back-button"); 
back.addEventListener('click', ()=>{
    window.location.href = "index.html";
});

pageForm.addEventListener('submit', function(e){
    e.preventDefault();

    const nameInput = document.getElementById("name-input");
    const name = nameInput.value.trim();

    if (name.length <= 0) {
        return;
    }

    const backgroundInput = document.getElementById("background-input");
    const background = backgroundInput.value.trim();

    if (background.length <= 0) {
        return;
    }

    // TODO: styling
    if (!confirm(`Create Page "${name}"?`))
    {
        return;
    }

    let page = new Page(name, background);

    let pages = loadPages();
    pages.push(page);
    savePages(pages);
});