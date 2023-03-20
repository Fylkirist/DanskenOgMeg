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

function productDisplay(product){
    let container = document.createElement("div")
    container.className = "productDisplayContainer"

    let productTitle = document.createElement("div")
    productTitle.className ="productDisplayTitle"
    productTitle.textContent = model.data.items[product].title
    
    let descriptionContainer = document.createElement("div")
    descriptionContainer.className = "productDisplayDescriptionContainer"

    let imageContainer = document.createElement("img")
    imageContainer.className = "productDisplayImage"
    imageContainer.src = model.data.items[product].images[0]

    let descriptionTitle = document.createElement("h1")
    descriptionTitle.className = "productDisplayDescriptionTitle"
    descriptionTitle.textContent = "Beskrivelse"

    let productDescription = document.createElement("p")
    productDescription.className = "productDisplayDescription"
    productDescription.textContent = model.data.items[product].description

    let priceLabel = document.createElement("label")
    priceLabel.className = "productDisplayPriceLabel"

    let price = document.createElement("div")
    price.className = "productDisplayPrice"
    price.textContent = model.data.items[product].price

    let buyButton = document.createElement("button")
    buyButton.className = "productDisplayBuyButton"

    let purchaseContainer = document.createElement("div")
    purchaseContainer.className = "productDisplayPurchaseContainer"

    let galleryContainer = document.createElement("div")
    galleryContainer.className = "productDisplayImageGallery"

    let galleryHeader = document.createElement("h2")
    galleryHeader.textContent = "Bildegalleri"
    galleryHeader.className = "productDisplayGalleryHeader"

    descriptionContainer.appendChild(descriptionTitle)
    descriptionContainer.appendChild(imageContainer)
    descriptionContainer.appendChild(productDescription)

    galleryContainer.appendChild(galleryHeader)

    container.appendChild(productTitle)
    container.appendChild(descriptionContainer)
    container.appendChild(galleryContainer)
    
    for(let i = 1; i<model.data.items[product].images.length;i++){
        let img = document.createElement("img")
        img.className = "productDisplayGalleryElement"
        img.src = model.data.items[product].images[i]
        img.onclick = blowUpGalleryImg(this)
        galleryContainer.appendChild(img)
    }

    purchaseContainer.appendChild(priceLabel)
    purchaseContainer.appendChild(price)

    if(model.data.items[product].auction){
        priceLabel.textContent = "Nåværende bud: "
        
        buyButton.textContent = "Legg inn bud"
        buyButton.onclick = raiseBid(product)
        
        let increaseBid = document.createElement("input")
        increaseBid.placeholder = "Øk bud"
        increaseBid.oninput = model.inputs.product.bidIncrease = increaseBid.value

        purchaseContainer.appendChild(increaseBid)
    }
    else{
        priceLabel.textContent = "Pris: "
        
        buyButton.textContent = "Legg til i handlekurv"
        
        buyButton.onclick = addToShoppingCart(product)
    }
    purchaseContainer.appendChild(buyButton)
    
    return container
}