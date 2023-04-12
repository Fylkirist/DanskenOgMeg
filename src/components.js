function createPageFooter(){
    let chatBox = `
        <div id = "chatBoxWindow">
            <div id = "chatBox">
                ${model.app.loggedInStatus?
                    generateMessageElements()
                    :`
                    
                `}
            </div>
            <div>
                ${model.app.loggedInStatus?`
                    <div>
                        <input type = "text" oninput = "model.inputs.chatBox.message = this.value" value = "model.inputs.chatBox.message"/>
                        <button onclick = "sendMessage()">Send melding</button>
                    </div>
                `:`
                    <div></div>
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
        return `<div class = "${item.type}ChatElem">${item.type}: ${item.message}</div>`
    }).join('')
}
