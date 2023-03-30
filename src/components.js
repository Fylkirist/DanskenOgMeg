function profileMenuComponent() {
    let html = `<div class="profileMenuContainer">
                <button class="dropdownKnapp" onclick="toggleProfileMenuDropDown()"><h2>Meny</h2></button>` 
    if(!model.inputs.profileMenuShowing){return html}
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
                <div onclick="changeView('myProfilePage')">Min Profil</div>
                 <div onclick="changeView('inboxPage')">Innbox</div>
                 <div onclick="changeView('filteredPage')">Alle produkter</div>
                 <div onclick="changeView('saleHistoryPage')">Salgshistorikk</div>
                 <div onclick="changeView('auctionPage')">Bud</div>
                 <div onclick="changeView('newProductPage')>Legg til produkt</div>
                 <div onclick="changeView('manageMembersPage')>Medlemmer</div>
                 <div onclick="logout()">Logg ut</div>
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
    model.inputs.shoppingCart.totalPrice = 0;
    if(model.app.loggedInStatus){
        for(item in model.data.users[model.app.userId].shoppingCart){
            console.log(model.data.users[model.app.userId].shoppingCart[item])
            html += `
            <div>
                <img src = "${model.data.items[eval(model.data.users[model.app.userId].shoppingCart[item].item)-1].images[0]}"/>
                <span>${model.data.items[eval(model.data.users[model.app.userId].shoppingCart[item].item)-1].title}</span>
                <button onclick = "removeFromUserShoppingCart(${item})">X</button>
                <span>${model.data.items[eval(model.data.users[model.app.userId].shoppingCart[item].item)-1].price}</span>
                <span>x${model.data.users[model.app.userId].shoppingCart[item].quantity}</span>
            </div>
            `
            model.inputs.shoppingCart.totalPrice += model.data.items[eval(model.data.users[model.app.userId].shoppingCart[item].item)-1].price * model.data.users[model.app.userId].shoppingCart[item].quantity
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
            <input type="text" oninput="model.inputs.search.input = this.value" onchange="doSearch()">
            <button onclick="doSearch()">Søk</button>
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
            <button onclick = "goToProduct(${item})">Gå til auksjon</button>
        `
    }
    else{
        varElems = `
            <label>Pris: </label>
            <label>${model.data.items[item].price}</label>
            <button onclick = "addToShoppingCart('${model.data.items[item].id}')">Legg til i handlekurv</button>
            <button onclick = "goToProduct(${item})">Gå til produktside</button>
        `  
    }
    return `
        <div>
            <img src = "${model.data.items[item].images[0]}"/>
            <h4>${model.data.items[item].title}</h4>
            <p>${model.data.items[item].description}</p>
            ${varElems}    
        </div>` 
}

function createHeaderSection(){
    return /*html*/`
    <div class="headerContainer">
        <h1 class="overskrift" onclick = "toToFrontPage()">Dansken og meg</h1>
        ${profileMenuComponent()}
        ${!model.app.loggedInStatus ? `<div class="registerButton" onclick="goToRegisterPage()">Registrer</div>
        <div class="loginButton" onclick="loginDropDown()">Login</div>` :
        `<div class="userButton" onclick="">${model.data.users[model.app.userId].username}</div>`}
        <div class="cartIcon" onclick="goToShoppingCart()">🛒</div>
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

