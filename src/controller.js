function checkFilterBox(index){
    model.inputs.category.categoryList[index].checked = !model.inputs.category.categoryList[index].checked
    for(let i = 0; i<model.inputs.category.categoryList.length; i++){
        if(model.inputs.category.categoryList[i].parent == index){
            model.inputs.category.categoryList[i].checked = false
        }
    }
    updateView()
}

function filteredItemsAdmin(){
    let filteredArray = [];
    for(let j = 0; j < model.data.items.length; j++){
        if(model.data.items[j].auction && (new Date(model.data.items[j].deadline) >= new Date())){
            filteredArray.push(eval(model.data.items[j].id));
        }
    }
    if(model.inputs.adminAuctionPage.searchInput.length > 0){
        filteredArray = filteredArray.filter(itemsId => {
            if(model.data.items[itemsId-1].title.includes(model.inputs.adminAuctionPage.searchInput)||
               model.data.items[itemsId-1].description.includes(model.inputs.adminAuctionPage.searchInput)||
               model.data.items[itemsId-1].category.includes(model.inputs.adminAuctionPage.searchInput)){
                return itemsId;
               }
        });
    }
    let anychecked = false
    let storedArray = filteredArray
    filteredArray = filteredArray.filter(val => {
        let included = true
        for(let i = 0; i<model.inputs.category.categoryList.length; i++){
            if(model.inputs.category.categoryList[i].checked){anychecked = true}
            if(model.data.items[val-1].category.includes(model.inputs.category.categoryList[i].name) && model.inputs.category.categoryList[i].checked){
                included = true
                break
            }
            else{
                included = false
            }
        }
        return included? val : false
    })
    if(!anychecked){
        filteredArray = storedArray
    }
    model.inputs.category.filteredItemsAdmin = filteredArray;
}

function changeDeadlineAdminAuctionPage(itemsIndex, newDeadline){
    if(new Date(newDeadline) >= new Date()){
        model.data.items[itemsIndex].deadline = new Date(newDeadline).toISOString().substring(0,16);
    }
    else {
        model.data.items[itemsIndex].deadline = model.data.items[itemsIndex].deadline;
    }
    updateView();
}

function sendMessageAsAdmin(){
    model.inputs.adminAuctionPage.userIdsToSendMessage.forEach(usersId => {
        for(let usersKey in model.data.users){
            if(usersId == usersKey && model.data.users[usersId].permissions != "admin"){
                model.data.users[usersKey].messages.push(
                    {
                        type:"admin",
                        message: model.inputs.adminAuctionPage.messageToUsers
                    }
                );
            }
        }
    });
    model.inputs.adminAuctionPage.messageToUsers = '';
    updateView();
}

function findItemsExpiredDeadline(){
    let filteredItems = [];
    model.data.items.forEach(item => {
        if(item.auction && (new Date() > new Date(item.deadline))){
            filteredItems.push(eval(item.id));
        }
    });
    return filteredItems;
}
