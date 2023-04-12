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
                        <div id = "chatBoxRegisterButton" onclick = "">Registrer</div>
                        <div id = "chatBoxLoginButton" onclick = "">Logg inn</div>
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
        return `<div class = "${item.type}ChatElem">${item.type == "admin"?"DanskenOgMeg":model.data.users[model.app.loggedInUser].firstName}: ${item.message}</div>`
    }).join('')
}

function createLoginPage(){
    return `
        <div id = "loginPageContainer">
            <div id = "loginPageElement">
                <div id = "loginPageLogo" onclick = "">Dansken&meg</div>
                <label>Brukernavn</label>
                <input type = "text"/>
                <label>Passord</label>
                <input type = "text"/>
                <button>Logg inn</button>
                <button>Registrer ny bruker</button>
            </div>
        </div>
    ` 
}