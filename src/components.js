function loginView(){
    let container=document.createElement('div');
    let login = document.createElement('button');
    let register = document.createElement('button');
    let meny = document.createElement('div');
    let inputUser = document.createElement('input');
    let inputPass = document.createElement('input');
    let loginEnter = document.createElement('button');

    container.className = "LoginRegContainer";
    login.id="loginButton";
    register.id="registerButton";
    meny.className="dropdownList";
    inputUser.id="userNameInput";
    inputPass.id="passwordInput";
    loginEnter.id="LoginKnapp"

    login.textContent = "Login";
    register.textContent = "Register";
    inputUser.textContent = "Username";
    inputPass.textContent = "Password";
    loginEnter.textContent = "confirm"
   

    inputUser.oninput = function ()
    {model.inputs.login.username = inputUser.value;}

    inputPass.oninput = function ()
    {model.inputs.login.password = inputPass.value;}

    loginEnter.onclick = function() {
        checkLogin();
        container.innerHTML="";
        model.inputs.login.dropdown=false;
        container.appendChild(loginView())
    };
    
    login.onclick = function(){
        model.inputs.login.dropdown = true;
        container.innerHTML = "";
        container.appendChild(loginView());
    }

    
    meny.appendChild(inputUser);
    meny.appendChild(inputPass);
    meny.appendChild(loginEnter)

    container.appendChild(register)
    container.appendChild(login);

    if(model.inputs.login.dropdown)
    {
        container.appendChild(meny)
    }
    
    return container;

}

/*function registerForm (){


    
}*/