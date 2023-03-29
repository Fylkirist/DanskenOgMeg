const app = document.getElementById("app");
updateView();
function updateView(){
    app.innerHTML = "";
    switch(model.app.currentView){
        case "frontPage":
            app.innerHTML = createHeaderSection() + showFilterBox() + showFrontPageProducts();
            break
        case "filteredPage":
            app.innerHTML = showFilterBox()
            break
        case "registerPage":
            app.innerHTML = '';
            break
        case "handlevognPage":
            app.innerHTML = showShoppingCart();
            break;
    }
}

function showShoppingCart(){

    let html= '';

    html = /*html*/`
        <div class="handlevognContainer">
            <div>
                <div class="handlevognHeader">Handlevogn</div>
                <p>Varer du kan kjøpe nå -</p><span onclick="clearShoppingCart()"></span>
                <div class="horizontalLines">
                    <span>Pris</span>
                </div>
                <div class="allItemsCanBuy">
                ${showItemsCanBuyNow()}
                </div>
                <div class="totalPrice">
                    <span>Total</span>
                    <span>${model.inputs.shoppingCart.totalPrice}</span>
                    <button onclick="changeView('checkoutPage')">Gå til kassen</button>

                </div>
                ${model.app.loggedInStatus ? `
                    <h3>Auksjoner du har bud på:</h3>
                    <div>
                        <span>Vinnene bud</span>
                    </div>
                    <div>${showWinningBids()}</div>
                    <div>
                        <span>Tapende bud</span>
                    </div>
                    <div>${showLosingBids()}</div>` 
                : ''}
            </div>
        </div>
    `;
    return html;
}

function showItemsCanBuyNow(){
    let html = '';
    model.inputs.shoppingCart.totalPrice = 0;
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
    return html;   
}

function showWinningBids(){
    let html='';

    findWinningBids();

    if(model.inputs.shoppingCart.items.auctions.usersWinningBids.length == 0) return '';

    else {

        html += `<div>`;

        for (let i = 0; i < model.inputs.shoppingCart.items.auctions.usersWinningBids.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id === model.data.items[j].id){
                    html += `
                            <img src="${model.data.items[j].images[0]}" />
                            <span>${model.data.items[j].title}</span>
                            ${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].deleted ? 'Du trukket bud.' : `
                                <button onclick="trekkBud(${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id}, 
                                                        ${model.app.userId})"
                                >Trekk bud</button>
                                <span>Bud: ${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid}</span>
                                <span>Stenges om : ${calculateDeadline(model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id)}</span>
                                <input  type="number" 
                                        min="${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid}" 
                                        step= 100
                                        value="${model.inputs.shoppingCart.items.auctions.increasedWinningBid || ''}" 
                                        
                                        onchange="model.inputs.shoppingCart.items.auctions.increasedWinningBid = this.value, updateView()"
                                />
                                <button
                                    ${model.inputs.shoppingCart.items.auctions.increasedWinningBid > model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid ? '' : 'disabled'}
                                    onclick="increaseBid(${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id}, ${model.app.userId}, ${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid}, ${model.inputs.shoppingCart.items.auctions.increasedWinningBid})"
                                >Øk bud</button>
                            `}
                        </div>
                        `;
                }
            }
        }
        return html;
    }
}
function showLosingBids(){

    let html='';

    findWinningBids();

    if(model.inputs.shoppingCart.items.auctions.usersLosingBids.length == 0) return '';

    else {

        html += `<div>`;

        for (let i = 0; i < model.inputs.shoppingCart.items.auctions.usersLosingBids.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id === model.data.items[j].id){
                    html += `
                            <img src="${model.data.items[j].images[0]}" />
                            <span>${model.data.items[j].title}</span>
                            ${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].deleted ? 'Du trukket bud.' : `
                                <button onclick="trekkBud(${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id}, 
                                                        ${model.app.userId})"
                                >Trekk bud</button>
                                <span>Nåværende bud: ${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid}</span>
                                <span>Stenges om : ${calculateDeadline(model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id)}</span>
                                <input  type="number" 
                                        min="${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid}" 
                                        step= 100
                                        value="${model.inputs.shoppingCart.items.auctions.increasedWinningBid || ''}" 
                                        
                                        onchange="model.inputs.shoppingCart.items.auctions.increasedWinningBid = this.value, updateView()"
                                />
                                <button
                                    ${model.inputs.shoppingCart.items.auctions.increasedWinningBid > model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid ? '' : 'disabled'}
                                    onclick="increaseBid(${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id}, ${model.app.userId}, ${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid}, ${model.inputs.shoppingCart.items.auctions.increasedWinningBid})"
                                >Øk bud</button>
                            `}
                        </div>
                        `;
                }
            }
        }
        return html;
    }
}

function calculateDeadline(itemsId){
    let setDeadline;
    let html = '';
    for (let item of model.data.items){
        if(item.id == itemsId){
            setDeadline = item.deadline;
        }
    }
    let miliSecondsRemaining = parseInt(new Date(setDeadline) - new Date());
    let daysRemaining = parseInt(miliSecondsRemaining/(1000*60*60*24));
    let hoursRemaining = parseInt(((miliSecondsRemaining/(1000*60*60*24)) - daysRemaining) * 24);
    let minutesRemaining = parseInt(((((miliSecondsRemaining/(1000*60*60*24)) - daysRemaining) * 24) - hoursRemaining) * 60);
    let secondsRemaining = parseInt(((((((miliSecondsRemaining/(1000*60*60*24)) - daysRemaining) * 24) - hoursRemaining) * 60) - minutesRemaining) * 60);

    if (miliSecondsRemaining > 1000){
        html = `
                ${daysRemaining} dager og ${hoursRemaining} timer og ${minutesRemaining} minutter.
        
             `;
    }
    else {
        html = 'Bud er stengt.'
        
    }
    return html;
}

let countDown;
