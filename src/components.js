//Added line 6,7,8 to showItemsCanBuyNow function

function showItemsCanBuyNow(){
    let html = '';
    model.inputs.shoppingCart.totalPrice = 0;
    if (model.inputs.shoppingCart.items.canBuyNow.length == 0) {
        html = 'You do not have any items in the shopping cart.';
    }
   else{
        for(let j = 0; j < model.inputs.shoppingCart.items.canBuyNow.length; j++){
            for(let i = 0; i < model.data.items.length; i++){
                if(model.inputs.shoppingCart.items.canBuyNow[j].id === model.data.items[i].id){
                    html += `<div>
                                <img src="${model.data.items[i].images[0]}" />
                                <span>${model.data.items[i].title}</span>
                                <button onclick="deleteItemFromShoppingCart(${j})">X</button>
                                <span>${model.data.items[i].price}</span>
                            </div>`;
                    
                    model.inputs.shoppingCart.totalPrice += model.data.items[i].price;
                }
            }
        }
    }
    return html;   
}

// New components functions


function checkOut(){
    let html = '';
    if(model.app.userId == '0000001') return '';
    html = /*html*/
            `
                <div class= "checkOutComponentContainer">
                    <div class="checkOutLeftSideContainer">
                        ${model.inputs.checkOutPage.emptyShoppingCart ? 
                            '' :
                            `
                                <div class="checkOutAddress">
                                    <p>Hvem skal orden sendes til?</p>
                                    ${model.app.loggedInStatus ? 
                                        '' : 
                                        '<p><span onclick="loginDropDown()">Logg inn </span>eller fortsett under. Du kan opprette en konto etter at du har betalt.</p>'
                                    }
                                    <p>Fornavn: <input type="text" value="${model.inputs.checkOutPage.firstName}" onchange="model.inputs.checkOutPage.firstName = this.value, updateView()"/></p>
                                    <p>Etternavn: <input type="text" value="${model.inputs.checkOutPage.lastName}" onchange="model.inputs.checkOutPage.lastName = this.value, updateView()"/></p>
                                    <p>Addresse: <input type="text" value="${model.inputs.checkOutPage.address}" onchange="model.inputs.checkOutPage.address = this.value, updateView()"/></p>
                                    <p>Zip: <input type="text" value="${model.inputs.checkOutPage.zipCode}" onchange="model.inputs.checkOutPage.zipCode = this.value, updateView()"/></p>
                                    <p>E-post: <input type="text" value="${model.inputs.checkOutPage.email}" onchange="checkValidityOfEmail(this.value)"/></p>
                                    ${model.app.checkOut.invalidEmailOnCheckOutPage ? '<p style="color: red;">Invalid E-post</p>' : ''}
                                    <p>Mobil: <input type="text" value="${model.inputs.checkOutPage.mobile}" onchange="model.inputs.checkOutPage.mobile = this.value, updateView()"/></p>
                                    ${!model.inputs.checkOutPage.firstName ||
                                    !model.inputs.checkOutPage.lastName ||
                                    !model.inputs.checkOutPage.address ||
                                    !model.inputs.checkOutPage.zipCode ||
                                    !model.inputs.checkOutPage.email ||
                                    model.app.checkOut.invalidEmailOnCheckOutPage ||
                                    !model.inputs.checkOutPage.mobile ?
                                        '<p style="color: red;">Fyll ut alle feltene.</p>' :
                                        `<button onclick="model.inputs.checkOutPage.addressFilled = true, updateView()">Fortsett</button>`
                                    }
                                </div>
                                ${model.inputs.checkOutPage.addressFilled ?
                                    `
                                        <div class="checkOutDeliveryMethod">
                                                <p>Velg en leveringsmetode:</p>
                                                <form>
                                                <input type="checkbox" id="deliveryOption1" name="deliveryOption1" value="1" onchange= "setDeliveryMethod(this.value)" ${model.inputs.checkOutPage.deliveryMethod.butikk}/>
                                                <label for="deliveryOption1">Hent i butikk - Gratis</label><br>
                                                <input type="checkbox" id="deliveryOption2" name="deliveryOption2" value="2" onchange= "setDeliveryMethod(this.value)" ${model.inputs.checkOutPage.deliveryMethod.leveringMedInnbæring}/>
                                                <label for="deliveryOption2">Levering med innbæring - 400kr</label><br>  
                                                <input type="checkbox" id="deliveryOption3" name="deliveryOption3" value="3" onchange= "setDeliveryMethod(this.value)" ${model.inputs.checkOutPage.deliveryMethod.leveringUtenInnbæring}/>
                                                <label for="deliveryOption3">Levering uten innbæring - 200kr</label><br>
                                                </form>
                                                ${model.inputs.checkOutPage.selectedDeliveryMethod ?
                                                    `<button onclick="model.inputs.checkOutPage.deliveryMethod.selected = true, updateView()">Fortsett</button>` :
                                                    ''  
                                                }
                                        </div> 
                                    `:
                                    ''
                                }
                                ${model.inputs.checkOutPage.deliveryMethod.selected ?
                                    `
                                        <div class="checkOutPaymentMethod">
                                            ${model.app.loggedInStatus ? 
                                                selectCard() : 
                                                `<p>Card Number: <input type="text" value="${model.inputs.checkOutPage.cardNumber}" onchange="model.inputs.checkOutPage.cardNumber = this.value, updateView()"/></p>
                                                <p>Expiration Date: <input type="text" value="${model.inputs.checkOutPage.expirationDate}" onchange="model.inputs.checkOutPage.expirationDate = this.value, updateView()"/></p>
                                                <p>cvc: <input type="text" value="${model.inputs.checkOutPage.cvc}" onchange="model.inputs.checkOutPage.cvc = this.value, updateView()"/></p>
                                                <p>Card Holders First Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderFirstName}" onchange="model.inputs.checkOutPage.cardHolderFirstName = this.value, updateView()"/></p>
                                                <p>Card Holders Last Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderLastName}" onchange="model.inputs.checkOutPage.cardHolderLastName = this.value, updateView()"/></p>
                                                `
                                            }
                                        </div>
                                    `: 
                                    ''
                                }
                                ${!model.inputs.checkOutPage.cardNumber ||
                                !model.inputs.checkOutPage.expirationDate ||
                                !model.inputs.checkOutPage.cvc ||
                                !model.inputs.checkOutPage.cardHolderFirstName ||
                                !model.inputs.checkOutPage.cardHolderLastName ?
                                        '' :
                                        '<button>Betal</button>'
                                }
                            `
                        }
                    </div>
                    <div class="checkOutRightSideContainer">
                        ${model.inputs.checkOutPage.emptyShoppingCart ? 
                            '<p>Du har ingenting i handlevogn.</p>' :
                            betalingsOversikt()
                        } 
                    </div>
                </div>
            `;

    return html;
}
function selectCard(){
    let html= '';
    if (model.data.users[model.app.userId].paymentInformation[0].cardNumber.length < 1){
        html = `
            <p>Card Number: <input type="text" value="${model.inputs.checkOutPage.cardNumber}" onchange="model.inputs.checkOutPage.cardNumber = this.value, updateView()"/></p>
            <p>Expiration Date: <input type="text" value="${model.inputs.checkOutPage.expirationDate}" onchange="model.inputs.checkOutPage.expirationDate = this.value, updateView()"/></p>
            <p>cvc: <input type="text" value="${model.inputs.checkOutPage.cvc}" onchange="model.inputs.checkOutPage.cvc = this.value, updateView()"/></p>
            <p>Card Holders First Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderFirstName}" onchange="model.inputs.checkOutPage.cardHolderFirstName = this.value, updateView()"/></p>
            <p>Card Holders Last Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderLastName}" onchange="model.inputs.checkOutPage.cardHolderLastName = this.value, updateView()"/></p>
        `;
    }
    else {
        html = '<p>Velg kort:</p>';
        if(!model.inputs.checkOutPage.addNewCard){
            for(let i = 0; i < model.data.users[model.app.userId].paymentInformation.length; i++){
                let lastFourDigitOfCard = parseInt(model.data.users[model.app.userId].paymentInformation[i].cardNumber.split('').splice(8,4).join(''));
                html += `
                    <div onclick="cardSelected(${i})">
                        <p>Kort Nummer: ****-****-${lastFourDigitOfCard}
                        ${checkCardValidTil(i)}
                    </div>
                `;
            }
        }
        html += `<button onclick="addNewCardInCheckOut()">Legg til nytt kort</button>`;
        if(model.inputs.checkOutPage.addNewCard){
            html += `
                    <p>Card Number: <input type="text" value="${model.inputs.checkOutPage.cardNumber}" onchange="model.inputs.checkOutPage.cardNumber = this.value, updateView()"/></p>
                    <p>Expiration Date: <input type="text" value="${model.inputs.checkOutPage.expirationDate}" onchange="model.inputs.checkOutPage.expirationDate = this.value, updateView()"/></p>
                    <p>cvc: <input type="text" value="${model.inputs.checkOutPage.cvc}" onchange="model.inputs.checkOutPage.cvc = this.value, updateView()"/></p>
                    <p>Card Holders First Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderFirstName}" onchange="model.inputs.checkOutPage.cardHolderFirstName = this.value, updateView()"/></p>
                    <p>Card Holders Last Name: <input type="text" value="${model.inputs.checkOutPage.cardHolderLastName}" onchange="model.inputs.checkOutPage.cardHolderLastName = this.value, updateView()"/></p>
 
            `;
        }
    }
    return html;
}
function checkCardValidTil(cardIndex){
    let html='';
    let todaysDateArray = new Date().toISOString().substring(0,7).split('-');
    let cardValiditTil = model.data.users[model.app.userId].paymentInformation[cardIndex].expirationDate.split('/');
    if(parseInt(todaysDateArray[0].substring(2,2)) > parseInt(cardValiditTil[1]) ||
        (parseInt(todaysDateArray[0].substring(2,2)) == parseInt(cardValiditTil[1]) && parseInt(todaysDateArray[1]) > parseInt(cardValiditTil[0]))){
            html = '<p>Card is not valid</p>';
        }
    else {
        html = '<p>Card is valid</p>';
    }
    return html;
}
function betalingsOversikt(){
    let html = '<h3>Betalingsoversikt</h3>';
    model.inputs.checkOutPage.totalPrice = 0;
    if(model.app.loggedInStatus){
        for(let i = 0; i < model.data.users[model.app.userId].shoppingCart.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.data.users[model.app.userId].shoppingCart[i].item == model.data.items[j].id){
                    model.inputs.checkOutPage.totalPrice += (model.data.items[j].price * model.data.users[model.app.userId].shoppingCart[i].quantity);
                    html += `
                        <div>
                            <p>${model.data.items[j].title}</p>
                            <button onclick="increaseItemQuantity(${i})">+</button> ${model.data.users[model.app.userId].shoppingCart[i].quantity} <button onclick="decreaseItemQuantity(${i})">-</button>
                            <p>${model.data.items[j].price * model.data.users[model.app.userId].shoppingCart[i].quantity}</p>
                        </div>
                    `;
                }
            }
        }
        html += `
                <div>
                    <div>
                        <p>Frakt - </p>
                        <p>${model.inputs.checkOutPage.frakt}</p>
                    </div>
                    <div>
                        <p>Total moms</p>
                        <p>${model.inputs.checkOutPage.totalPrice * 0.25}</p>
                    </div>
                    <div>
                        <p>Total Nok</p>
                        <p>${model.inputs.checkOutPage.totalPrice + (model.inputs.checkOutPage.totalPrice * 0.25) + model.inputs.checkOutPage.frakt}</p>
                    </div>
                </div>
                `;
        
    }
    else {
        for(let i = 0; i < model.inputs.shoppingCart.items.canBuyNow.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.inputs.shoppingCart.items.canBuyNow[i].id == model.data.items[j].id){
                    model.inputs.checkOutPage.totalPrice += (model.data.items[j].price * model.inputs.shoppingCart.items.canBuyNow[i].quantity);
                    html += `
                        <div>
                            <p>${model.data.items[j].title}</p>
                            <button onclick="increaseItemQuantity(${i})">+</button> ${model.inputs.shoppingCart.items.canBuyNow[i].quantity} <button onclick="decreaseItemQuantity(${i})">-</button>
                            <p>${model.data.items[j].price * model.inputs.shoppingCart.items.canBuyNow[i].quantity}</p>
                        </div>
                    `;
                }
            }
        }
         html += `
                <div>
                    <div>
                        <p>Frakt - </p>
                        <p>${model.inputs.checkOutPage.frakt}</p>
                    </div>
                    <div>
                        <p>Total moms</p>
                        <p>${model.inputs.checkOutPage.totalPrice * 0.25}</p>
                    </div>
                    <div>
                        <p>Total Nok</p>
                        <p>${model.inputs.checkOutPage.totalPrice + (model.inputs.checkOutPage.totalPrice * 0.25) + model.inputs.checkOutPage.frakt}</p>
                    </div>
                </div>
                `;
    }
    return html;
}
