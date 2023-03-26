
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
    const newProduct = {
        title: model.inputs.createSale.title,
        id: model.data.items.length +1,
        description: model.inputs.createSale.description,
        price:model.inputs.createSale.price,
        minimumBid:model.inputs.createSale.minimumBid,
        minimumBidAmmount:model.inputs.createSale.minimumBidAmmount,
        auction:  model.inputs.createSale.auction,
        deadline:model.inputs.createSale.deadline,
        images: [],
        deliver:model.inputs.createSale.deliver,
        frontPage: model.inputs.createSale.frontPage,
        category: model.inputs.createSale.categoryList,
        mainImage: model.inputs.createSale.mainImage,
        images : model.inputs.createSale.images,
        inStock :true
    }
    model.data.items.push(newProduct);
    saveMainCategory()
}

function saveMainCategory(){
    let parentId;
    for(let i = 0; i < model.inputs.createSale.categoryList.length; i++){
        let categoryExists = false
        for(let j = 0; j < model.inputs.category.categoryList.length; j++){
            if(model.inputs.createSale.categoryList[i] == model.inputs.category.categoryList[j].name){
                categoryExists = true
                parentId = i == 0 ? model.inputs.category.categoryList[j].id:model.inputs.category.categoryList.length
                break
            }
        }
        if(categoryExists && parentId == model.inputs.category.categoryList.length){
            categoryExists = false
        }
        if(!categoryExists){
            model.inputs.category.categoryList.push({
                id: model.inputs.category.categoryList.length,
                parent: i == 0 ? -1:parentId,
                name: model.inputs.createSale.categoryList[i],
                checked:false
            })
        }
    }
}

function addMainCategory(){
    if(model.inputs.createSale.mainCategory!=''){
        model.inputs.createSale.categoryList[0] = model.inputs.createSale.mainCategory
    }
    model.inputs.createSale.mainCategory = ''
    updateView()
}

function addSubCategory(){
    if(!model.inputs.createSale.categoryList.includes(model.inputs.createSale.subCategory)){
        model.inputs.createSale.categoryList.push(model.inputs.createSale.subCategory)
    }
    model.inputs.createSale.subCategory = ''
    updateView()
}

function insertImage(){
    if(!model.inputs.createSale.images.includes(model.inputs.createSale.addImage)){
        model.inputs.createSale.images.push(model.inputs.createSale.addImage)
    }
}



