
function toggleProfileMenuDropDown(){
    model.inputs.profileMenuShowing = !model.inputs.profileMenuShowing
    updateView()
}

let countDown;

function deleteItemFromShoppingCart(indexInShoppingCart){
    model.inputs.shoppingCart.items.canBuyNow.splice(indexInShoppingCart, 1);
    updateView();
}

function removeFromUserShoppingCart(productId){
    model.data.users[model.app.userId].shoppingCart.splice(productId,1)
    updateView()
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
            if(userId == model.app.userId){
                    matchedUserId = userId;
                }       
        }
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
    if(model.inputs.shoppingCart.items.auctions.usersWinningBids.length > 0 ||
        model.inputs.shoppingCart.items.auctions.usersLosingBids.length > 0 ) {
            countDown = setInterval(updateView, 60000);
        }
    else clearInterval(countDown);
}

function logout(){
    model.app.userId = false
    model.app.loggedInStatus = false
    model.inputs.profileMenuShowing = false
    changeView("frontPage")
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

function registerUser() {
    let inputs = model.inputs.register
    if (inputs.firstName.length > 0 && // alle felter må være fylt ut før koden starter
        inputs.lastName.length > 0 &&
        inputs.email.length > 0 &&
        inputs.mobile.length > 0 &&
        inputs.userName.length > 0 &&
        inputs.password.length > 0 &&
        inputs.repeatPassword.length > 0 &&
        inputs.address.length > 0 &&
        inputs.zip.length > 0){    
        let brukernavnTatt = false;
        for (let userID in model.data.users){
            if(model.data.users[userID].username === model.inputs.register.userName){
                brukernavnTatt = true;
                break
            }
        }
        if(brukernavnTatt){    
            model.inputs.register.meldingRegister = 'Brukernavn eksisterer allerede'
            updateView()
            return
        }
        if(model.inputs.register.cardNumber.length>0 && !isValid(model.inputs.register.cardNumber)){
            model.inputs.register.meldingRegister = 'Ikke gyldig bankkort'
            updateView()
            return
        }
        if (model.inputs.register.password === model.inputs.register.repeatPassword){ 
            const newUser = { 
                username:model.inputs.register.userName,                        
                password:model.inputs.register.password,  
                permissions: 'user',
                firstName:model.inputs.register.firstName,
                surname:model.inputs.register.surname,
                address:model.inputs.register.address,
                city:model.inputs.register.city,
                zip:model.inputs.register.zip,
                email:model.inputs.register.email,
                mobile:model.inputs.register.mobile,
                shoppingCart:[],
                auctionList:[],
                paymentInformation:[
                    {
                        cardNumber: model.inputs.register.cardNumber,
                        expirationDate:model.inputs.register.fromDate,
                        cardHolderFirstName:model.inputs.register.firstName,
                        cardHolderLastName:model.inputs.register.surname,
                        address:model.inputs.register.address,
                        zip:model.inputs.register.zip,
                        houseNumber:"",                    
                    }
                ],
                messages:[],
            }
            let brukerTelling = Object.keys(model.data.users).length +1
            let newUserID = brukerTelling.toString()
            while(newUserID.length<7){
                newUserID = "0" + newUserID
            }
            model.data.users[newUserID] = newUser
            model.inputs.register.registerUser = "Velkommen til Dansken & Meg antikkmarked"
            model.app.currentView = "frontPage"
        }
        else if (model.inputs.register.password !== model.inputs.register.repeatPassword){
            model.app.input.register.meldingRegister = 'Passordene du har skrevet stemmer ikke overens'
        }
    }
    else {
        model.inputs.register.meldingRegister = "Alle feltene må være fylt ut"
    }
    updateView()
}

function goToShoppingCart(){
    model.app.currentView = "shoppingCart"
    updateView()
}

function toToFrontPage(){
    model.app.currentView = "frontPage"
    updateView()
}

function isValid(input) {
    let cardNumber = input.replace(/\s/g,'')
    if (/[^0-9-\s]+/.test(cardNumber)) return false
    let sum = 0
    let double = false
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i))
      if (double) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      double = !double
    }
    return (sum % 10) == 0
}

function goBackToFrontPage(){
    Object.values(model.inputs.register).forEach((val)=>val = "")
    model.app.currentView = "frontPage"
    updateView()
}

function goToRegisterPage(){
    Object.values(model.inputs.login).forEach((val)=>val = "")
    model.app.currentView = "registerPage"
    updateView()
}

function retractDropDown(){
    model.inputs.profileMenuShowing = false
    updateView()
}

function doSearch() {
    model.app.currentView = "filteredPage";
    updateView();
}

function changeFrontPageBotProduct(direction){
    if(model.app.frontPageCurrentShowing.bottom>0 && model.app.frontPageCurrentShowing.bottom < model.data.frontPageBottom.length-1){
        model.app.frontPageCurrentShowing.bottom += direction
    }
    updateView()
}

function changeFrontPageTopProduct(direction){
    if(model.app.frontPageCurrentShowing.top>0 && model.app.frontPageCurrentShowing.top < model.data.frontPageTop.length-1){
        model.app.frontPageCurrentShowing.top += direction
    }
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
                model.app.userId = userKeys
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

function removeCategory(item,cat){
    model.data.items[item].category.splice(cat,1)
    updateView()
}

function blowUpGalleryImg(img){
    model.app.zoomedPic = img
    updateView()
}

function unZoom(){
    model.app.zoomedPic = false
    updateView()
}

function addNewSubCategory(id){
    if(model.inputs.product.adminAddSubCategory != ""){
        model.data.items[id].category.push(model.inputs.product.adminAddSubCategory)
        model.inputs.product.adminAddSubCategory = ""
        updateView()   
    }
}

function addToShoppingCart(productId){
    console.log(productId)
    for(let i = 0; i < model.data.users[model.app.userId].shoppingCart.length;i++){
        if(model.data.users[model.app.userId].shoppingCart[i].item == productId){
            model.data.users[model.app.userId].shoppingCart[i].quantity++
            return
        }
    }
    model.data.users[model.app.userId].shoppingCart.push({item:productId,quantity:1})
    updateView()
}

function raiseBid(productId){
    if(model.data.auctionListe[productId].bids[model.app.userId]){
        model.data.auctionListe[productId].bids[model.app.userId].push(model.inputs.product.bidIncrease)
    }
    else{
        model.data.auctionListe[productId].bids[model.app.userId] = [model.inputs.product.bidIncrease]
    }
    model.inputs.product.bidIncrease = 0
    updateView()
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
            model.app.userId = userId;
        }

    }
}

function checkFilterBox(index){
    model.inputs.category.categoryList[index].checked = !model.inputs.category.categoryList[index].checked
    for(let i = 0; i<model.inputs.category.categoryList.length; i++){
        if(model.inputs.category.categoryList[i].parent == index){
            model.inputs.category.categoryList[i].checked = false
        }
    }
    updateView()
}


function filterItems(){
    let filterArray = []
    model.data.items.forEach(item =>{
        if(item.title.includes(model.inputs.search.input) ||
         item.description.includes(model.inputs.search.input) ||
          item.category.includes(model.inputs.search.input)){
            filterArray.push(eval(item.id))
          }
    })
    console.log(filterArray)
    let anychecked = false
    let storedArray = filterArray
    filterArray = filterArray.filter(val => {
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
        filterArray = storedArray
    }
    console.log(filterArray)
    filterArray = filterArray.filter(val => {
        console.log(val)
        if(model.data.items[val-1].price>=model.inputs.category.priceRange.min && model.data.items[val-1].price<=model.inputs.category.priceRange.max){
            return val
        }
        else{
            return false
        }
    })
    return filterArray
}



function filteredItemsAdmin(){
    let filteredArray = [];
    for(let j = 0; j < model.data.items.length; j++){
        if(model.data.items[j].auction){
            filteredArray.push(eval(model.data.items[j].id));
        }
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
    return filteredArray;
}
