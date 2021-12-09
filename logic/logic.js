function filterInLibrary(button){
    let id = button.id;
    callAjaxGet(id, res => {
        let books = JSON.parse(res);
        for (let book of books){
            let card = document.getElementById(book.title);
            if (book.status === 'false'){
                card.style.display =  'none';
            } else if (book.status === 'true'){
                card.style.display = 'block';
            }
        }
    })
}

/*function giveToUser(){
    let form = document.forms['give'];
    let name = form.elements['name'].value;
    let dateOfReturn = form.elements["dateOfReturn"].value;
    // сериализуем данные в json
    let user = JSON.stringify({name: name, date: dateOfReturn});
    let request = new XMLHttpRequest();
    // посылаем запрос на адрес "/user"
    console.log('AJAX user:');
    console.log(user);
    request.open("POST", "/give", true);
    request.send(user);
}*/

function callAjaxGet(id, callback){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200)
            callback(this.responseText);
    };
    xhttp.open("GET",`/library/${id}`,true);
    xhttp.send();
}

function callAjaxPost(id, callback){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200)
            callback(this.responseText);
    };
    xhttp.open("POST",'/give',true);
    xhttp.send();
}
