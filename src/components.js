function createPageFooter(){
    let chatBox = `
        <div id = "chatBoxWindow">
            <div id = "chatBox">
            
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