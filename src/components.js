const app = document.getElementById("app")

function updateView(){
    app.innerHTML = ""
    switch(model.app.currentView){
        case "frontPage":
            app.innerHTML += loginView()
            break
        case "filteredPage":
            app.innerHTML = showFilterBox()
            break
        case "registerPage":
            break
    }
}

function loginView(){
    return `
        <div class = "loginRegContainer">
            <button onclick = "changeView("registerPage")" id = "registerButton">Register</button>
            <button id = "loginDropdown">Login</button>
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
        <button onclick = "loginCheck()" id = "submitLogin"></button>
        </div>
    `
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
    let highestPrice = 0;
    let lowestPrice = 241702352;
    model.inputs.category.filteredItems.forEach(
        (elem) => {
            highestPrice = elem.price>highestPrice? elem.price : highestPrice
            lowestPrice = elem.price<lowestPrice?elem.price : lowestPrice
        }
    )
    model.inputs.category.priceRange.max = highestPrice
    model.inputs.category.priceRange.min = lowestPrice
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
                <input type = "range" min="${lowestPrice}" max = "${highestPrice}" value = "${model.inputs.category.priceRange.max}"></input>
                <input type = "text">${model.inputs.category.priceRange.min}</input>
                <input type = "text">${model.inputs.category.priceRange.max}</input>
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