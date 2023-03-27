function createSaleView(){
    let categoryList ="";
    for( let i = 0; i<model.inputs.createSale.categoryList.length; i++){
        categoryList += ` <li>${model.inputs.createSale.categoryList[i]}<button onclick = "deleteCategory(${i})">X</button></li>`
    }
    return `
        <div class = "CreateSaleContainer">
            <label id = "productLabel">Produktnavn</label>
            <input id = "productName" type = "text" oninput = "model.inputs.createSale.title = this.value"/>
            <input id = "productDescription" type = "text" oninput = "model.inputs.createSale.description = this.value"/>
            <label id = "priceLabel">Pris: </label>
            <input id = "priceInput" type = "text" oninput = "model.inputs.createSale.price = this.value">
            <div id = "categoryListContainer">
                <ul>${categoryList}</ul>
            </div>
            <label id = "categoryLabel">Legg til kategorier</label>
            <input id = "categoryMain" type = "text" oninput = "model.inputs.createSale.mainCategory = this.value" value = "${model.inputs.createSale.mainCategory}">
            <button id = "mainCategoryAdd" onclick = "addMainCategory()">"Sett hovedkategori"</button>
            <input id = "categorySub" type = "text" oninput = "model.inputs.createSale.subCategory = this.value" placeholder = "Underkategori"/>
            <button id = "subCategoryAdd" onclick = "addSubCategory()">Legg til underkategori</button>
            <div id = "galleryFrame">Bildegalleri</div>
            <input oninput = "model.inputs.createSale.addImage = imageGalleryInput.value" type = "file" id = "galleryInput">
            <button id = "addImageButton" onclick = "insertImage()">"Legg til bilde"</button>
            <input id = "mainPicture" type = "file" oninput = "model.inputs.createSale.mainImage = mainPicture.value">
            <label id = "productId">${model.data.items.length+1}</label>
            <label>Auksjon: </label>
            <input type = "checkbox" id = "auctionBox" ${model.inputs.createSale.auction? 'checked':''} onchange = "model.inputs.createSale.auction = !model.inputs.createSale.auction"/>
            <label>Budfrist</label>
            <input id = "deadline" type = "datetime-local" oninput = "model.inputs.createSale.deadline = this.value">
            <input id = "minimumBidInput" type = "text" placeholder = "Minste tillatte budøkning" oninput = "model.inputs.createSale.minimumBidAmmount = this.value">
            <label>Kan leveres:</label>
            <input id = "deliveryBox" type = "checkbox" ${model.inputs.createSale.deliver? "checked":""} onchange = "model.inputs.createSale.deliver = this.checked">
            <button id = "saveButton" onclick = "createProduct()">Lagre produkt</button>
        </div>
    ` 
}

function loginView(){
    
    return `
        <div class = "loginRegContainer">
            <button onclick = "changeView("registerPage")" id = "registerButton">Register</button>
            <button id = "loginDropdown" onclick = "toogleLoginDrop()">Login</button>
            ${showLoginDropDown()}
        </div>
        `
}

function showLoginDropDown(){

    if(model.inputs.login.dropdown){
        return`
        <div class = "dropdownList">
        <input placeholder = "Brukernavn" oninput = "model.inputs.login.username = this.value" id = "usernameInput"></input>
        <input placeholder = "Passord" oninput = "model.inputs.login.password = this.value" id = "passwordInput"></input>
        <button onclick = "checkLogin()" id = "submitLogin">Sumbit</button>
        </div>
    `
    ;
    }
    else{
        return ``
    }
}

function productDisplay(product){
    return `
    <div class = "productDisplayContainer">
        ${showZoomedPic()}
        <div class = "productDisplayTitle">${model.data.items[product].title}</div>
        <div class = "productDisplayDescriptionContainer">
            <img class = "productDisplayImage" src = "${model.data.items[product].images[0]}" onclick = "blowUpGalleryImg(0)"></img>
            <h1 class = "productDisplayDescriptionTitle">Beskrivelse</h1>
            <p class = "productDisplayDescription">${model.data.items[product].description}</p>
            ${()=>{if(model.data.items[product].auction){
                return`
                    <label class = "productDisplayPriceLabel">Nåværende Bud: </label>
                    <label class = "productDisplayPrice">${model.data.items[product].price}</label>
                    <input id = "productDisplayPriceInput" oninput="model.input.product.bidIncrease = this.value">${model.input.product.bidIncrease}</input>
                    <button class = "productDisplayBuyButton" onclick = "raiseBid(${model.data.items[product].id})">Øk bud</button>
                    <div id = "productDisplayDeadline">Auksjonen stenges om: ${model.data.items[product].deadline}</div>
                `
            }
            else{
                return`
                    <label class = "productDisplayPriceLabel">Pris: </label>
                    <label class = "productDisplayPrice">${model.data.items[product].price}</label>
                    <button class = "productDisplayBuyButton" onclick = "addToShoppingCart(${model.data.items[product].id})">Legg til i handlekurv</button>
                `
            }}}
        </div>
        <div id = "productDisplayImageGalleryContainer">
            ${()=>{
                let html;
                for(let i = 1; i<model.data.items[product].images.length;i++){
                    html += `<img class = "productDisplayGalleryImage" src = "${model.data.items[product].images[i]}"></img>`
                }
                return html
            }}	
        </div>
    </div>
    `
}

function showZoomedPic(){
    if(model.app.zoomedPic){
        return `<img id = "zoomedPic" src = "${model.data.items[product].images[model.app.zoomedPic]}" onclick = "unZoom()"></img>`
    }
    return ``
}

function showFilterBox(){
    let priceLimits = determinePriceLimits()
    return `
        <div>
            <h3>Kategorier</h3>
            <div>
                ${generateCategoryElems(-1)}
            </div>
            <div>
                <label>Vis auksjonsvarer: </label>
                <input oninput = "model.inputs.category.filterAuctionCheck = !model.inputs.category.filterAuctionCheck" type = "checkbox" ${model.inputs.category.filterAuctionCheck? "checked":""}/>
            </div>
            <div>
                <label>Vis fastprisvarer: </label>
                <input onchange = "model.inputs.category.filterNormalCheck = !model.inputs.category.filterNormalCheck" type = "checkbox" ${model.inputs.category.filterNormalCheck? "checked":""}/>
            </div>
            <div>
                <input type = "range" onchange = "changePriceLevels(this.value)" min="${priceLimits.min}" max = "${priceLimits.max}" value = "${model.inputs.category.priceRange.max}"></input>
                <input type = "text" value = "${priceLimits.min}"></input>
                <input type = "text" onchange = "changePriceLevels(this.value)" value = "${model.inputs.category.priceRange.max}"></input>
            </div>
        </div>
        `
}

function generateCategoryElems(parentId){
    let html = ""
    for(let i = 0; i<model.inputs.category.categoryList.length; i++){
        if(model.inputs.category.categoryList[i].parent==parentId){
            html += `
                <div>
                    <label>${model.inputs.category.categoryList[i].name}</label>
                    <input type = "checkbox" ${model.inputs.category.categoryList[i].checked? "checked":""} onchange = "checkFilterBox(${i})"/>
                    ${model.inputs.category.categoryList[i].checked? generateCategoryElems(model.inputs.category.categoryList[i].id):""}
                </div>
                    `
        }
    }
    return html
}

function showFilteredProducts(){
    model.inputs.category.filteredItems = filterItems()
    let productList = ``
    for(let i = 0; i<model.inputs.category.filteredItems.length;i++){
        productList += `
            <div class = "filteredProductContainer">
                <img src = ${model.data.items[model.inputs.category.filteredItems[i]-1].images[0]}/>
                <div>
                    <h3>${model.data.items[model.inputs.category.filteredItems[i]-1].title}</h3>
                    <br>
                    <p>${model.data.items[model.inputs.category.filteredItems[i]-1].description}</p>
                    <br>
                    <div>
                        <label>${model.data.items[model.inputs.category.filteredItems[i]-1].price},-</label>
                        ${!model.data.items[model.inputs.category.filteredItems[i]-1].auction?`<button onclick = "addToShoppingCart(${model.data.items[model.inputs.category.filteredItems[i]-1].id})">Legg til I handlekurv</button>`:""}
                        <button onclick = "goToProduct(${i})">Gå til produktside</button>
                    </div>
                </div>
            </div>`
    }
    let container = `
        <div "filteredProductListContainer">
            ${productList}
        </div>`
    return container
}