function loginView(){
    let container=document.createElement('div');
    let login = document.createElement('button');
    let register = document.createElement('button');
    let meny = document.createElement('div');
    let inputUser = document.createElement('input');
    let inputPass = document.createElement('input');

    container.className = "LoginRegContainer";
    login.id="loginButton";
    register.id="registerButton";
    meny.id="dropdownList";
    inputUser.id="userNameInput";
    inputPass.id="passwordInput";

    login.textContent = "Login";
    register.textContent = "Register";
    inputUser.textContent = "Username";
    inputPass.textContent = "Password";

    meny.appendChild(inputUser);
    meny.appendChild(inputPass);
    meny.style.display = "none";

    login.addEventListener('click', function() {
        if (meny.style.display === 'none')
            {
                meny.style.display = 'block';
            }
         else
            {
               meny.style.display = 'none';
            }
        }
    );
    container.appendChild(register)
    container.appendChild(login);
    container.appendChild(meny);
    
    return container;

}

function orderHistoryView (){
       
    let html = ``
    if(model.data.users[model.app.userId].permissions === "admin"){
        for(let i = 0; model.data.orderHistory.length; i++){
        /*html*/
            html+= `<div>
                <div id = "itemID">Item ID: ${model.data.orderHistory[i].itemId}</div>
                <div id = "staus">Betalt: ${model.data.orderHistory[i].paid}</div>
                <div id = "pris">Pris: ${model.data.orderHistory[i].price}</div>
                <div id = "date">Dato: ${model.data.orderHistory[i].date}</div>
                <div id = "type">Type: ${model.data.orderHistory[i].type}</div>
                <div id = "userId">Kjøper : ${model.data.orderHistory[i].userId} 
                Fornavn: ${model.data.users[model.data.orderHistory[i].userId].firstname}
                Etternavn: ${model.data.users[model.data.orderHistory[i].userId].surname} </div>
            </div>`
            }
            }
        else {

            for(let i = 0; i<model.data.orderHistory.length; i++){
                if(model.app.userId === model.data.orderHistory.userId ){
                        
                 /*html*/
                    html+=`<ul>
                        <div id = "title">Produkt Navn: ${model.data.orderHistory[i].title}</div>
                        <img id = "itemImage" src = ${model.data.orderHistory[i].image}>
                        <div id = "type">Type: ${model.data.orderHistory[i].type}</div>
                        <div id = "date">Dato: ${model.data.orderHistory[i].date}</div>
                        <div id = "pris">Pris: ${model.data.orderHistory[i].price}</div>
                    </ul>`
                }
            } 
        }
            
        
        return /*html*/ `
    <div id = "mainOrderHistoryDiv">
        <h1 id = "topText">Orderhistorikk</h1>
        <div class = "OrderHistoryContainer">
            ${html}
        </div>
    </div>
        `
    
}