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

    let page = new Page(name, "daily.jpg");
    console.log(page);
});