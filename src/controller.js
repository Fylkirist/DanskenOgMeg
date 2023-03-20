function blowUpGalleryImg(img){
    model.app.zoomedPic = img
}

function unZoom(){
    model.app.zoomedPic = false
}

function addToShoppingCart(productId){
    for(let i = 0; i < model.data.users[model.app.userId].shoppingCart.length;i++){
        if(model.data.users[model.app.userId].shoppingCart[i].id == productId){
            model.data.users[model.app.userId].shoppingCart[i].quantity++
            return
        }
    }
    model.data.users[model.app.userId].shoppingCart.push({id:productId,quantity:1})
}

function raiseBid(productId){
    if(model.data.auctionListe[productId].bids[model.app.userId]){
        model.data.auctionListe[productId].bids[model.app.userId].push(model.inputs.product.bidIncrease)
    }
    else{
        model.data.auctionListe[productId].bids[model.app.userId] = [model.inputs.product.bidIncrease]
    }
    model.inputs.product.bidIncrease = 0
}