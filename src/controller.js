//added line 5,6,7 to deleteItemFromShoppingCart function

function deleteItemFromShoppingCart(indexInShoppingCart){
    model.inputs.shoppingCart.items.canBuyNow.splice(indexInShoppingCart, 1);
    if(model.inputs.shoppingCart.items.canBuyNow.length == 0){
        model.inputs.checkOutPage.emptyShoppingCart = true;
    }
    updateView();
}

// added line 22 to addToShoppingCart function

function addToShoppingCart(productId){

    for(let i = 0; i < model.data.users[model.app.userId].shoppingCart.length;i++){
        if(model.data.users[model.app.userId].shoppingCart[i].id == productId){
            model.data.users[model.app.userId].shoppingCart[i].quantity++
            return
        }
    }
    model.data.users[model.app.userId].shoppingCart.push({id:productId,quantity:1})
    model.inputs.checkOutPage.emptyShoppingCart = false;
    updateView()
}

// New controller functions

// Add setUsersDataForCheckOutPage() function call in checkUserIdPassword() function just before break in master.


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
function setUsersDataForCheckOutPage(){
    for(let usersId in model.data.users){
        if(usersId == model.app.userId && usersId != "0000001"){
            model.inputs.checkOutPage.firstName = model.data.users[usersId].firstname;
            model.inputs.checkOutPage.lastName = model.data.users[usersId].surname;
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
        }
    }
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
