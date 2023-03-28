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
    let userStatus  

    for (let i = 0; i<model.data.users.length; i++){
        userStatus = model.data.users[i].key.permissions;
    }
    return /*html*/ `
    <div class = "OrderHistoryContainer">
        
        <h1 id = "topText">Orderhistorikk</h1>

            ${()=>{if(userStatus === "admin"){
                model.data.orderHistory.map(order => /*html*/
                `<ul>
                    <div id = "itemID">Item ID: ${order.itemId}</div>
                    <div id = "staus">Status: ${order.sold}</div>
                    <div id = "pris">Pris: ${order.price}</div>
                    <div id = "date">Dato: ${order.date}</div>
                    <div id = "type">Type: ${order.type}</div>
                    <div id = "userId">Bruker ID: ${order.userId}</div>
                </ul>`
                    ).join('')
            }
            else{
                model.data.orderHistory.map(order => /*html*/
                `<ul>
                    <div id = "itemID">Item ID: ${order.itemId}</div>
                    <div id = "staus">Status: ${order.sold}</div>
                    <div id = "pris">Pris: ${order.price}</div>
                    <div id = "date">Dato: ${order.date}</div>
                    <div id = "type">Type: ${order.type}</div>
                </ul>`
                    ).join('')
            } }}
    
    
    </div>
    `
    
}