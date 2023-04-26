
function addToOrderHistory(auksjonsId,userId) {
    const item = model.data.items.find((item) => item.id === auksjonsId);
    if(auksjonsId){
        const date = item.deadline.split("T")[0]
        model.data.orderHistory.push({
        itemId: parseInt(auksjonsId),
        paid: false,
        price: item.price,
        date: date,
        type: 'auksjon',
        userId: userId,
        image: item.images[0],
        title: item.title,      
        })
    }
}
   
  function calculateDeadlineSec(itemsId){
    const item = model.data.items.find((item, index) => {
        if (item.id == itemsId) {
        return true;
      }
      return false;
    });
  
    let setDeadline;
    let html = '';
    setDeadline = item.deadline;
    const deadlineClock = document.getElementById(`deadline-${itemsId}`);
    if (!deadlineClock) {
        return;
      }
      let miliSecondsRemaining = parseInt(new Date(setDeadline) - new Date());
      let daysRemaining = Math.floor(miliSecondsRemaining / (1000 * 60 * 60 * 24));
      let hoursRemaining = Math.floor((miliSecondsRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutesRemaining = Math.floor((miliSecondsRemaining % (1000 * 60 * 60)) / (1000 * 60));
      let secondsRemaining = Math.floor((miliSecondsRemaining % (1000 * 60)) / 1000);
    if (miliSecondsRemaining > 1000){ 
        deadlineClock.innerHTML=`
                ${daysRemaining} dager og ${hoursRemaining} timer og ${minutesRemaining} minutter. sekunder: ${secondsRemaining}
             `;

    }
    else {
      const auction = model.data.auctionListe.find((auction) => auction.itemId == itemsId);
      const userIdAuction = Object.keys(auction.bids);
      const alleBudIListe = userIdAuction.map(userID => Math.max(...auction.bids[userID].bid));
      const maxBidAlleBrukere = Math.max(...alleBudIListe);
      let vunnetBruker = "";
      for (const userId in auction.bids) {
        if (auction.bids[userId].bid.includes(maxBidAlleBrukere)) {
          vunnetBruker = userId;
          break;
        }
      }
      item.inStock = false;
      item.auction = false;
      if (maxBidAlleBrukere > (item.price-1)) {
        auction.bids[vunnetBruker].vunnet = true;
        addToShoppingCart(itemsId)
      }
      
    }
}
function updateAllTimers() {
    model.data.items.forEach(item => {
        if (item.auction) {
            calculateDeadlineSec(item.id);
        }
    });
}



function getHighestAutoBid(auctionID) {
    const auction = model.data.auctionListe.find((navigation) => navigation.itemId === auctionID);
    const userIds = Object.keys(auction.bids);
    let highestAutoBid = 0;
    let highestAutoBidUser = null;
    userIds.forEach(userId => {
      const bids = auction.bids[userId];
      if (bids.autoBid > highestAutoBid) {
        highestAutoBid = bids.autoBid;
        highestAutoBidUser = userId;
      }
    });
    return {
      highestAutoBid,
      highestAutoBidUser
    };
  }
  function activeAuctionController(auctionID, buttonID, input) {
    initializeUserBid(auctionID);
    const auction = model.data.auctionListe.find((navigation) => navigation.itemId === auctionID);
    const bids = auction.bids[model.app.userId];
    const item = model.data.items.find((item) => item.id === auction.itemId);

    const userIdAuction = Object.keys(auction.bids);
    const alleBudIListe = userIdAuction.map(userID => Math.max(...auction.bids[userID].bid));
    const maxBidAlleBrukere = Math.max(...alleBudIListe);
    
    const highestAutoBidData = getHighestAutoBid(auctionID);
    const highestAutoBid = highestAutoBidData.highestAutoBid;
    const highestAutoBidUser = highestAutoBidData.highestAutoBidUser;
   
if(!model.app.userId || bids.deleted)
  {
    return;
  }


  if (buttonID === 'minbud') {
    const nyttBud = item.price + item.minBid;
    if(highestAutoBid <= nyttBud){
      item.price = nyttBud;
      bids.bid.push((nyttBud+1));
    } else if(model.app.userId !== highestAutoBidUser) {
      item.price=nyttBud;
      auction.bids[highestAutoBidUser].bid.push((nyttBud+1))
      bids.bid.push(nyttBud);
    }
    else if(model.app.userId === highestAutoBidUser){
        item.price=nyttBud;
        auction.bids[highestAutoBidUser].bid.push(nyttBud)}
  }
if(parseInt(input) > item.price){
  if (buttonID === 'manuelt') {
    const nyttBud = parseInt(input)
    if(highestAutoBid <= nyttBud){
      item.price = nyttBud;
      bids.bid.push((nyttBud+1))  
    } else if(nyttBud>item.price+item.minBid && model.app.userId !== highestAutoBidUser) {
      item.price=nyttBud;
      auction.bids[highestAutoBidUser].bid.push((nyttBud+1))
      bids.bid.push(nyttBud)
    }
      else if (model.app.userId == highestAutoBidUser && nyttBud > highestAutoBid){
        item.price=nyttBud
        auction.bids[highestAutoBidUser].bid.push(nyttBud)
      }
  }

    
  if (buttonID === 'automatic') {
    const autoBid = parseInt(input)
    
    if (model.app.userId !== highestAutoBidUser) {
      bids.autoBid = autoBid
 if(autoBid > highestAutoBid && autoBid > item.price){
  if(highestAutoBid == 0)
     {
      const nyttBud = item.price + 1;
      item.price = nyttBud;
      bids.bid.push(nyttBud)
     }else{
      const nyttBud = highestAutoBid + 1;
      item.price = nyttBud
      bids.bid.push(nyttBud)}
    }
   else if (autoBid > item.price && (autoBid - item.price) >= item.minBid && model.app.userId !== highestAutoBidUser) {
      const nyttBud = autoBid
      item.price = nyttBud
      auction.bids[highestAutoBidUser].bid.push((nyttBud+1));
      bids.bid.push(nyttBud)
    }
}}
  if(buttonID ==='editAuto')
  {
    if(parseInt(input) > item.price)
    {const editAuto = parseInt(input)
    bids.autoBid = editAuto}
  }
  }
  if (buttonID === 'delete') {
    if (bids.bid.length > 0) {
        
      bids.deleted = true
      bids.bid = []
      setDisplayPrice(auctionID)
      }
    }
    updateAllTimers()
    updateView()
}

function setDisplayPrice(id){
    let topBid = 0;
    const auction = model.data.auctionListe.find((auction) => auction.itemId === id);
    if (auction) {
        Object.keys(auction.bids).map(val => {
            if (auction.bids[val].deleted == false) {
                topBid = Math.max(...auction.bids[val].bid) > topBid ? Math.max(...auction.bids[val].bid) : topBid;
            }
        });
        for (let i = 0; i < model.data.items.length; i++) {
            if (id == model.data.items[i].id) {
                if(topBid>model.data.items[i].originalPrice){
                    model.data.items[i].price = topBid
                }
                else{
                    model.data.items[i].price = model.data.items[i].originalPrice
                }
                return
            }
        }
    }
}

function addNewItemToAuctionList(itemId) {
    const auctionExists = model.data.auctionListe.some(auction => auction.itemId === itemId);
  
    if (!auctionExists) {
      const newAuction = {
        itemId: itemId,
        bids: {}
      };
      model.data.auctionListe.push(newAuction);
    }
  }
  // lager nyy objekt hvis det ikke eksisterer
  function initializeUserBid(auctionID) {
    let auction = model.data.auctionListe.find(auction => auction.itemId == auctionID);
    
    if (!auction) {
      auction = {
        itemId: auctionID,
        bids: {}
      };
      model.data.auctionListe.push(auction);
    }
  
    if (!auction.bids[model.app.userId]) {
      auction.bids[model.app.userId] = {
        bid: [],
        autoBid: 0,
        deleted: false
      };
    }
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

function checkFilterBox(index){
    model.inputs.category.categoryList[index].checked = !model.inputs.category.categoryList[index].checked
    for(let i = 0; i<model.inputs.category.categoryList.length; i++){
        if(model.inputs.category.categoryList[i].parent == index){
            model.inputs.category.categoryList[i].checked = false
        }
    }
    updateView()
}

function checkProductTypeFilter(filter){
    switch(filter){
        case "normal":
            model.inputs.category.filterNormalCheck = !model.inputs.category.filterNormalCheck
            updateView()
            break
        case "auction":
            model.inputs.category.filterAuctionCheck = !model.inputs.category.filterAuctionCheck
            updateView()
            break
    }
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
            if(model.data.items[itemsId-1].title.toLowerCase().includes(model.inputs.adminAuctionPage.searchInput.toLowerCase())||
               model.data.items[itemsId-1].description.toLowerCase().includes(model.inputs.adminAuctionPage.searchInput.toLowerCase())||
               model.data.items[itemsId-1].category.join(',').toLowerCase().split(',').includes(model.inputs.adminAuctionPage.searchInput.toLowerCase())){
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

function deleteItemFromShoppingCart(indexInShoppingCart){
    model.inputs.shoppingCart.items.canBuyNow.splice(indexInShoppingCart, 1);
    if(model.inputs.shoppingCart.items.canBuyNow.length == 0){
        model.inputs.checkOutPage.emptyShoppingCart = true;
    }
    updateView();
}

// added line 22 to addToShoppingCart function

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
    setUsersDataForCheckOutPage();
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
                surname:model.inputs.register.surName,
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
                        cardCity: model.inputs.register.city                
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
            model.app.userId=newUserID;
            model.app.loggedInStatus=true;

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
    if(model.app.frontPageCurrentShowing.bottom + direction >= 0 && model.app.frontPageCurrentShowing.bottom + direction < model.data.frontPageBottom.length){
        model.app.frontPageCurrentShowing.bottom += direction
        model.app.frontPageCurrentShowing.botPic = 0
    }
    updateView()
}

function changeFrontPageTopProduct(direction){
    if(model.app.frontPageCurrentShowing.top + direction >= 0 && model.app.frontPageCurrentShowing.top + direction < model.data.frontPageTop.length){
        model.app.frontPageCurrentShowing.top += direction
        model.app.frontPageCurrentShowing.topPic = 0
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
                setUsersDataForCheckOutPage();
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
    model.inputs.category.categoryList = []
    populateCategoryInputs()
}

function blowUpGalleryImg(img){
    model.app.zoomedPic = img
    updateView()
}

function unZoom(){
    model.app.zoomedPic = false
    updateView()
}

function changeMainCategory(id){
    if(model.inputs.product.adminChangeMainCategory != ""){
        model.data.items[id].category[0] = model.inputs.product.adminChangeMainCategory
        model.inputs.product.adminChangeMainCategory = ""
        updateView()
        model.inputs.category.categoryList = []
        populateCategoryInputs()
    }
}

function addNewSubCategory(id){
    if(model.inputs.product.adminAddSubCategory != ""){
        model.data.items[id].category.push(model.inputs.product.adminAddSubCategory)
        model.inputs.product.adminAddSubCategory = ""
        updateView()
        model.inputs.category.categoryList = []
        populateCategoryInputs()
    }
}

function addToShoppingCart(productId){
    if(model.app.loggedInStatus){
        for(let i = 0; i < model.data.users[model.app.userId].shoppingCart.length;i++){
            if(model.data.users[model.app.userId].shoppingCart[i].item == productId){
                model.data.users[model.app.userId].shoppingCart[i].quantity++
                return
            }
        }
        model.data.users[model.app.userId].shoppingCart.push({item:productId,quantity:1})
        model.inputs.checkOutPage.emptyShoppingCart = false;
        updateView()
    }
    else{
        for(let i = 0 ; i < model.inputs.shoppingCart.items.canBuyNow.length; i++){
            if(model.inputs.shoppingCart.items.canBuyNow[i].id == productId){
                model.inputs.shoppingCart.items.canBuyNow[i].quantity++
                return
            }
        }
        model.inputs.shoppingCart.items.canBuyNow.push({id:productId,quantity:1})
        model.inputs.checkOutPage.emptyShoppingCart = false;
        updateView()
    }
}

function checkValidityOfEmail(emailToCheck){
    emailToCheck = emailToCheck.trim();
    const pattern = /^[(\w)+]+\.?([(\w)+]+)?@[\w+]+\.[\w+]+$/i;
    if(pattern.test(emailToCheck)) {
        model.app.checkOut.invalidEmailOnCheckOutPage = false;
        model.inputs.checkOutPage.email = emailToCheck;
    }
    else {
        model.app.checkOut.invalidEmailOnCheckOutPage = true;
        model.inputs.checkOutPage.email = emailToCheck;
    }
    updateView();
}

function checkLogin()
{
    const users = model.data.users;

    for (let userId in users)
    {
        const user = users[userId];

        if(model.inputs.login.username === user.username && model.inputs.login.password === user.password)
        {
            model.app.loggedInStatus = true;
            model.app.userId = userId;
        }

    }
}

function setUsersDataForCheckOutPage(){
    for(let usersId in model.data.users){
        if(model.app.userId && usersId == model.app.userId && model.data.users[usersId].permissions != "admin"){
            model.inputs.checkOutPage.firstName = model.data.users[usersId].firstName;
            model.inputs.checkOutPage.lastName = model.data.users[usersId].surName;
            model.inputs.checkOutPage.address = model.data.users[usersId].address;
            model.inputs.checkOutPage.email = model.data.users[usersId].email;
            model.inputs.checkOutPage.mobile = model.data.users[usersId].mobile;
            break;
        }
        else {
            model.inputs.checkOutPage.firstName = '';
            model.inputs.checkOutPage.lastName = '';
            model.inputs.checkOutPage.address = '';
            model.inputs.checkOutPage.email = '';
            model.inputs.checkOutPage.mobile = '';
            model.inputs.checkOutPage.zipCode = '';
            model.inputs.checkOutPage.addressFilled = false;
            model.app.checkOut.invalidEmailOnCheckOutPage = false;
            model.inputs.checkOutPage.selectedDeliveryMethod = '';
            model.inputs.checkOutPage.deliveryMethod.selected = false;
            model.inputs.checkOutPage.deliveryMethod.butikk = '';
            model.inputs.checkOutPage.deliveryMethod.leveringMedInnbæring = '';
            model.inputs.checkOutPage.deliveryMethod.leveringUtenInnbæring = '';
            model.inputs.checkOutPage.frakt = 0;
            model.inputs.checkOutPage.cardNumber = '';
            model.inputs.checkOutPage.expirationDate = '';
            model.inputs.checkOutPage.cvc = '';
            model.inputs.checkOutPage.cardHolderFirstName = '';
            model.inputs.checkOutPage.cardHolderLastName = '';
            model.inputs.checkOutPage.addNewCard = false;
        }
    }
}

function changeView(view){
    if(model.app.currentView != view){
        if(model.app.pagesToNavigateTo.length == 0){
            model.app.pagesToNavigateTo.push(model.app.currentView, view);
        }
        else {
            model.app.pagesToNavigateTo.push(view);
        }
        model.app.indexOfThePageAreOn = model.app.pagesToNavigateTo.length-1 ;
    }
    model.app.currentView = view;
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
                price:parseInt(model.inputs.createSale.price),
                originalPrice:parseInt(model.inputs.createSale.price),
                minBid:parseInt(model.inputs.createSale.minimumBidAmmount),
                auction: model.inputs.createSale.auction,
                deadline: new Date(model.inputs.createSale.deadline).toISOString().substring(0,16),
                deliver:model.inputs.createSale.deliver,
                frontPage: model.inputs.createSale.frontPage,
                category: model.inputs.createSale.categoryList,
                images : model.inputs.createSale.images.map(elem => elem),
                inStock :true
            }
            saveMainCategory()
            model.data.items.push(newProduct);
            addNewItemToAuctionList(newProduct.id)
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
    updateView()
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

function deleteCategory(index){
    if(index == 0){
        model.inputs.createSale.categoryList[0] = ""
    }
    else{
        model.inputs.createSale.categoryList.splice(index,1)
    }
    updateView()
}

function changePriceLevels(value){
    model.inputs.category.priceRange.max = value
    updateView()
}

function setDeliveryMethod(deliveryType){
    model.inputs.checkOutPage.selectedDeliveryMethod = deliveryType;
    switch(deliveryType){
        case '1':
            model.inputs.checkOutPage.deliveryMethod.butikk = 'checked';
            model.inputs.checkOutPage.deliveryMethod.leveringMedInnbæring = '';
            model.inputs.checkOutPage.deliveryMethod.leveringUtenInnbæring = '';
            model.inputs.checkOutPage.frakt = 0;
            break;
        case '2':
            model.inputs.checkOutPage.deliveryMethod.butikk = '';
            model.inputs.checkOutPage.deliveryMethod.leveringMedInnbæring = 'checked';
            model.inputs.checkOutPage.deliveryMethod.leveringUtenInnbæring = '';
            model.inputs.checkOutPage.frakt = 400;
            break;
        case '3':
            model.inputs.checkOutPage.deliveryMethod.butikk = '';
            model.inputs.checkOutPage.deliveryMethod.leveringMedInnbæring = '';
            model.inputs.checkOutPage.deliveryMethod.leveringUtenInnbæring = 'checked';
            model.inputs.checkOutPage.frakt = 200;
            break;
    }
    updateView();
}

function cardSelected(cardIndex){
    model.inputs.checkOutPage.addNewCard = false;
    model.inputs.checkOutPage.cardNumber = model.data.users[model.app.userId].paymentInformation[cardIndex].cardNumber;
    model.inputs.checkOutPage.expirationDate = model.data.users[model.app.userId].paymentInformation[cardIndex].expirationDate;
    model.inputs.checkOutPage.cvc = model.data.users[model.app.userId].paymentInformation[cardIndex].cvc;
    model.inputs.checkOutPage.cardHolderFirstName = model.data.users[model.app.userId].paymentInformation[cardIndex].cardHolderFirstName;
    model.inputs.checkOutPage.cardHolderLastName = model.data.users[model.app.userId].paymentInformation[cardIndex].cardHolderLastName;
    updateView();
}

function addNewCardInCheckOut(){
    model.inputs.checkOutPage.addNewCard = true;
    model.inputs.checkOutPage.cardNumber = '';
    model.inputs.checkOutPage.expirationDate = '';
    model.inputs.checkOutPage.cvc = '';
    model.inputs.checkOutPage.cardHolderFirstName = '';
    model.inputs.checkOutPage.cardHolderLastName = '';
    updateView();
}
function clearShoppingCart(){
    if(model.app.loggedInStatus){
        model.data.users[model.app.userId].shoppingCart = [];
        model.inputs.checkOutPage.emptyShoppingCart = true;
    }
    else {
        model.inputs.shoppingCart.items.canBuyNow = [];
        model.inputs.checkOutPage.emptyShoppingCart = true;
    }
    updateView();
}
function increaseItemQuantity(itemIndex){
    if(model.app.loggedInStatus){
        model.data.users[model.app.userId].shoppingCart[itemIndex].quantity += 1;
    }
    else {
        model.inputs.shoppingCart.items.canBuyNow[itemIndex].quantity += 1;

    }
    updateView();
}

function decreaseItemQuantity(itemIndex){
    if(model.app.loggedInStatus){
        model.data.users[model.app.userId].shoppingCart[itemIndex].quantity -= 1;
        if(model.data.users[model.app.userId].shoppingCart[itemIndex].quantity < 1){
            model.data.users[model.app.userId].shoppingCart.splice(itemIndex, 1);
        }
    }
    else {
        model.inputs.shoppingCart.items.canBuyNow[itemIndex].quantity -= 1;
        if(model.inputs.shoppingCart.items.canBuyNow[itemIndex].quantity < 1){
            model.inputs.shoppingCart.items.canBuyNow.splice(itemIndex, 1);
        }
    }
    updateView();
}
            
function goToProduct(index){
    model.app.currentProduct = index;
    changeView("productPage");
    updateView()
}

function filterItems(){
    let filterArray = []
    model.data.items.forEach(item => {
        if (item.title.toLowerCase().includes(model.inputs.search.input.toLowerCase()) ||
            item.description.toLowerCase().includes(model.inputs.search.input.toLowerCase()) ||
            item.category.join(',').toLowerCase().split(',').includes(model.inputs.search.input.toLowerCase())) {
            if(item.inStock){
                filterArray.push(eval(item.id));
            }
        }
    });      
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
    filterArray = filterArray.filter(val =>{
        if(model.data.items[val-1].auction && model.inputs.category.filterAuctionCheck || !model.data.items[val-1].auction && model.inputs.category.filterNormalCheck){
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

let priceLimits = determinePriceLimits()
model.inputs.category.priceRange.max = priceLimits.max
model.inputs.category.priceRange.min = priceLimits.min

function showSelectedChat(key){
    model.app.showChatBox = key
    updateView()
}

function adminSendMessage(){
    if(model.inputs.adminMessagePage.adminMessage ==''){return}
    let newAdminMessage = {
        type : 'admin',
        message: model.inputs.adminMessagePage.adminMessage
    }
    model.data.users[model.app.showChatBox].messages.push(newAdminMessage);
    model.inputs.adminMessagePage.adminMessage = '';
    updateView()
}   

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

function convertTob64(image){
    return new Promise((resolve,reject)=>{
        let fr = new FileReader();
        fr.readAsDataURL(image)
        fr.onload = () => {
            resolve(fr.result)
        }
    })
}

async function uploadImg(event){
    let file = event.target.files[0];
    let b64 = await convertTob64(file);
    model.inputs.createSale.images.push(b64)
    updateView()
}

function raiseBid(productId){
    console.log(productId)
    const regexp = /^\d+$/;
    let dataItem = model.data.items.find(elem => elem.id == productId)
    if(!regexp.test(model.inputs.product.bidIncrease) || dataItem.price>model.inputs.product.bidIncrease){
        return
    }
    let item = model.data.auctionListe.find(elem => elem.itemId == productId)
    if(item === undefined){
        model.data.auctionListe.push({
            itemId:productId,
            bids:{}
        })
        item = model.data.auctionListe.find(elem => elem.itemId == productId)
    }
    
    if(!Object.keys(item.bids).includes(model.app.userId)){
        item.bids[model.app.userId]={
            bid:[parseInt(model.inputs.product.bidIncrease)],
            deleted:false,
            autoBid:0,
            vunnet:false
        }
    }
    else{
        item.bids[model.app.userId].bid.push(parseInt(model.inputs.product.bidIncrease))
    }
    model.inputs.product.bidIncrease = ""
    setDisplayPrice(productId)
    updateView()
}

function changeFrontPagePic(pos,change){
    if(pos == "top"){
        if(model.app.frontPageCurrentShowing.topPic + change >= 0 && model.app.frontPageCurrentShowing.topPic + change < model.data.items[model.data.frontPageTop[model.app.frontPageCurrentShowing.top]].images.length){
            model.app.frontPageCurrentShowing.topPic += change
        }
    }
    else{
        if(model.app.frontPageCurrentShowing.botPic + change >= 0 && model.app.frontPageCurrentShowing.botPic + change < model.data.items[model.data.frontPageBottom[model.app.frontPageCurrentShowing.bottom]].images.length){
            model.app.frontPageCurrentShowing.botPic += change
        }
    }
    updateView()
}

function navigateToPreviousPage(){
    let previousPage = model.app.pagesToNavigateTo[model.app.indexOfThePageAreOn-1];
    model.app.currentView = previousPage;
    if(model.app.indexOfThePageAreOn > 0){
        model.app.indexOfThePageAreOn = model.app.indexOfThePageAreOn-1;
    }
    
    updateView();
}

function navigateToNextPage(){
    let nextPage = model.app.pagesToNavigateTo[model.app.indexOfThePageAreOn+1];
    console.log(nextPage);
    model.app.currentView = nextPage;
    if(model.app.indexOfThePageAreOn < (model.app.pagesToNavigateTo.length-1)){
        model.app.indexOfThePageAreOn = model.app.indexOfThePageAreOn+1;
    }
    updateView();
}

function removeFromFrontPageDisplay(pos,i){
    let arr = pos == "top"?model.data.frontPageTop:model.data.frontPageBottom
    arr.splice(i,1)
    updateView()
}

function openAddProductMenu(pos){
    pos == "top"? model.inputs.adminFrontPage.showTopList = !model.inputs.adminFrontPage.showTopList:model.inputs.adminFrontPage.showBotList = !model.inputs.adminFrontPage.showBotList
    updateView()
}

function addProductToDisplay(i,pos){
    pos == "top"? model.data.frontPageTop.push(i):model.data.frontPageBottom.push(i)
    closeProductList(pos)
}

function closeProductList(pos){
    pos == "top"? model.inputs.adminFrontPage.showTopList = false:model.inputs.adminFrontPage.showBotList = false
    updateView()
}

function payAtTheCheckoutPage(){
    let newOrder = {};
    if(model.app.userId){
        model.data.users[model.app.userId].shoppingCart.forEach(itemInUserCart => {
            newOrder.itemId = parseInt(itemInUserCart.item);
            newOrder.paid = true;
            newOrder.date = new Date().toLocaleDateString();
            newOrder.userId = model.app.userId;
            model.data.items.forEach(itemInData => {
                if(parseInt(itemInData.id) == parseInt(itemInUserCart.item)){
                    newOrder.price = itemInData.price;
                    newOrder.type = !itemInData.auction ? 'direkte' : 'auction';
                    newOrder.image = itemInData.images[0];
                    newOrder.title = itemInData.title;
                }
            });
            model.data.orderHistory.push(newOrder);
        });
        model.data.users[model.app.userId].shoppingCart = []; 
    }
    model.inputs.shoppingCart.items.canBuyNow = [];
    setUsersDataForCheckOutPage();
    changeView("frontPage");
    updateView();
}

function populateCategoryInputs(){
    model.data.items.forEach(item => {
        let storedId;
        item.category.forEach((cat,i) => {
            let exists = false
            let parent = -1
            for(thing in model.inputs.category.categoryList){
                if(i==0){
                    parent = -1
                    if(thing.name == cat){
                        exists = true
                        break
                    }
                }
                else{
                    if(storedId !== undefined){
                        parent = storedId
                        exists = false
                        break
                    }
                    if(thing.name == cat && thing.parent != -1){
                        exists = true
                        break
                    }
                }
            }
            if(!exists){
                model.inputs.category.categoryList.push({
                    id:model.inputs.category.categoryList.length,
                    parent:parent,
                    name:cat,
                    checked:false
                })
                if(parent == -1){
                    storedId = model.inputs.category.categoryList.length-1
                }
            }
        })
    })
}


populateCategoryInputs()