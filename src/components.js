
function frontPageProductView(){
    let topElem = generateFrontPageElement(model.data.frontPageTop[model.app.frontPageCurrentShowing.top])
    let botElem = generateFrontPageElement(model.data.frontPageBottom[model.app.frontPageCurrentShowing.bottom])
    return `
        <div id = "frontPageProductDisplay">
            <div class = "frontPageProductDisplayElement">
                <div onclick = "changeFrontPageTopProduct(1)" class = "frontPageRightArrow"></div>
                ${topElem}
                <div onclick = "changeFrontPageTopProduct(-1)" class = "frontPageLeftArrow"></div>
            </div>
            <div class = "frontPageProductDisplayElement">
                <div onclick = "changeFrontPageBotProduct(1)" class = "frontPageRightArrow"></div>
                ${botElem}
                <div onclick = "changeFrontPageBotProduct(-1)" class = "frontPageLeftArrow"></div>
            </div>
        </div>
    ` 
}

function generateFrontPageElement(item){
    let varElems;
    if (model.data.items[item].auction){
        varElems = `
            <label>Høyeste bud: </label>
            <label>${model.data.items[item].price}</label>
            <button onclick = "">Gå til auksjon</button>
        `
    }
    else{
        varElems = `
            <label>Pris: </label>
            <label>${model.data.items[item].price}</label>
            <button onclick = "">Legg til i handlekurv</button>
            <button onclick = "">Gå til produktside</button>
        `  
    }
    return `
        <div>
            <img src = "${model.data.items[item].images[0]}"/>
            <h4>${model.data.items[item].title}</h4>
            <p>${model.data.items[item].description}</p>
            ${varElems}    
        </div>
    ` 
}

function createHeaderSection(){
    return /*html*/`
    <div class="headerContainer">
        <h1 class="overskrift">Dansken og meg</h1>
        ${!model.app.loggedInStatus ? `<div class="registerButton" onclick="">Registrer</div>
        <div class="loginButton" onclick="loginDropDown()">Login</div>` :
        `<div class="userButton" onclick="">${model.app.loggedInUser.userName}</div>`}
        <div class="cartIcon" onclick="">🛒</div>
        <h3 class="underskrift">VintageSkatter</h1>
        ${model.inputs.login.dropdown ? 
            `<input type="text" 
            class="userNameInput" 
            onchange="model.inputs.login.username = this.value"
            value="${model.inputs.login.username}"
            required
            /> 
        <input type="password" 
            class="passwordInput" 
            onchange="model.inputs.login.password = this.value"
            value="${model.inputs.login.password}"
            required
        /> 
        <div class="loginSubmitButton" onclick="checkUserIdPassword()">Submit</div>
        ${model.inputs.login.wrongUserNamePassword ? 
            `<p class="wrongUser">${model.app.wrongUserNamePasswordMessage}</p> 
            <p class="forgotPassword">
            <span onclick=""> Forgot password?</span> 
            <span onclick=""> New user?</span>
            </p>` :
                ''
                 }
                ` : ''
                 }
    </div>
                `;
}

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

function editUserPage(){
        let html = ""
      return  /*html*/ ` 
       <div class = "containerDiv">
            <div id = "persoinalInfo">
                <div id = firstLast>
                    <input id ="firstNameChangeBox" type = "text" placeholder = "Fornavn"
                        value  = "${model.data.users[model.app.userId].firstname}" oninput = "model.inputs.register.firstName = this.value">
                    <input id ="lastNameChangeBox" type = "text" placeholder = "Etternavn"
                        value = "${model.data.users[model.app.userId].surname}" oninput = "model.inputs.register.lastName = this.value">
                    <input id ="phoneNumberChangeBox" type = "text" placeholder = "Telefon Nummer"
                        value = "${model.data.users[model.app.userId].mobile}" oninput = "model.inputs.register.mobile = this.value">
                    <input id ="emailChangeBox" type = "text" placeholder = "Epost"
                        value = "${model.data.users[model.app.userId].email}" oninput = "model.inputs.register.email = this.value">
                        <button id = "personalInfoConfirm" onclick = "oppdaterPersonalia('namePhoneEmail')">Confirm</button>
                </div>
                <div id = addressChange>
                    <input id ="cityNameChangeBox" type = "text" placeholder = "By"
                        value = "${model.data.users[model.app.userId].city}" oninput = "model.inputs.register.city = this.value">
                    <input id ="adressNameChangeBox" type = "text" placeholder = "Adresse"
                        value = "${model.data.users[model.app.userId].address}" oninput = "model.inputs.register.address = this.value">
                    <input id ="zipCode" type = "text" placeholder = "Postkode"
                        value = "${model.data.users[model.app.userId].zip}" oninput = "model.inputs.register.zip = this.value">
                    <button id ="addressConfirm" onclick = "oppdaterPersonalia('adresse')">Confirm</button>
                </div>
               
                <div id = "changePassword">
                    <input id = "currentPassword" type = "password" placeholder = "Passord"
                        oninput = "model.inputs.register.password = this.value">
                    <input id = "newPassword" type = "password" placeholder = "Ny passord"
                        oninput = "model.inputs.register.repeatPassword = this.value">
                    <button id= "passwordConfirm" onclick = "oppdaterPersonalia('byttPassord')">Confirm</button>
            </div>
            <div id = "cardInfoBox">
                <ul>
                    Betalingsinformasjon:
                    ${model.data.users[model.app.userId].paymentInformation.map((payment, i) => /*html*/`
                        <li>
                            Kortnummer: ${payment.cardNumber}<br>
                            Utløpsdato: ${payment.expirationDate}<br>
                            Kortholders fornavn: ${payment.cardHolderFirstName}<br>
                            Kortholders etternavn: ${payment.cardHolderLastName}<br>
                            By: ${payment.city}<br>
                            Adresse: ${payment.address}<br>
                            Husnummer: ${payment.houseNumber}<br>
                            Postnummer: ${payment.zip}<br>
                            <button onclick = deleteCard(${i})>Slett Kort</button>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div id = "cardAddBox">
                    <input id = "cardNumber" placeholder = "Kort Nummer"
                         oninput = "model.inputs.register.carNumber = this.value">
                    <input id = "expirationDate" placeholder = "Utløps Dato" type = "date"
                         oninput = "model.inputs.register.toDate = this.value">
                    <input id = "cvc" placeholder ="CVC"
                         oninput = "model.inputs.register.cvc = this.value">
                    <input id = "cardFirstName" placeholder = "Fornavn"
                         oninput = "model.inputs.register.firstName = this.value">
                    <input id = "cardLastName" placeholder = "Etternavn"
                         oninput = "model.inputs.register.lastName = this.value">
                    <input id ="cardCityNameChangeBox"  placeholder = "By"
                         oninput = "model.inputs.register.city = this.value">
                    <input id ="cardAdressNameChangeBox"  placeholder = "Adresse"
                         oninput = "model.inputs.register.address = this.value">
                    <input id ="CardZipCode"  placeholder = "Postkode"
                         oninput = "model.inputs.register.zip = this.value">
                    <button id = "cardConfirm" onclick = "addBankCard()">Confirm</button>
                </div> 

        </div>
       
       
        `
 }

    