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

function generateMessageElements(){ 
    return model.data.users[model.app.loggedInUser].messages.map(item => {
        return `<div class = "${item.type}ChatElem">${item.type == "admin"?"Dansken&Meg":model.data.users[model.app.loggedInUser].firstName}: ${item.message}</div>`
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
                <button onclick = "">Logg inn</button>
                <button onclick = "changeView("registerPage")">Registrer</button>
            </div>
        </div>
    ` 
}