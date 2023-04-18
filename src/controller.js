

function findWinningBids(){
    model.inputs.shoppingCart.items.auctions.usersWinningBids = [];
    model.inputs.shoppingCart.items.auctions.usersLosingBids = [];

    for(let item of model.data.auctionListe){
        let maximumBidForItem = 0;
        let matchedUserId = false;       
        for(let userId in item.bids){
            if(item.bids[userId].bid[item.bids[userId].bid.length-1] > maximumBidForItem) {
                    maximumBidForItem = item.bids[userId].bid[item.bids[userId].bid.length-1];
                }
            if(userId == model.app.userId){
                    matchedUserId = userId;
                }       
        }
        if(matchedUserId){
            if (item.bids[matchedUserId].bid[item.bids[matchedUserId].bid.length-1] ==  maximumBidForItem) {
                    let winningItem = {            
                                        id: item.itemId,
                                        usersMaximumBid: maximumBidForItem, 
                                        deleted: false                                      
                            };
                    if(item.bids[matchedUserId].deleted)  winningItem.deleted = true;               
                    model.inputs.shoppingCart.items.auctions.usersWinningBids.push(winningItem);    
                }
            else {
                    let losingItem = {
                            id: item.itemId,
                            ItemsMaximumBid: maximumBidForItem,  
                            deleted: false                     
                        };
                    if(item.bids[matchedUserId].deleted)  losingItem.deleted = true; 
                    model.inputs.shoppingCart.items.auctions.usersLosingBids.push(losingItem);
                }
        }
    }
    if(model.inputs.shoppingCart.items.auctions.usersWinningBids.length > 0 ||
        model.inputs.shoppingCart.items.auctions.usersLosingBids.length > 0 ) {
            countDown = setInterval(updateView, 60000);
        }
    else clearInterval(countDown);
}

function sendMessageToUserAdminMembersPage(){
    for(let usersId in model.data.users){
        if (parseInt(usersId) == model.inputs.adminMembersPage.selectedUsersId){
            if(model.inputs.adminMembersPage.messageToUser.length > 0){
                model.data.users[usersId].messages.push(
                    {
                        type:'admin',
                        message: model.inputs.adminMembersPage.messageToUser, 
                    }
                );
            }
        }
    }
    model.inputs.adminMembersPage.messageToUser = '';
    updateView();
}

function deleteUserAsAdmin(){
    for(usersId in model.data.users){
        if(parseInt(usersId) == model.inputs.adminMembersPage.selectedUsersId){
            delete model.data.users[usersId];
        }
    }
    model.inputs.adminMembersPage.selectedUsersId = false;
    updateView();
}