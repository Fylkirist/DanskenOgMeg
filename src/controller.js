
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

// function checkLogin()
// {
//     const users = model.data.users;

//     for (let userId in users)
//     {
//         const user = users[userId];
//         console.log(model.inputs.login.username)
//         console.log(model.inputs.login.password)

//         if(model.inputs.login.username === user.username && model.inputs.login.password === user.password)
//         {
//             model.app.loggedInStatus = user.permissions;
//             console.table(model.app.loggedInStatus)
//         }

//     }
// }

function checkFilterBox(index){
    model.inputs.category.categoryList[index].checked = !model.inputs.category.categoryList[index].checked
    for(let i = 0; i<model.inputs.category.categoryList.length; i++){
        if(model.inputs.category.categoryList[i].parent == index){
            model.inputs.category.categoryList[i].checked = false
        }
    }
    
    updateView();
}

function changeView(view){
    model.app.currentView = view;
    updateView();
}

function loginDropDown(){
    if(model.inputs.login.dropdown) {
        model.inputs.login.dropdown = false;
    }
    else {
        model.inputs.login.dropdown = true;
    }
    updateView();
}
function checkUserIdPassword(){
    if(model.inputs.login.username === '' ||
        model.inputs.login.password === '') {
            model.app.wrongUserNamePasswordMessage = 'Username / password required.';
            model.inputs.login.wrongUserNamePassword = true;
            model.inputs.login.dropdown = true;
            model.app.loggedInStatus= false;
    }
    else{
        for(let userKeys in model.data.users){
            if(model.inputs.login.username === model.data.users[userKeys].username &&
            model.inputs.login.password === model.data.users[userKeys].password){
                model.inputs.login.dropdown = false;
                model.app.loggedInStatus= true;
                model.inputs.login.wrongUserNamePassword = false;
                model.app.wrongUserNamePasswordMessage = '';
                model.app.loggedInUser.userName = model.data.users[userKeys].username;
                model.app.loggedInAs = model.data.users[userKeys].permissions;
                break;
            }
            else {
                model.app.wrongUserNamePasswordMessage = 'Wrong username/ password.';
                model.inputs.login.wrongUserNamePassword = true;
                model.inputs.login.dropdown = true;
                model.app.loggedInStatus= false;
            }
        }
    }
    updateView();
}



function goToProduct(index){
    model.app.currentView = "productPage"
    model.app.currentProduct = index
    updateView()
}

function filterItems(){
    let filterArray = model.data.items.map(elem=>{
        if(elem.description.includes(model.inputs.search.input) || elem.title.includes(model.inputs.search.input))
        return eval(elem.id)
    })
    console.log(filterArray)
    filterArray = filterArray.filter(elem=>{
        console.log(elem)
        let included = true;
        for(let i = 0; i<model.inputs.category.categoryList.length; i++){
            console.log(model.data.items[elem-1].category,model.inputs.category.categoryList[i].checked)
            if(!model.data.items[elem-1].category.includes(model.inputs.category.categoryList[i].name) && model.inputs.category.categoryList[i].checked){
                included = false
                break
            }
            
        }
        console.log(included)
        if(included){return elem}
    })
    console.log(filterArray)
    filterArray = filterArray.filter(elem=>{
        if(model.data.items[elem-1].price >= model.inputs.category.priceRange.min && model.data.items[elem-1].price <= model.inputs.category.priceRange.max){
            return elem
        }    
    })
    console.log(filterArray)
    return filterArray
}

function determinePriceLimits(){
    let max = 0
    for(let i = 0; i<model.data.items.length; i++){
        if(model.data.items[i].price>max){
            max = model.data.items[i].price
        }
    }
    let min = max
    for(let i = 0; i<model.data.items.length; i++){
        if(model.data.items[i].price<min){
            min = model.data.items[i].price
        }
    }
    return {max:max,min:min}
}
let priceLimits = determinePriceLimits()
model.inputs.category.priceRange.max = priceLimits.max
model.inputs.category.priceRange.min = priceLimits.min


