
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
            // model.app.loggedInStatus = user.permissions;
            // console.table(model.app.loggedInStatus)
        }

    }
}

function checkFilterBox(index){
    model.inputs.category.categoryList[index].checked = !model.inputs.category.categoryList[index].checked
    updateView()
}

function changeView(view){
    model.app.currentView = view
    updateView()
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
        for(userKeys in model.data.users){
            if(model.inputs.login.username === model.data.users[userKeys].username &&
            model.inputs.login.password === model.data.users[userKeys].password){
                model.inputs.login.dropdown = false;
                model.app.loggedInStatus= true;
                model.inputs.login.wrongUserNamePassword = false;
                model.app.wrongUserNamePasswordMessage = '';
                model.app.loggedInUser.userName = model.data.users[userKeys].username;
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


