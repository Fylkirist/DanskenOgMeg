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
    return /*html*/ `
    <div class = "OrderHistoryContainer">
        
        <h1 id = topText>Orderhistorikk</h1>

        <ul>

            if(${model.data.users.})
            ${model.data.orderHistory.map(order => /*html*/
            `<ul>
                <div>Item ID: ${order.itemId}</div>
                <div>Status: ${order.sold}</div>
                <div>Pris: ${order.price}</div>
                <div>Dato: ${order.date}</div>
                <div>Type: ${order.type}</div>
                <div>Bruker ID: ${order.userId}</div>
            </ul>
            )}


    
    
    </div>
    `


    
}