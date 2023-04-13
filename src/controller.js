function toggleChatBox(){
    model.app.showChatBox = !model.app.showChatBox
    updateView()
}

function sendMessage(){
    if(model.inputs.chatBox.message == ""){return}
    model.data.users[model.app.userId].messages.push(
        {
            type:"user",
            message: model.inputs.chatBox.message
        }
    )
    model.inputs.chatBox.message = ""
    updateView()
}
