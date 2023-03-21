function updateView(){
    let container = document.getElementById('app');
    container.innerHTML = '';

    switch (model.app.currentView){
        case 'frontPage':
        container.appendChild(frontpage())
        break;
    }


}
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
        loginCheck();
    };
    
    login.onclick = function(){
        model.inputs.login.dropdown = true;
        updateView();
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

function productDisplay(product){
    let container = document.createElement("div")
    container.className = "productDisplayContainer"

    if(model.app.zoomedPic){
        let bigPic = document.createElement("img")
        bigPic.id = "zoomedPic"
        bigPic.src = model.data.items[product].images[model.app.zoomedPic]
        bigPic.onclick = unZoom()
        container.appendChild(bigPic)
    }

    let productTitle = document.createElement("div")
    productTitle.className ="productDisplayTitle"
    productTitle.textContent = model.data.items[product].title
    
    let descriptionContainer = document.createElement("div")
    descriptionContainer.className = "productDisplayDescriptionContainer"

    let imageContainer = document.createElement("img")
    imageContainer.className = "productDisplayImage"
    imageContainer.src = model.data.items[product].images[0]
    imageContainer.onclick = blowUpGalleryImg(0)

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
        img.onclick = blowUpGalleryImg(i)
        galleryContainer.appendChild(img)
    }

    purchaseContainer.appendChild(priceLabel)
    purchaseContainer.appendChild(price)

    if(model.data.items[product].auction){
        priceLabel.textContent = "Nåværende bud: "
        
        buyButton.textContent = "Legg inn bud"
        buyButton.onclick = raiseBid(model.data.items[product].id)
        
        let increaseBid = document.createElement("input")
        increaseBid.placeholder = "Øk bud"
        increaseBid.oninput = model.inputs.product.bidIncrease = increaseBid.value

        let deadline = document.createElement("div")
        deadline.textContent = "Auksjonen stenges: " + model.data.items[product].deadline
        deadline.className = "productDisplayDeadline"

        descriptionContainer.appendChild(deadline)
        purchaseContainer.appendChild(increaseBid)
    }
    else{
        priceLabel.textContent = "Pris: "
        
        buyButton.textContent = "Legg til i handlekurv"
        buyButton.onclick = addToShoppingCart(model.data.items[product].id)
    }
    purchaseContainer.appendChild(buyButton)
    
    return container
}



function createSaleView(){
    let container = document.createElement('div');
    container.className ="CreateSaleContainer"; 

    let productName = document.createElement('input');
    productName.id = "pName";
    productName.setAttribute ("type","text");

    let productNameLabel = document.createElement('label');
    productNameLabel.id = "pLabel";
    productNameLabel.textContent = "Produkt Navn"

    let productDescription = document.createElement('input');
    productDescription.id = "pDescription";
    productDescription.setAttribute ("type","text"); 

    let priceInput = document.createElement('input');
    priceInput.id = "priceInput";
    priceInput.setAttribute("type","text");

    let priceInputLabel = document.createElement('label');
    priceInputLabel.id = "priceLabel";
    priceInput.textContent = "Pris:";

    let categoryList = document.createElement('div');
    categoryList.id = "categoryList";

    let categoryListLabel = document.createElement('label');
    categoryListLabel.id = "categoryLabel"; 
    categoryListLabel.textContent = "Sett / endre produkt kategori:";

    let mainPicture = document.createElement('div');
    mainPicture.id = "mainPic";

    let imageGalery = document.createElement('div');
    imageGalery.id = "picGalery";
    imageGalery.textContent = "Bildegalleriet";

    let imageGaleryInput = document.createElement('input');
    imageGaleryInput.id = "galeryInput"; 

    let productId = document.createElement('label');
    productId.id = "pId";

    let frontPageBox = document.createElement('input');
    frontPageBox.id = "fPageBox";
    frontPageBox.setAttribute("type","checkbox")
    let frontPageBoxLabel = document.createElement('label');
    frontPageBoxLabel.htmlFor ="fPageBox";
    frontPageBoxLabel.appendChild(document.createTextNode('Vise i første side'));


    let auctionBox = document.createElement('input');
    auctionBox.id = "auctionBox";
    frontPageBox.setAttribute("type","checkbox")
    let auctionLabel = document.createElement('label');
    auctionLabel.htmlFor ="auctionBox";
    auctionLabel.appendChild(document.createTextNode('Auksjon'));

    let bidDeadline = document.createElement('input');
    bidDeadlineTime.id = "deadline"; 
    bidDeadline.setAttribute("type","datetime-local");
    bidDeadline.oninput = function(){
        setDeadline()
    }
    let deadlineLabel = document.createElement('label');
    deadlineLabel.htmlFor ="deadline";
    deadlineLabel.appendChild(document.createTextNode('Sett bud frist'));


    let minimumBidBox = document.createElement('input');
    minimumBidBox.id = "minBidBox";

    let minimumBidAmmount = document.createElement('input');
    minimumBidAmmount.id = "minBidInput"; 

    let deliveryCheckBox = document.createElement('input');
    deliveryCheckBox.id = "deliveryBox";

    let saveButton = document.createElement('button');
    saveButton.id = "saveButton";

     
     
    
}