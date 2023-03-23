
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

function checkLogin()
{
    const users = model.data.users;

    for (let userId in users)
    {
        const user = users[userId];
        console.log(model.inputs.login.username)
        console.log(model.inputs.login.password)

        if(model.inputs.login.username === user.username && model.inputs.login.password === user.password)
        {
            model.app.loggedInStatus = user.permissions;
            console.table(model.app.loggedInStatus)
        }

    }
}


function createProduct(){




}




function saveMainCategory(){
    let categoryExists = false ;
    for(let i = 0; i<model.inputs.categoryList.length; i++){
        if(model.inputs.createSale.mainCategory == model.inputs.category.categoryList[i].name 
        && model.inputs.category.categoryList[i].parent == -1)
        {
            categoryExists = true;
        }

    }
    if(!categoryExists){
            model.inputs.category.categoryList.push({
            id: model.inputs.category.categoryList.lenght,
            name: model.inputs.createSale.mainCategory,
            parent: -1,
            checked: false
        })
    }
}


function saveSubCategory(){
    let categoryExists = false ;
    let parentCategory 

    for(let i = 0; i<model.inputs.categoryList.length; i++){
        if(model.inputs.createSale.subCategory == model.inputs.category.categoryList[i].name 
        && model.inputs.category.categoryList[i].parent < -1)
        {
            categoryExists = true;
            parentCategory = model.inputs.categoryList[i].id
        }
     
    }
    if(!categoryExists){
        model.inputs.category.categoryList.push({
        id: model.inputs.category.categoryList.lenght,
        name: model.inputs.createSale.subCategory,
        parent: parentCategory,
        checked: false
    })
    }
}



function addMainCategory(){

    

}