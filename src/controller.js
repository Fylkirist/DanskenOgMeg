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
                changeView("frontPage")
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

function changeView(view){
    model.app.currentView = view
    updateView()
}

function createProduct(){
    if(model.inputs.createSale.images.length>0 &&
        model.inputs.createSale.categoryList.length>0 &&
        model.inputs.createSale.description != "" &&
        model.inputs.createSale.title != ""){

            const newProduct = {
                title: model.inputs.createSale.title,
                id: model.inputs.createSale.newId,
                description: model.inputs.createSale.description,
                price:model.inputs.createSale.price,
                minBid:model.inputs.createSale.minimumBidAmmount,
                auction: model.inputs.createSale.auction,
                deadline: model.inputs.createSale.deadline,
                deliver:model.inputs.createSale.deliver,
                frontPage: model.inputs.createSale.frontPage,
                category: model.inputs.createSale.categoryList,
                images : model.inputs.createSale.images.map(elem => elem),
                inStock :true
            }
            for(key in model.inputs.createSale){
                switch(typeof model.inputs.createSale[key]){
                    case "string":
                        model.inputs.createSale[key] = ""
                        break
                        case "object":
                            model.inputs.createSale[key] = ['']
                            break
                            case "number":
                                model.inputs.createSale[key] = 0
                                break
                            }
                        }
                        model.data.items.push(newProduct);
                        saveMainCategory()
                        updateView()
    }
}

function saveMainCategory(){
    let parentId;
    let newParent = false
    for(let i = 0; i<model.inputs.category.categoryList.length;i++){
        if(model.inputs.category.categoryList[i].name == model.inputs.createSale.categoryList[0].name && model.inputs.category.categoryList[i].parent == -1){
            parentId = i
        }
    }
    if(!parentId){
        newParent = true
        parentId = model.inputs.category.categoryList.length
        model.inputs.category.categoryList.push({
            id:model.inputs.category.categoryList.length,
            name:model.inputs.createSale.categoryList[0],
            parent:-1,
            checked:false
        })
    }
    for(let i = 1; i<model.inputs.createSale.categoryList.length;i++){
        if(newParent){
            model.inputs.category.categoryList.push({
                id: model.inputs.category.categoryList.length,
                name: model.inputs.createSale.categoryList[i],
                parent: parentId,
                checked:false
            })
        }
        else{
            categoryExists = false
            for(let j = 0; j<model.inputs.category.categoryList.length; j++){
                if(model.inputs.category.categoryList[j].parent == parentId && model.inputs.category.categoryList[j].name ==  model.inputs.createSale.categoryList[i]){
                    categoryExists = true
                }
            }
            if(!categoryExists){
                model.inputs.category.categoryList.push({
                    id:model.inputs.category.categoryList.length,
                    name:model.inputs.createSale.categoryList[i],
                    parent:parentId,
                    checked:false
                })
            }
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

function toogleLoginDrop(){
    model.inputs.login.dropdown = !model.inputs.login.dropdown;
    }

function deleteCategory(index){
    if(index == 0){
        model.inputs.createSale.categoryList[0] = ""
    }
    else{
        model.inputs.createSale.categoryList.splice(index,1)
    }
    updateView()
}

function insertImage(){
    if(!model.inputs.createSale.images.includes(model.inputs.createSale.addImage)){
        model.inputs.createSale.images.push(model.inputs.createSale.addImage)
    }
}

function goToProduct(index){
    model.app.currentView = "productPage"
    model.app.currentProduct = index
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

function changePriceLevels(value){
    model.inputs.category.priceRange.max = value
    updateView()
}

let priceLimits = determinePriceLimits()
model.inputs.category.priceRange.max = priceLimits.max
model.inputs.category.priceRange.min = priceLimits.min

function oppdaterPersonalia(verdi){
    
    if (verdi === 'namePhoneEmail') {
        if(model.inputs.register.firstName !== "" && model.inputs.register.lastName !== "" 
        && model.inputs.register.mobile !== "" && model.inputs.register.email !== ""){
            model.data.users[model.app.userId].firstName = model.inputs.register.firstName;
            model.data.users[model.app.userId].surName = model.inputs.register.lastName;
            model.data.users[model.app.userId].mobile = model.inputs.register.mobile;
            model.data.users[model.app.userId].email = model.inputs.register.email;
        }else{
            alert('Du Må Fylle Ut Alt!')
        }
    }
    if (verdi === 'adresse') {
        if(model.inputs.register.address !== "" && model.inputs.register.city !== "" && model.inputs.register.zip !== "" ){
            model.data.users[model.app.userId].address = model.inputs.register.address;
            model.data.users[model.app.userId].city = model.inputs.register.city;
            model.data.users[model.app.userId].zip = model.inputs.register.zip;
        }else{
            alert('Du Må Fylle Ut Alt!')
        }
    }
    
    if (verdi === 'byttPassord'){

        if(model.inputs.register.password === model.data.users[model.app.userId].password && model.inputs.register.password !== ""){

            model.data.users[model.app.userId].password = model.inputs.register.repeatPassword;

        }else{
            alert('Feil Passord!')
        }

    }
}

function deleteCard(index){
    model.data.users[model.app.userId].paymentInformation.splice(index, 1);
    updateView()
}

function addBankCard(){
    const cardInputs = model.inputs.register;
    
    let cardInfoAdd = {
        cardNumber:model.inputs.register.cardNumber ,
        expirationDate:model.inputs.register.toDate,
        cardHolderFirstName:model.inputs.register.cardFirstName,
        cardHolderLastName:model.inputs.register.cardLastName,
        address:model.inputs.register.cardAddress,
        zip:model.inputs.register.cardZip,
        cvc:model.inputs.register.cvc,
        city:model.inputs.register.cardCity 
    }
    if(cardInputs.cardNumber == "" && cardInputs.toDate == "" && cardInputs.firstName == "" && cardInputs.lastName == "" 
    && cardInputs.city == "" && cardInputs.zip == "" && cardInputs.address == "" && cardInputs.cvc == ""){  
        alert('Du Må Fylle Ut Alt!')
        return
    }
    if(!isValid(model.inputs.register.cardNumber)){
        alert('Ugyldig Kortnummer!')
        return
    }
     model.data.users[model.app.userId].paymentInformation.push(cardInfoAdd);

     setUserInputs()
     updateView()
}

function setUserInputs(){
    model.inputs.register.firstName = model.data.users[model.app.userId].firstName
    model.inputs.register.lastName = model.data.users[model.app.userId].surName
    model.inputs.register.mobile = model.data.users[model.app.userId].mobile
    model.inputs.register.email = model.data.users[model.app.userId].email
    model.inputs.register.city = model.data.users[model.app.userId].city
    model.inputs.register.zip = model.data.users[model.app.userId].zip
    model.inputs.register.address = model.data.users[model.app.userId].address
    
    model.inputs.register.cardNumber = ''
    model.inputs.register.toDate = ''
    model.inputs.register.cvc = ''
    model.inputs.register.cardFirstName = ''
    model.inputs.register.cardLastName = ''
    model.inputs.register.cardCity = ''
    model.inputs.register.cardAddress = ''
    model.inputs.register.cardZip = ''
}
