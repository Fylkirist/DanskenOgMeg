
function createPageFooter(){
    let chatBox = `
        <div id = "chatBoxWindow">
            <div id = "chatBox">
                ${model.app.loggedInStatus?
                    generateMessageElements()
                :`
                    <div class = "adminChatElem">
                        Hei og velkommen til Dansken&meg! Om du har spørsmål til oss, logg inn og spør oss her.
                    </div>
                `}
            </div>
            <div>
                ${model.app.loggedInStatus?`
                    <div>
                        <input id = "chatBoxMessageInput" type = "text" oninput = "model.inputs.chatBox.message = this.value" value = "model.inputs.chatBox.message"/>
                        <button id = "chatBoxSendMessage" onclick = "sendMessage()">Send melding</button>
                    </div>
                `:`
                    <div>
                        <div id = "chatBoxRegisterButton" onclick = "changeView('registerPage')">Registrer</div>
                        <div id = "chatBoxLoginButton" onclick = "changeView('loginPage')">Logg inn</div>
                    </div>
                `}
            </div>
        </div>
    ` 
    return`
        <div id = "pageFooterContainer">
            <div id = "pageSloganContainer">
            </div>
            <div id = "chatBoxContainer">
                ${model.app.showChatBox?chatBox:``}
                <div id = "chatBoxButton" onclick = "toggleChatBox()">
                </div>
            </div>
        </div>
    `
}

function profileMenuComponent() {
    let html = `<div class="profileMenuContainer" onmouseleave = "retractDropDown()">
                <button class="dropdownKnapp" onclick="toggleProfileMenuDropDown()"><h2>Meny</h2></button>` 
    if(!model.inputs.profileMenuShowing){return html+`</div>`}
    if (!model.app.loggedInStatus) {
        html += `
        <div id="dropdownContent">
            <div onclick="changeView('filteredPage')">Alle produkter</div>
            <div onclick="loginDropDown()">Logg inn</div>
        </div>` 
    }
    else if (model.data.users[model.app.userId].permissions === 'user') {
        html += `
        <div id="dropdownContent">
                <div onclick="changeView('myProfilePage')">Min Profil</div>
                <div onclick="changeView('inboxPage')">Inbox</div>
                <div onclick="changeView('filteredPage')">Alle produkter</div>
                <div onclick="changeView('saleHistoryPage')">Salgshistorikk</div>
                <div onclick="changeView('auctionPage')">Bud</div>
                <div onclick="logout()">Logg ut</div>
        </div>`
    }

    if (model.data.users[model.app.userId] && model.data.users[model.app.userId].permissions === "admin") {
        html += `
        <div id="dropdownContent">
                <div class="dropdownContent-1" onclick="changeView('myProfilePage')">Min Profil</div>
                <div class="dropdownContent-line"> </div>
                <div class="dropdownContent-1" onclick="changeView('inboxPage')">Innbox</div>
                <div class="dropdownContent-line"> </div>
                <div class="dropdownContent-1" onclick="changeView('filteredPage')">Alle produkter</div>
                <div class="dropdownContent-line"> </div>
                <div class="dropdownContent-1" onclick="changeView('saleHistoryPage')">Salgshistorikk</div>
                <div class="dropdownContent-line"> </div>
                <div class="dropdownContent-1" onclick="changeView('auctionPage')">Bud</div>
                <div class="dropdownContent-line"> </div>
                <div class="dropdownContent-1" onclick="changeView('newProductPage')>Legg til produkt</div>
                <div class="dropdownContent-line"> </div>
                <div class="dropdownContent-1" onclick="changeView('manageMembersPage')>Medlemmer</div>
                <div class="dropdownContent-line"> </div>
                <div class="dropdownContent-1" onclick="changeView('createProduct')>Legg til nytt produkt</div>
                <div class="dropdownContent-line"> </div>
                <div onclick="logout()">Logg ut</div>
                <div class="dropdownContent-line"> </div>
        </div>`
    }
    return html += `</div>`
}

function showShoppingCart(){
    let html= '';
    html = /*html*/`
        <div class="handlevognContainer">
            <div>
                <div class="handlevognHeader">Handlevogn</div>
                <p>Varer du kan kjøpe nå -</p><span onclick="clearShoppingCart()"></span>
                <div class="horizontalLines">
                    <span>Pris</span>
                </div>
                <div class="allItemsCanBuy">
                ${showItemsCanBuyNow()}
                </div>
                <div class="totalPrice">
                    <span>Total</span>
                    <span>${model.inputs.shoppingCart.totalPrice}</span>
                    <button onclick="changeView('checkoutPage')">Gå til kassen</button>

                </div>
                ${model.app.loggedInStatus ? `
                    <h3>Auksjoner du har bud på:</h3>
                    <div>
                        <span>Vinnene bud</span>
                    </div>
                    <div>${showWinningBids()}</div>
                    <div>
                        <span>Tapende bud</span>
                    </div>
                    <div>${showLosingBids()}</div>` 
                : ''}
            </div>
        </div>`;
    return html;
}

function showItemsCanBuyNow(){
    let html = '';
    console.log("bruh")
    model.inputs.shoppingCart.totalPrice = 0;
    if (model.inputs.shoppingCart.items.canBuyNow.length == 0) {
        html = 'You do not have any items in the shopping cart.';
    }
    if(model.app.loggedInStatus){
        for(let i = 0; i<model.data.users[model.app.userId].shoppingCart.length;i++){
            html += `
            <div>
                <img src = "${model.data.items[eval(model.data.users[model.app.userId].shoppingCart[i].item)-1].images[0]}"/>
                <span>${model.data.items[eval(model.data.users[model.app.userId].shoppingCart[i].item)-1].title}</span>
                <button onclick = "removeFromUserShoppingCart(${i})">X</button>
                <span>${model.data.items[eval(model.data.users[model.app.userId].shoppingCart[i].item)-1].price}</span>
                <span>x${model.data.users[model.app.userId].shoppingCart[i].quantity}</span>
            </div>
            `
            model.inputs.shoppingCart.totalPrice += model.data.items[eval(model.data.users[model.app.userId].shoppingCart[i].item)-1].price * model.data.users[model.app.userId].shoppingCart[i].quantity
        }
    }
    else{
        for(let j = 0; j < model.inputs.shoppingCart.items.canBuyNow.length; j++){
            for(let i = 0; i < model.data.items.length; i++){
                
                if(model.inputs.shoppingCart.items.canBuyNow[j].id === model.data.items[i].id){
                    html += `
                    <div>
                        <img src="${model.data.items[i].images[0]}" />
                        <span>${model.data.items[i].title}</span>
                        <button onclick="deleteItemFromShoppingCart(${j})">X</button>
                        <span>${model.data.items[i].price}</span>
                    </div>`;
                    
                    model.inputs.shoppingCart.totalPrice += model.data.items[i].price;
                }
            }
        }
    }
    return html;   
}

function showWinningBids(){
    let html='';

    findWinningBids();

    if(model.inputs.shoppingCart.items.auctions.usersWinningBids.length == 0) return '';

    else {
        html += `<div>`;
        for (let i = 0; i < model.inputs.shoppingCart.items.auctions.usersWinningBids.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id === model.data.items[j].id){
                    html += `
                            <img src="${model.data.items[j].images[0]}" />
                            <span>${model.data.items[j].title}</span>
                            ${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].deleted ? 'Du trukket bud.' : `
                                <button onclick="if(confirm('Are you sure?')) trekkBud(${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id}, 
                                                        ${model.app.userId})"
                                >Trekk bud</button>
                                <span>Bud: ${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid}</span>
                                <span>Stenges om : ${calculateDeadline(model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id)}</span>
                                <input  type="number" 
                                        min="${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid}" 
                                        step= 100
                                        value="${model.inputs.shoppingCart.items.auctions.increasedWinningBid || ''}" 
                                        
                                        onchange="model.inputs.shoppingCart.items.auctions.increasedWinningBid = this.value, updateView()"
                                />
                                <button
                                    ${model.inputs.shoppingCart.items.auctions.increasedWinningBid > model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid ? '' : 'disabled'}
                                    onclick="increaseBid(${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id}, ${model.app.userId}, ${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid}, ${model.inputs.shoppingCart.items.auctions.increasedWinningBid})"
                                >Øk bud</button>
                            `}
                        </div>
                        `;
                }
            }
        }
        return html;
    }
}
function showLosingBids(){
    let html='';
    findWinningBids();
    if(model.inputs.shoppingCart.items.auctions.usersLosingBids.length == 0) return '';
    else {
        html += `<div>`;
        for (let i = 0; i < model.inputs.shoppingCart.items.auctions.usersLosingBids.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id === model.data.items[j].id){
                    html += `
                            <img src="${model.data.items[j].images[0]}" />
                            <span>${model.data.items[j].title}</span>
                            ${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].deleted ? 'Du trukket bud.' : `
                                <button onclick="if(confirm('Are you sure?')) trekkBud(${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id}, 
                                                        ${model.app.userId})"
                                >Trekk bud</button>
                                <span>Nåværende bud: ${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid}</span>
                                <span>Stenges om : ${calculateDeadline(model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id)}</span>
                                <input  type="number" 
                                        min="${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid}" 
                                        step= 100
                                        value="${model.inputs.shoppingCart.items.auctions.increasedWinningBid || ''}" 
                                        
                                        onchange="model.inputs.shoppingCart.items.auctions.increasedWinningBid = this.value, updateView()"
                                />
                                <button
                                    ${model.inputs.shoppingCart.items.auctions.increasedWinningBid > model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid ? '' : 'disabled'}
                                    onclick="increaseBid(${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id}, ${model.app.userId}, ${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid}, ${model.inputs.shoppingCart.items.auctions.increasedWinningBid})"
                                >Øk bud</button>
                            `}
                        </div>
                        `;
                }
            }
        }
        return html;
    }
}

function calculateDeadline(itemsId){
    let setDeadline;
    let html = '';
    for (let item of model.data.items){
        if(item.id == itemsId){
            setDeadline = item.deadline;
        }
    }
    let miliSecondsRemaining = parseInt(new Date(setDeadline) - new Date());
    let daysRemaining = parseInt(miliSecondsRemaining/(1000*60*60*24));
    let hoursRemaining = parseInt(((miliSecondsRemaining/(1000*60*60*24)) - daysRemaining) * 24);
    let minutesRemaining = parseInt(((((miliSecondsRemaining/(1000*60*60*24)) - daysRemaining) * 24) - hoursRemaining) * 60);
    let secondsRemaining = parseInt(((((((miliSecondsRemaining/(1000*60*60*24)) - daysRemaining) * 24) - hoursRemaining) * 60) - minutesRemaining) * 60);

    if (miliSecondsRemaining > 1000){
        html = `
                ${daysRemaining} dager og ${hoursRemaining} timer og ${minutesRemaining} minutter.
             `;
    }
    else {
        html = 'Bud er stengt.'
    }
    return html;
}

function registerFormView() {
    let container = /*html */`
      <div class="form-container">
        <div class="form-group">
          <input type="text" placeholder="First Name" oninput="model.inputs.register.firstName = this.value;">
          <input type="text" placeholder="Last Name" oninput="model.inputs.register.lastName = this.value;">
        </div>
        <div class="form-group">
          <input type="email" placeholder="Email" oninput="model.inputs.register.email = this.value;">
          <input type="tel" placeholder="Telefon Nr:" oninput="model.inputs.register.mobile = this.value;">
        </div>
        <div class="form-group">
          <input type="text" placeholder="Brukernavn:" oninput="model.inputs.register.userName = this.value;">
          <input type="password" placeholder="Passord:" oninput="model.inputs.register.password = this.value;">
          <input type="password" placeholder="Gjenta Passord:" oninput="model.inputs.register.repeatPassword = this.value;">
        </div>
        <div class="form-group">
          <input type="text" placeholder="Adresse:" oninput="model.inputs.register.address = this.value;">
          <input type="text" placeholder="Post nummer:" oninput="model.inputs.register.zip = this.value;">
          <input type="text" placeholder="By:" oninput="model.inputs.register.city = this.value;">
        </div>
        <div class="form-group">
          <input type="text" placeholder="Card info" onchange="model.inputs.register.cardNumber = this.value; isValid(this)">
          <input type="date" oninput="model.inputs.register.fromDate = this.value;">
          <input type="text" placeholder="CVE" oninput="model.inputs.register.cve = this.value;">
        </div>
        <button onclick="goBackToFrontPage()">Tilbake</button>
        <button onclick="registerUser()">Register</button>
        <div>${model.inputs.register.meldingRegister}</div>
      </div>`;
    return container;
}

function showSearchBox() {
    return /*html*/ `
    <div class="searchContainer">
        <div class="searchBox">
            <input class="SearchBox-1" type="text" oninput="model.inputs.search.input = this.value" onchange="doSearch()">
            <button class="SearchBox-1"   onclick="doSearch()">Søk</button>
        </div>
    </div>
    `;
}

function frontPageProductView(){
    let topElem = generateFrontPageElement(model.data.frontPageTop[model.app.frontPageCurrentShowing.top])
    let botElem = generateFrontPageElement(model.data.frontPageBottom[model.app.frontPageCurrentShowing.bottom])
    return `
        <div id = "frontPageProductDisplay">
            <div class = "frontPageProductDisplayElement">
                <div onclick = "changeFrontPageTopProduct(-1)" class = "frontPageLeftArrow"></div>
                ${topElem}
                <div onclick = "changeFrontPageTopProduct(1)" class = "frontPageRightArrow"></div>
            </div>
            <div class = "frontPageProductDisplayElement">
                <div onclick = "changeFrontPageBotProduct(-1)" class = "frontPageLeftArrow"></div>
                ${botElem}
                <div onclick = "changeFrontPageBotProduct(1)" class = "frontPageRightArrow"></div>
            </div>
        </div>
    ` 
}

function generateFrontPageElement(item){
    let varElems;
    if (model.data.items[item].auction){
        varElems = `
            <label class = "frontPagePriceDescLabel">Høyeste bud: </label>
            <label class = "frontPagePriceLabel">${model.data.items[item].price}</label>
            <button class = "frontPageGoToProductButton" onclick = "goToProduct(${item})">Gå til auksjon</button>
        `
    }
    else{
        varElems = `
            <label class = "frontPagePriceDescLabel">Pris: </label>
            <label class = "frontPagePriceLabel">${model.data.items[item].price}</label>
            ${model.app.loggedInStatus && model.data.users[model.app.userId].permissions == "admin"?``:`<button class = "frontPageAddProductButton" onclick = "addToShoppingCart('${model.data.items[item].id}')">Legg til i handlekurv</button>`}
            <button class = "frontPageGoToProductButton" onclick = "goToProduct(${item})">Gå til produktside</button>
        `  
    }
    return `
        <div class = "frontPageCenterElem">
            <img class = "frontPageProductImg" src = "${model.data.items[item].images[0]}"/>
            <label>⮜</label>
            <label>${model.data.items[item].images[0]}</label>
            <label>⮞</label>
            <h4 class = "frontPageProductHeader">${model.data.items[item].title}</h4>
            <p class = "frontPageProductDesc">${model.data.items[item].description}</p>
            ${varElems}    
        </div>` 
}

function createHeaderSection(){
    return /*html*/`
    <div class="headerSectionContainer">
        <h1 class="overskriftHeaderSection" onclick = "toToFrontPage()">Dansken og meg</h1>
        ${!model.app.loggedInStatus ? `<div class="registerButtonHeaderSection" onclick="goToRegisterPage()">Registrer</div>
        <div class="loginButtonHeaderSection" onclick="loginDropDown()">Login</div>` :
        `<div class="userButtonHeaderSection" onclick="">${model.data.users[model.app.userId].username}</div>`}
        ${!model.app.loggedInStatus || model.data.users[model.app.userId].permissions != "admin"? `<div class="cartIconHeaderSection" onclick="goToShoppingCart()">🛒</div>`:``}
        <h3 class="underskriftHeaderSection">VintageSkatter</h3>
        ${model.inputs.login.dropdown ? 
            `<input type="text" 
            class="userNameInputLoginDropdown" 
            onchange="model.inputs.login.username = this.value"
            value="${model.inputs.login.username}"
            required
            /> 
            <input type="password" 
                class="passwordInputLoginDropdown" 
                onchange="model.inputs.login.password = this.value"
                value="${model.inputs.login.password}"
                required
            /> 
            <div class="loginSubmitButtonLoginDropdown" onclick="checkUserIdPassword()">Submit</div>
            ${model.inputs.login.wrongUserNamePassword ? 
                    `<p class="wrongUserLoginDropdown">${model.app.wrongUserNamePasswordMessage}</p> 
                    <p class="forgotPasswordLoginDropdown">
                    <span onclick=""> Forgot password?</span> 
                    <span onclick=""> New user?</span>
                    </p>` 
                    : ''}` 
            : ''}
    </div>`;
}

function createSaleView(){
    let categoryList ="";
    let id = (model.data.items.length+1).toString()
    while (id.length<7){
        id = "0" + id
    }
    model.inputs.createSale.newId = id
    for( let i = 0; i<model.inputs.createSale.categoryList.length; i++){
        categoryList += ` <li>${model.inputs.createSale.categoryList[i]}<button onclick = "deleteCategory(${i})">X</button></li>`
    }
    return /*html*/ ` 
        <div class = "CreateSaleContainer">
            <div class = "createProductTopOfPage">
                <input id = "productName" type = "text" placeholder = "Produkt Navn" value = "${model.inputs.createSale.title}"  oninput = "model.inputs.createSale.title = this.value"/>
                <label id = "productId">Produkt ID: ${model.inputs.createSale.newId}</label>
                <input id = "priceInput" type = "text" placeholder = "Pris" value = "${model.inputs.createSale.price}" oninput = "model.inputs.createSale.price = this.value">
            </div>
            <input id = "productDescription" type = "text" placeholder = "Beskrivelse" value = "${model.inputs.createSale.description}" oninput = "model.inputs.createSale.description = this.value"/>
            <div id = "categoryListContainer">
                <ul>${categoryList}</ul>
            </div>
            <div class = "categoryCreateContainer">
                <input id = "categoryMain" type = "text" placeholder = "Hovedkategori" oninput = "model.inputs.createSale.mainCategory = this.value" value = "${model.inputs.createSale.mainCategory}">
                <button id = "mainCategoryAdd" onclick = "addMainCategory()">"Sett hovedkategori"</button>
                <input id = "categorySub" type = "text" value = "${model.inputs.createSale.subCategory}" oninput = "model.inputs.createSale.subCategory = this.value" placeholder = "Underkategori"/>
                <button id = "subCategoryAdd" onclick = "addSubCategory()">Legg til underkategori</button>
            </div>
            <div id = "galleryFrame">Bildegalleri
                <input value = "${model.inputs.createSale.addImage}" oninput = "uploadImg(event)" type = "file" id = "galleryInput">
                <button id = "addImageButton" onclick = "insertImage()">"Legg til bilde"</button>
                ${model.inputs.createSale.images.map(img => `<img class = "newProductImageGalleryElement" src = "${img}"></img>`).join('')}
            </div>
                <input id = "mainPicture" type = "file" value = "${model.inputs.createSale.mainImage}" oninput = "uploadImg(event)">
            <div class = "checkBoxesCreate">
                <label id = "aucionLabel">Auksjon: </label>
                <input type = "checkbox" id = "auctionBox" ${model.inputs.createSale.auction? 'checked':''} onchange = "model.inputs.createSale.auction = !model.inputs.createSale.auction"/>
                <label id = "deadlineLabel">Budfrist</label>
                <input id = "deadlineInput" type = "datetime-local" value = "${model.inputs.createSale.deadline}" oninput = "model.inputs.createSale.deadline = this.value">
                <input id = "minimumBidInput" type = "text" placeholder = "Minste tillatte budøkning" value = "${model.inputs.createSale.minimumBidAmmount}" oninput = "model.inputs.createSale.minimumBidAmmount = this.value">
                <label id = "deliveryCheckBoxLabel" >Kan leveres:</label>
                <input id = "deliveryBox" type = "checkbox" ${model.inputs.createSale.deliver? "checked":""} onchange = "model.inputs.createSale.deliver = this.checked">
            </div>
            <button id = "saveButton" onclick = "createProduct()">Lagre produkt</button>
        </div>` 
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
        </div>`;
    }
    else{
        return ``
    }
}

function orderHistoryView (){
    let html = ``
    if(model.data.users[model.app.userId].permissions === "admin"){
        for(let i = 0; i < model.data.orderHistory.length; i++){
        /*html*/
            html+= `<div>
                <div id = "itemID">Item ID: ${model.data.orderHistory[i].itemId}</div>
                <div id = "staus">Betalt: ${model.data.orderHistory[i].paid}</div>
                <div id = "pris">Pris: ${model.data.orderHistory[i].price}</div>
                <div id = "date">Dato: ${model.data.orderHistory[i].date}</div>
                <div id = "type">Type: ${model.data.orderHistory[i].type}</div>
                <div id = "userId">Kjøper : ${model.data.orderHistory[i].userId} 
                Fornavn: ${model.data.users[model.data.orderHistory[i].userId].firstname}
                Etternavn: ${model.data.users[model.data.orderHistory[i].userId].surname} </div>
            </div>`
            }
            }
        else {
            for(let i = 0; i<model.data.orderHistory.length; i++){
                if(model.app.userId === model.data.orderHistory.userId ){
                        
                 /*html*/
                    html+=`<ul>
                        <div id = "title">Produkt Navn: ${model.data.orderHistory[i].title}</div>
                        <img id = "itemImage" src = ${model.data.orderHistory[i].image}>
                        <div id = "type">Type: ${model.data.orderHistory[i].type}</div>
                        <div id = "date">Dato: ${model.data.orderHistory[i].date}</div>
                        <div id = "pris">Pris: ${model.data.orderHistory[i].price}</div>
                    </ul>`
                }
            } 
        }
        return /*html*/ `
            <div id = "mainOrderHistoryDiv">
                <h1 id = "topText">Orderhistorikk</h1>
                <div class = "OrderHistoryContainer">
                    ${html}
                </div>
            </div>`
}

function productDisplay(product){
    let content;
    let images = `` 
    if(model.data.items[product].auction){
        content = `
            <label class = "productDisplayPriceLabel">Nåværende Bud: </label>
            <label class = "productDisplayPrice">${model.data.items[product].price}</label>
            <input id = "productDisplayPriceInput" oninput="model.input.product.bidIncrease = this.value">${model.inputs.product.bidIncrease}</input>
            <button class = "productDisplayBuyButton" onclick = "raiseBid('${model.data.items[product].id}')">Øk bud</button>
            <div id = "productDisplayDeadline">Auksjonen stenges om: ${model.data.items[product].deadline}</div>`
    }
    else{
        content = `
            <label class = "productDisplayPriceLabel">Pris: </label>
            <label class = "productDisplayPrice">${model.data.items[product].price}</label>
            <button class = "productDisplayBuyButton" onclick = "addToShoppingCart('${model.data.items[product].id}')">Legg til i handlekurv</button>
        `
    }
    for(let i = 1; i<model.data.items[product].images.length;i++){
        images += `<img class = "productDisplayGalleryImage" src = "${model.data.items[product].images[i]}"></img>`
    }      
    return `
    <div class = "productDisplayContainer">
        ${showZoomedPic()}
        <div class = "productDisplayTitle">${model.data.items[product].title}</div>
        <div class = "productDisplayDescriptionContainer">
            <img class = "productDisplayImage" src = "${model.data.items[product].images[0]}" onclick = "blowUpGalleryImg(0)"></img>
            <h1 class = "productDisplayDescriptionTitle">Beskrivelse</h1>
            <p class = "productDisplayDescription">${model.data.items[product].description}</p>
            ${content}
        </div>
        ${model.app.loggedInStatus && model.data.users[model.app.userId].permissions == "admin"?
            showAdminProductComponent(product):
            ``
        }
        <div id = "productDisplayImageGalleryContainer">
            ${images}	
        </div>
    </div>`
}

function showAdminProductComponent(product){
    return `
        <div id = "adminProductComponent">
            <div id = "adminProductId">${model.data.items[product].id}</div>
            <label>Auksjonsvare: </label>
            <input type = "checkbox" onchange = ""/>
            <div>
                <input type = "datetime-local" value = "${model.data.items[product].deadline}"/>
                <button onclick = "">Oppdater frist</button>
            </div>
            <div>
                ${model.data.items[product].auction?
                    `<input type = "text" oninput = "model.inputs.product.adminBidIncrease = this.value" value = "${model.data.items[product].minBid}"/><button onclick = "changeMinimumBid(${product})">Endre minimumbudøkning</button>`:
                    `<input type = "text" oninput = "model.inputs.product.adminPriceChange = this.value" value = "${model.data.items[product].price}"/><button onclick = "changePrice(${product})">Endre pris</button>`
                }
            </div>
            <div>
                <div>
                    ${populateCategoryList(product)}
                </div>
                <label>Endre hovedkategori: </label>
                <input oninput = "model.inputs.product.adminChangeMainCategory = this.value" type = "text"/>
                <button onclick = "changeMainCategory(${product})">Endre</button>
                <label>Legg til underkategori: </label>
                <input oninput = "model.inputs.product.adminAddSubCategory = this.value" type = "text"/>
                <button onclick = "addNewSubCategory(${product})">Legg til</button>
            </div>
        </div>` 
}

function populateCategoryList(id){
    let list = ``
    for(let i = 0; i < model.data.items[id].category.length; i++){
        list += `
            <div>
                <label>${model.data.items[id].category[i]}</label>
                ${i == 0?
                    `   Hovedkategori`:
                    `<button onclick = "removeCategory(${id},${i})">X</button>`
                }
            </div>` 
    }
    return list
}

function generateMessageElements(){ 
    return model.data.users[model.app.userId].messages.map(item => {
        return `<div class = "${item.type}ChatElem">${item.type == "admin"?"Dansken&Meg":model.data.users[model.app.userId].firstName}: ${item.message}</div>`
    }).join('')
}

function createLoginPage(){
    return `
        <div id = "loginPageContainer">
            <div id = "loginPageElement">
                <div id = "loginPageLogo" onclick = "toToFrontPage()">Dansken&meg</div>
                <label id = "loginPageUserLabel">Brukernavn</label>
                <input oninput = "model.inputs.login.username = this.value" type = "text"/>
                <label id = "loginPagePassLabel">Passord</label>
                <input oninput = "model.inputs.login.password = this.value" type = "text"/>
                <button onclick = "checkUserIdPassword()">Logg inn</button>
                <button onclick = "changeView('registerPage')">Registrer</button>
            </div>
        </div>
    ` 
}

function showFilteredProducts(){
    model.inputs.category.filteredItems = filterItems()
    let productList = ``
    for(let i = 0; i<model.inputs.category.filteredItems.length;i++){
        productList += `
            <div class = "filteredProductContainer">
                <img src = "${model.data.items[model.inputs.category.filteredItems[i]-1].images[0]}"/>
                <div>
                    <h3>${model.data.items[model.inputs.category.filteredItems[i]-1].title}</h3>
                    <br>
                    <p>${model.data.items[model.inputs.category.filteredItems[i]-1].description}</p>
                    <br>
                    <div>
                        <label>${model.data.items[model.inputs.category.filteredItems[i]-1].price},-</label>
                        ${model.data.items[model.inputs.category.filteredItems[i]-1].auction || model.app.loggedInStatus && model.data.users[model.app.userId].permissions == "admin"?``:`<button onclick = "addToShoppingCart('${model.data.items[model.inputs.category.filteredItems[i]-1].id}')">Legg til I handlekurv</button>`}
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


function showFilterBox(){
    let priceLimits = determinePriceLimits()
    return `
        <div id="ShowFilterBoxContainer>
            <h3 class=">Kategorier</h3>
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
                <input type = "text" value = "${priceLimits.min}">
                <input type = "text" onchange = "changePriceLevels(this.value)" value = "${model.inputs.category.priceRange.max}"></input>
            </div>
        </div>`
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
                </div>`
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
                <img src = "${model.data.items[model.inputs.category.filteredItems[i]-1].images[0]}"/>
                <div>
                    <h3>${model.data.items[model.inputs.category.filteredItems[i]-1].title}</h3>
                    <br>
                    <p>${model.data.items[model.inputs.category.filteredItems[i]-1].description}</p>
                    <br>
                    <div>
                        <label>${model.data.items[model.inputs.category.filteredItems[i]-1].price},-</label>
                        ${!model.data.items[model.inputs.category.filteredItems[i]-1].auction?`<button onclick = "addToShoppingCart('${model.data.items[model.inputs.category.filteredItems[i]-1].id}')">Legg til I handlekurv</button>`:""}
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
    setUserInputs()
      return  /*html*/ ` 
       <div class = "containerDiv">
            <div id = "persoinalInfo">
                <div id = firstLast>
                    <input id ="firstNameChangeBox" type = "text" placeholder = "Fornavn"
                        value  = "${model.data.users[model.app.userId].firstName}" oninput = "model.inputs.register.firstName = this.value">
                    <input id ="lastNameChangeBox" type = "text" placeholder = "Etternavn"
                        value = "${model.data.users[model.app.userId].surName}" oninput = "model.inputs.register.lastName = this.value">
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
                        <div>
                            Kortnummer: ${payment.cardNumber}<br>
                            Utløpsdato: ${payment.expirationDate}<br>
                            Kortholders fornavn: ${payment.cardHolderFirstName}<br>
                            Kortholders etternavn: ${payment.cardHolderLastName}<br>
                            By: ${payment.city}<br>
                            Adresse: ${payment.address}<br>
                            Postnummer: ${payment.zip}<br>
                            <button onclick = deleteCard(${i})>Slett Kort</button>
                        </div>
                    `).join('')}
                </ul>
            </div>
            <div id = "cardAddBox">
                    <input id = "cardNumber" placeholder = "Kort Nummer"
                         oninput = "model.inputs.register.cardNumber = this.value">
                    <input id = "expirationDate" placeholder = "Utløps Dato" type = "date"
                         oninput = "model.inputs.register.toDate = this.value">
                    <input id = "cvc" placeholder ="CVC"
                         oninput = "model.inputs.register.cvc = this.value">
                    <input id = "cardFirstName" placeholder = "Fornavn"
                         oninput = "model.inputs.register.cardFirstName = this.value">
                    <input id = "cardLastName" placeholder = "Etternavn"
                         oninput = "model.inputs.register.cardLastName = this.value">
                    <input id ="cardCityNameChangeBox"  placeholder = "By"
                         oninput = "model.inputs.register.cardCity = this.value">
                    <input id ="cardAdressNameChangeBox"  placeholder = "Adresse"
                         oninput = "model.inputs.register.cardAddress = this.value">
                    <input id ="CardZipCode"  placeholder = "Postkode"
                         oninput = "model.inputs.register.cardZip = this.value">
                    <button id = "cardConfirm" onclick = "addBankCard()">Confirm</button>
                </div>
        </div>
        `
 }

// New components functions


function checkOut(){
    let html = '';
    if(model.app.userId == '0000001') return '';
    html = /*html*/
            `
                <div class= "checkOutComponentContainer">
                    <div class="checkOutLeftSideContainer">
                        ${model.inputs.checkOutPage.emptyShoppingCart ? 
                            '' :
                            `
                                <div class="checkOutAddress">
                                    <p>Hvem skal orden sendes til?</p>
                                    ${model.app.loggedInStatus ? 
                                        '' : 
                                        '<p><span onclick="loginDropDown()">Logg inn </span>eller fortsett under. Du kan opprette en konto etter at du har betalt.</p>'
                                    }
                                    <p>Fornavn: <input type="text" value="${model.inputs.checkOutPage.firstName}" onchange="model.inputs.checkOutPage.firstName = this.value, updateView()"/></p>
                                    <p>Etternavn: <input type="text" value="${model.inputs.checkOutPage.lastName}" onchange="model.inputs.checkOutPage.lastName = this.value, updateView()"/></p>
                                    <p>Addresse: <input type="text" value="${model.inputs.checkOutPage.address}" onchange="model.inputs.checkOutPage.address = this.value, updateView()"/></p>
                                    <p>Zip: <input type="text" value="${model.inputs.checkOutPage.zipCode}" onchange="model.inputs.checkOutPage.zipCode = this.value, updateView()"/></p>
                                    <p>E-post: <input type="text" value="${model.inputs.checkOutPage.email}" onchange="checkValidityOfEmail(this.value)"/></p>
                                    ${model.app.checkOut.invalidEmailOnCheckOutPage ? '<p style="color: red;">Invalid E-post</p>' : ''}
                                    <p>Mobil: <input type="text" value="${model.inputs.checkOutPage.mobile}" onchange="model.inputs.checkOutPage.mobile = this.value, updateView()"/></p>
                                    ${!model.inputs.checkOutPage.firstName ||
                                    !model.inputs.checkOutPage.lastName ||
                                    !model.inputs.checkOutPage.address ||
                                    !model.inputs.checkOutPage.zipCode ||
                                    !model.inputs.checkOutPage.email ||
                                    model.app.checkOut.invalidEmailOnCheckOutPage ||
                                    !model.inputs.checkOutPage.mobile ?
                                        '<p style="color: red;">Fyll ut alle feltene.</p>' :
                                        `<button onclick="model.inputs.checkOutPage.addressFilled = true, updateView()">Fortsett</button>`
                                    }
                                </div>
                                ${model.inputs.checkOutPage.addressFilled ?
                                    `
                                        <div class="checkOutDeliveryMethod">
                                                <p>Velg en leveringsmetode:</p>
                                                <form>
                                                <input type="checkbox" id="deliveryOption1" name="deliveryOption1" value="1" onchange= "setDeliveryMethod(this.value)" ${model.inputs.checkOutPage.deliveryMethod.butikk}/>
                                                <label for="deliveryOption1">Hent i butikk - Gratis</label><br>
                                                <input type="checkbox" id="deliveryOption2" name="deliveryOption2" value="2" onchange= "setDeliveryMethod(this.value)" ${model.inputs.checkOutPage.deliveryMethod.leveringMedInnbæring}/>
                                                <label for="deliveryOption2">Levering med innbæring - 400kr</label><br>  
                                                <input type="checkbox" id="deliveryOption3" name="deliveryOption3" value="3" onchange= "setDeliveryMethod(this.value)" ${model.inputs.checkOutPage.deliveryMethod.leveringUtenInnbæring}/>
                                                <label for="deliveryOption3">Levering uten innbæring - 200kr</label><br>
                                                </form>
                                                ${model.inputs.checkOutPage.selectedDeliveryMethod ?
                                                    `<button onclick="model.inputs.checkOutPage.deliveryMethod.selected = true, updateView()">Fortsett</button>` :
                                                    ''  
                                                }
                                        </div> 
                                    `:
                                    ''
                                }
                                ${model.inputs.checkOutPage.deliveryMethod.selected ?
                                    `
                                        <div class="checkOutPaymentMethod">
                                            ${model.app.loggedInStatus ? 
                                                selectCard() : 
                                                `<p>Card Number: <input type="text" value="${model.inputs.checkOutPage.cardNumber}" onchange="model.inputs.checkOutPage.cardNumber = this.value, updateView()"/></p>
                                                <p>Expiration Date: <input type="text" value="${model.inputs.checkOutPage.expirationDate}" onchange="model.inputs.checkOutPage.expirationDate = this.value, updateView()"/></p>
                                                <p>cvc: <input type="text" value="${model.inputs.checkOutPage.cvc}" onchange="model.inputs.checkOutPage.cvc = this.value, updateView()"/></p>
                                                <p>Card Holders First Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderFirstName}" onchange="model.inputs.checkOutPage.cardHolderFirstName = this.value, updateView()"/></p>
                                                <p>Card Holders Last Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderLastName}" onchange="model.inputs.checkOutPage.cardHolderLastName = this.value, updateView()"/></p>
                                                `
                                            }
                                        </div>
                                    `: 
                                    ''
                                }
                                ${!model.inputs.checkOutPage.cardNumber ||
                                !model.inputs.checkOutPage.expirationDate ||
                                !model.inputs.checkOutPage.cvc ||
                                !model.inputs.checkOutPage.cardHolderFirstName ||
                                !model.inputs.checkOutPage.cardHolderLastName ?
                                        '' :
                                        '<button>Betal</button>'
                                }
                            `
                        }
                    </div>
                    <div class="checkOutRightSideContainer">
                        ${model.inputs.checkOutPage.emptyShoppingCart ? 
                            '<p>Du har ingenting i handlevogn.</p>' :
                            betalingsOversikt()
                        } 
                    </div>
                </div>
            `;

    return html;
}
function selectCard(){
    let html= '';
    if (model.data.users[model.app.userId].paymentInformation[0].cardNumber.length < 1){
        html = `
            <p>Card Number: <input type="text" value="${model.inputs.checkOutPage.cardNumber}" onchange="model.inputs.checkOutPage.cardNumber = this.value, updateView()"/></p>
            <p>Expiration Date: <input type="text" value="${model.inputs.checkOutPage.expirationDate}" onchange="model.inputs.checkOutPage.expirationDate = this.value, updateView()"/></p>
            <p>cvc: <input type="text" value="${model.inputs.checkOutPage.cvc}" onchange="model.inputs.checkOutPage.cvc = this.value, updateView()"/></p>
            <p>Card Holders First Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderFirstName}" onchange="model.inputs.checkOutPage.cardHolderFirstName = this.value, updateView()"/></p>
            <p>Card Holders Last Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderLastName}" onchange="model.inputs.checkOutPage.cardHolderLastName = this.value, updateView()"/></p>
        `;
    }
    else {
        html = '<p>Velg kort:</p>';
        if(!model.inputs.checkOutPage.addNewCard){
            for(let i = 0; i < model.data.users[model.app.userId].paymentInformation.length; i++){
                let lastFourDigitOfCard = parseInt(model.data.users[model.app.userId].paymentInformation[i].cardNumber.split('').splice(8,4).join(''));
                html += `
                    <div onclick="cardSelected(${i})">
                        <p>Kort Nummer: ****-****-${lastFourDigitOfCard}
                        ${checkCardValidTil(i)}
                    </div>
                `;
            }
        }
        html += `<button onclick="addNewCardInCheckOut()">Legg til nytt kort</button>`;
        if(model.inputs.checkOutPage.addNewCard){
            html += `
                    <p>Card Number: <input type="text" value="${model.inputs.checkOutPage.cardNumber}" onchange="model.inputs.checkOutPage.cardNumber = this.value, updateView()"/></p>
                    <p>Expiration Date: <input type="text" value="${model.inputs.checkOutPage.expirationDate}" onchange="model.inputs.checkOutPage.expirationDate = this.value, updateView()"/></p>
                    <p>cvc: <input type="text" value="${model.inputs.checkOutPage.cvc}" onchange="model.inputs.checkOutPage.cvc = this.value, updateView()"/></p>
                    <p>Card Holders First Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderFirstName}" onchange="model.inputs.checkOutPage.cardHolderFirstName = this.value, updateView()"/></p>
                    <p>Card Holders Last Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderLastName}" onchange="model.inputs.checkOutPage.cardHolderLastName = this.value, updateView()"/></p>
 
            `;
        }
    }
    return html;
}
function checkCardValidTil(cardIndex){
    let html='';
    let todaysDateArray = new Date().toISOString().substring(0,7).split('-');
    let cardValiditTil = model.data.users[model.app.userId].paymentInformation[cardIndex].expirationDate.split('/');
    if(parseInt(todaysDateArray[0].substring(2,2)) > parseInt(cardValiditTil[1]) ||
        (parseInt(todaysDateArray[0].substring(2,2)) == parseInt(cardValiditTil[1]) && parseInt(todaysDateArray[1]) > parseInt(cardValiditTil[0]))){
            html = '<p>Card is not valid</p>';
        }
    else {
        html = '<p>Card is valid</p>';
    }
    return html;
}
function betalingsOversikt(){
    let html = '<h3>Betalingsoversikt</h3>';
    model.inputs.checkOutPage.totalPrice = 0;
    if(model.app.loggedInStatus){
        for(let i = 0; i < model.data.users[model.app.userId].shoppingCart.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.data.users[model.app.userId].shoppingCart[i].item == model.data.items[j].id){
                    model.inputs.checkOutPage.totalPrice += (model.data.items[j].price * model.data.users[model.app.userId].shoppingCart[i].quantity);
                    html += `
                        <div>
                            <p>${model.data.items[j].title}</p>
                            <button onclick="increaseItemQuantity(${i})">+</button> ${model.data.users[model.app.userId].shoppingCart[i].quantity} <button onclick="decreaseItemQuantity(${i})">-</button>
                            <p>${model.data.items[j].price * model.data.users[model.app.userId].shoppingCart[i].quantity}</p>
                        </div>
                    `;
                }
            }
        }
        html += `
                <div>
                    <div>
                        <p>Frakt - </p>
                        <p>${model.inputs.checkOutPage.frakt}</p>
                    </div>
                    <div>
                        <p>Total moms</p>
                        <p>${model.inputs.checkOutPage.totalPrice * 0.25}</p>
                    </div>
                    <div>
                        <p>Total Nok</p>
                        <p>${model.inputs.checkOutPage.totalPrice + (model.inputs.checkOutPage.totalPrice * 0.25) + model.inputs.checkOutPage.frakt}</p>
                    </div>
                </div>
                `;
        
    }
    else {
        for(let i = 0; i < model.inputs.shoppingCart.items.canBuyNow.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.inputs.shoppingCart.items.canBuyNow[i].id == model.data.items[j].id){
                    model.inputs.checkOutPage.totalPrice += (model.data.items[j].price * model.inputs.shoppingCart.items.canBuyNow[i].quantity);
                    html += `
                        <div>
                            <p>${model.data.items[j].title}</p>
                            <button onclick="increaseItemQuantity(${i})">+</button> ${model.inputs.shoppingCart.items.canBuyNow[i].quantity} <button onclick="decreaseItemQuantity(${i})">-</button>
                            <p>${model.data.items[j].price * model.inputs.shoppingCart.items.canBuyNow[i].quantity}</p>
                        </div>
                    `;
                }
            }
        }
         html += `
                <div>
                    <div>
                        <p>Frakt - </p>
                        <p>${model.inputs.checkOutPage.frakt}</p>
                    </div>
                    <div>
                        <p>Total moms</p>
                        <p>${model.inputs.checkOutPage.totalPrice * 0.25}</p>
                    </div>
                    <div>
                        <p>Total Nok</p>
                        <p>${model.inputs.checkOutPage.totalPrice + (model.inputs.checkOutPage.totalPrice * 0.25) + model.inputs.checkOutPage.frakt}</p>
                    </div>
                </div>
                `;
    }
    return html;
}
