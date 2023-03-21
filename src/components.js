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

/*function registerForm (){


    
}*/

function frontPageProductDisplay(){
    let container = document.createElement("div")
    container.id = "frontPageProductDisplayContainer"

    let topContainer = createFrontpageProductDisplay(model.app.frontPageCurrentShowing.top)

    let botContainer = createFrontpageProductDisplay(model.app.frontPageCurrentShowing.bottom)

    container.appendChild(topContainer)
    container.appendChild(botContainer)

    return container
}

function createFrontpageProductDisplay(id){
    let container = document.createElement("div")

    let rightProductButton = document.createElement("div")

    let leftProductButton = document.createElement("div")

    let imgCont = document.createElement("div")

    let currImg = document.createElement("img")

    let goLeftImg = document.createElement("div")
    
    let goRightImg = document.createElement("div")
    
    imgCont.appendChild(currImg)
    imgCont.appendChild(goLeftImg)
    imgCont.appendChild(goRightImg)

    let descContainer = document.createElement("div")

    let itemTitle = document.createElement("h2")

    descContainer.appendChild(itemTitle)
    if(model.data.items[id].auction==true){
        let priceLabel = document.createElement("label")
        priceLabel.textContent = "Nåværende bud: "

        let price = document.createElement("div")
        price.textContent

        let timeLimit = document.createElement("div")

        let bidButton = document.createElement("button")

        descContainer.appendChild(priceLabel)
        descContainer.appendChild(price)
        descContainer.appendChild(timeLimit)
        descContainer.appendChild(bidButton)
    }
    else{
        let priceLabel = document.createElement("label")
        priceLabel.textContent = "Pris: "

        let price = document.createElement("div")
        price.textContent

        let shoppingCartButton = document.createElement("button")

        descContainer.appendChild(priceLabel)
        descContainer.appendChild(price)
        descContainer.appendChild(shoppingCartButton)
    }
    container.appendChild(imgCont)
    container.appendChild(descContainer)

    return container
}