const app = document.getElementById("app");
updateView();
function updateView(){
    app.innerHTML = "";
    switch(model.app.currentView){
        case "frontPage":
            app.innerHTML = createHeaderSection() + showFilterBox() + showAllProducts();
            break
        case "filteredPage":
            app.innerHTML = showFilterBox()
            break
        case "registerPage":
            app.innerHTML = '';
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



function productDisplay(product){
    return `
    <div>
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


function createHeaderSection(){
    let html = '';
    html = /*html*/`
            <div class="headerContainer">
                <h1 class="overskrift">Dansken og meg</h1>
                ${!model.app.loggedInStatus ? `<div class="registerButton" onclick="changeView('registerPage')">Registrer</div>
                <div class="loginButton" onclick="loginDropDown()">Login</div>` :
                `<div class="userButton" onclick="">${model.app.loggedInUser.userName}</div>`}

                <div class="cartIcon" onclick="">🛒</div>
                <h3 class="underskrift">VintageSkatter</h1>
                <input type="search" class="searchBar" placeholder="Søk varer her." onchange="" name="q" value="" />
                <div class="searchButton" onclick="">Search</div>
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
    return html;
}
function showAllProducts(){
    return `<div class="allProductContainer"></div>`;
}


function showFilterBox(){
    let priceLimits = determinePriceLimits()
    return `
        <div class="newCategoryBox">
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
                <input type = "range" min="${priceLimits.min}" max = "${priceLimits.max}" value = "${model.inputs.category.priceRange.max}"></input>
                <input type = "text" value = "${priceLimits.min}"></input>
                <input type = "text" value = "${model.inputs.category.priceRange.max}"></input>
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