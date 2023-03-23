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

    let productNameLabel = document.createElement('label');
    productNameLabel.id = "productLabel";
    productNameLabel.textContent = "Produkt Navn"
    container.appendChild(productNameLabel);

    let productName = document.createElement('input');
    productName.id = "productName";
    productName.setAttribute ("type","text");
    productName.oninput = ()=> model.inputs.createSale.title = productName.value;
    container.appendChild(productName);
    

    let productDescription = document.createElement('input');
    productDescription.id = "productDescription";
    productDescription.setAttribute ("type","text"); 
    productDescription.oninput = ()=> model.inputs.createSale.description = productDescription.value;
    container.appendChild(productDescription);


    let priceInputLabel = document.createElement('label');
    priceInputLabel.id = "priceLabel";
    priceInput.textContent = "Pris:";
    container.appendChild(priceInputLabel);

    let priceInput = document.createElement('input');
    priceInput.id = "priceInput";
    priceInput.setAttribute("type","text");
    priceInput.oninput = ()=> model.inputs.createSale.price = priceInput.value;
    container.appendChild(priceInput);


    let categoryListLabel = document.createElement('label');
    categoryListLabel.id = "categoryLabel"; 
    categoryListLabel.textContent = "Sett / endre produkt kategori:";
    container.appendChild(categoryListLabel);
    

    let categoryMain = document.createElement('input');
    categoryMain.id = "categoryMain";
    priceInput.setAttribute("type","text");
    categoryMain.placeholder = "Hoved Kategori"
    categoryMain.oninput = ()=> model.inputs.createSale.mainCategory = categoryMain.value;
    container.appendChild(categoryMain);

    let mainCategoryAdd = document.createElement ('button');
    mainCategoryAdd.id = "mainCategoryAdd";
    mainCategoryAdd.textContent = "Tilset Hoved Kategori";
    mainCategoryAdd.onclick = function(){
        addMainCategory()
    }
    categoryMain.appendChild(mainCategoryAdd);


    let categorySub = document.createElement('input');
    categorySub.id = "categorySub";
    priceInput.setAttribute("type","text");
    categorySub.placeholder = "Sub Kategori";
    categoryMain.oninput = ()=> model.inputs.createSale.subCategory = categorySub.value;
    container.appendChild(categorySub);

    let subCategoryAdd = document.createElement ('button');
    subCategoryAdd.id = "mainCategoryAdd";
    subCategoryAdd.textContent = "Tilset Sub Kategori";
    subCategoryAdd.onclick = function(){
        addSubCategory()
    }
    subCategoryAdd.appendChild(subCategoryAdd);

    
    let galleryFrame = document.createElement('div');
    galleryFrame.id = "galleryFrame";
    galleryFrame.textContent = "bildeGalleriet";
    container.appendChild(galleryFrame);

    let imageGalleryInput = document.createElement('input');
    imageGalleryInput.id = "galleryInput"; 
    imageGalleryInput.setAttribute ("file");
    imageGalleryInput.appendChild(galleryFrame);
    
    
    let mainPicture = document.createElement('input');
    mainPicture.id = "mainPicture";
    mainPicture.setAttribute ("file");
    container.appendChild(mainPicture);

   

    

    let productId = document.createElement('label');
    productId.id = "productId";
    productId.textContent = model.data.items[model.data.items.length -1].id ++;
    container.appendChild(productId);


    let frontPageBoxLabel = document.createElement('label');
    frontPageBoxLabel.textContent = "Vise i første side";
    
    container.appendChild(frontPageBox);


    let frontPageBox = document.createElement('input');
    frontPageBox.id = "frontPageBox";
    frontPageBox.setAttribute("type","checkbox");
    frontPageBox.checked == true;
    frontPageBox.oninput = ()=> model.inputs.createSale.frontPage = frontPageBox.value;
    container.appendChild(frontPageBoxLabel);


    let auctionLabel = document.createElement('label');
    auctionLabel.textContent = "Auksjon";
    container.appendChild(auctionLabel);


    let auctionBox = document.createElement('input');
    auctionBox.id = "auctionBox";
    frontPageBox.setAttribute("type","checkbox");
    auctionLabel.checked == true;
    auctionLabel.oninput = ()=> model.inputs.createSale.auction = auctionLabel.value;
    container.appendChild(auctionBox);

    
    let deadlineLabel = document.createElement('label');
    deadlineLabel.textContent = "Sett Bud Frist";
    container.appendChild(deadlineLabel);

    
    
    let bidDeadline = document.createElement('input');
    bidDeadline.id = "deadline"; 
    bidDeadline.setAttribute("type","datetime-local");
    bidDeadline.oninput =  ()=> model.inputs.createSale.deadline = bidDeadline.value;
    container.appendChild(bidDeadline);

    let minimumBidLabel = document.createElement('label');
    minimumBidLabel.textContent = "Sett minst bud";
    container.appendChild(minimumBidLabel);

    let minimumBidBox = document.createElement('input');
    minimumBidBox.id = "minimumBidBox";
    minimumBidBox.setAttribute("type","checkbox")
    minimumBidBox.checked == true;
    minimumBidBox.oninput = ()=> model.inputs.createSale.minimumBid = minimumBidBox.value;
    container.appendChild(minimumBidBox);
    

    let minimumBidAmmount = document.createElement('input');
    minimumBidAmmount.id = "minimumBidInput"; 
    minimumBidAmmount.setAttribute("type","text");
    minimumBidAmmount.oninput =  ()=> model.inputs.createSale.minimumBidAmmount = minimumBidAmmount.value;
    container.appendChild(minimumBidAmmount);

    let deliveryBoxLabel = document.createElement('label');
    deliveryBoxLabel.textContent = "Kan Leveres";
    container.appendChild(deliveryBoxLabel);


    let deliveryCheckBox = document.createElement('input');
    deliveryCheckBox.id = "deliveryBox";
    minimumBidBox.setAttribute("type","checkbox")
    deliveryCheckBox.checked == true;
    deliveryCheckBox.oninput = ()=> model.inputs.createSale.deliver = deliveryCheckBox.value;
    container.appendChild(deliveryCheckBox)
   

    let saveButton = document.createElement('button');
    saveButton.id = "saveButton";
    saveButton.textContent = "Legg ut produkt"
    saveButton.onclick = function(){
        createProduct()
    }
    container.appendChild(saveButton)

     
     return container
    
}