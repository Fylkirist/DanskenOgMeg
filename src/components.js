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
}
