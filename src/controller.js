function deleteItemFromShoppingCart(indexInShoppingCart){
    model.inputs.shoppingCart.items.canBuyNow.splice(indexInShoppingCart, 1);
    updateView();
}

function findWinningBids(){
    model.inputs.shoppingCart.items.auctions.usersWinningBids = [];
    model.inputs.shoppingCart.items.auctions.usersLosingBids = [];

    for(let item of model.data.auctionListe){
        let maximumBidForItem = 0;
        let matchedUserId = '';       
        for(let userId in item.bids){
            if(item.bids[userId].bid[item.bids[userId].bid.length-1] > maximumBidForItem) {
                    maximumBidForItem = item.bids[userId].bid[item.bids[userId].bid.length-1];
                }
            if(userId === model.app.loggedInUser.userId){
                    matchedUserId = userId;
                }         
        }
        if (item.bids[matchedUserId].bid[item.bids[matchedUserId].bid.length-1] ===  maximumBidForItem) {
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
    if(model.inputs.shoppingCart.items.auctions.usersWinningBids.length > 0 ||
        model.inputs.shoppingCart.items.auctions.usersLosingBids.length > 0 ) {
            countDown = setInterval(updateView, 60000);
        }
    else clearInterval(countDown);
}

function trekkBud(itemsId, usersId){

    for(let i = 0; i < model.data.auctionListe.length; i++){
        if(model.data.auctionListe[i].itemId == itemsId){
            for(let userId in model.data.auctionListe[i].bids){
                if(userId == usersId){
                    model.data.auctionListe[i].bids[userId].deleted = true;
                }
            }
        }
    }
    updateView();
}

function increaseBid(itemsId, usersId, usersMaximumBid, newBud){
    if(newBud > usersMaximumBid){
        for (let i = 0; i < model.data.auctionListe.length; i++){
            if(model.data.auctionListe[i].itemId == itemsId){
                for(let userId in model.data.auctionListe[i].bids){
                    if(userId == usersId){
                        model.data.auctionListe[i].bids[userId].bid.push(newBud);
                        model.inputs.shoppingCart.items.auctions.increasedWinningBid = 0;
                    }
                }
            }
        }
    }
        updateView();
}

