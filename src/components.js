function adminAuctionPage(){
    return `${model.data.users[model.app.userId].permissions == 'admin' ? 
                `
                <div>
                    ${påGåendeBud()}
                </div>
                <div>
                    ${auksjonerUtløptFrist()}
                </div>
                `: 
                ''
            }
        `;
}

function påGåendeBud(){
    let html = '';
    html = `<div>
                <h2>Pågående Bud</h2>
            </div>
            <div>
                <p>Items</p>
            </div>
            <div>
                <div>
                    <input type="search" placeholder="Søk for item her..." value="${model.inputs.adminAuctionPage.searchInput}" onchange="model.inputs.adminAuctionPage.searchInput = this.value; updateView()"/>
                    <button onclick="filteredItemsAdmin(); updateView()">Search</button>
                </div>
                <div>
                    ${generateCategoryElems(-1)}
                </div>
                <div>
                    ${filteredItemsAdminAuctionPage()}
                </div>
                ${model.inputs.adminAuctionPage.selectedItemId ? 
                    `
                    <div>
                    ${itemOnGoingAuctionDetails()}
                    </div>`:
                    ''
                }
                
            </div>
            `;
    return html;
}

function filteredItemsAdminAuctionPage(){
    filteredItemsAdmin();
    let html = '';
    if(!model.inputs.category.filteredItemsAdmin.includes(model.inputs.adminAuctionPage.selectedItemId)){
        model.inputs.adminAuctionPage.selectedItemId = null;
    }
    for(let i = 0; i < model.inputs.category.filteredItemsAdmin.length; i++){
        html += `
                <div onclick='model.inputs.adminAuctionPage.selectedItemId = ${model.inputs.category.filteredItemsAdmin[i]}; updateView()'>
                    <p>${model.data.items[model.inputs.category.filteredItemsAdmin[i]-1].title}</p>
                </div>
                `;
    }
    return html;
}

function itemOnGoingAuctionDetails(){
    let html = '';
    let findAuctionDeadline = new Date(model.data.items[model.inputs.adminAuctionPage.selectedItemId-1].deadline).toLocaleDateString();
    let highestBid = 0;
    let highestBidGiver= {id: '', name: '', email: '', mobile: ''};
    let antallDeltaker = 0;
    model.inputs.adminAuctionPage.userIdsToSendMessage = [];
    model.data.auctionListe.forEach(item =>{
        if(eval(item.itemId) ==  model.inputs.adminAuctionPage.selectedItemId){
            for(userId in item.bids){
                antallDeltaker++;
                model.inputs.adminAuctionPage.userIdsToSendMessage.push(userId);
                if(item.bids[userId].bid[item.bids[userId].bid.length-1] > highestBid){
                    highestBid = item.bids[userId].bid[item.bids[userId].bid.length-1];
                    highestBidGiver.id = userId;
                }
            }
        }
    });
    // if(!highestBid) return html;
    for(let userId in model.data.users){
        if(userId == highestBidGiver.id){
            highestBidGiver.name = model.data.users[userId].firstname + ' ' + model.data.users[userId].surname;
            highestBidGiver.email = model.data.users[userId].email;
            highestBidGiver.mobile = model.data.users[userId].mobile;
        }
    }
    html += `
            <div>
                <div>
                    <table border = 1>
                        <tr>
                            <th>Bud Frist</th>
                            <th>Høyeste Bud</th>
                            <th>Høyeste Bud Giver</th>
                            <th>Antall av deltakerne</th>
                        </tr>
                        <tr>
                            <td>${findAuctionDeadline}</td>
                            <td>${highestBid}</td>
                            <td>
                                Navn: ${highestBidGiver.name}<br/>
                                E-post: ${highestBidGiver.email}<br/>
                                Mobil: ${highestBidGiver.mobile}
                            </td>
                            <td>${antallDeltaker}</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <div>
                        <p>Endre bud frist</p>
                        <input type="date" value="${model.data.items[model.inputs.adminAuctionPage.selectedItemId-1].deadline.substring(0, 10)}"
                        onchange="changeDeadlineAdminAuctionPage(${model.inputs.adminAuctionPage.selectedItemId-1}, this.value)"
                        />
                    </div>
                    <div>
                        <button onclick="model.app.currentProduct = ${model.inputs.adminAuctionPage.selectedItemId-1}; changeView('productPage'); updateView() ">Gå til Item side</button>
                    </div>
                    <div>
                        <p>Endre til kjøpre nå vare</p>
                        <button onclick="model.data.items[${model.inputs.adminAuctionPage.selectedItemId-1}].auction = false; model.inputs.adminAuctionPage.selectedItemId = null; updateView()">Endre</button>
                    </div>
                    <div>
                        <p>Send Melding til alle deltakerne</p>
                        <input type="text" placeholder="Type here to chat..." maxlength="200" autocomplete="off"
                               value="${model.inputs.adminAuctionPage.messageToUsers}"
                               onchange="model.inputs.adminAuctionPage.messageToUsers = this.value; updateView()"
                        />
                        <button ${model.inputs.adminAuctionPage.messageToUsers ? '' : 'disabled'} onclick="sendMessageAsAdmin()">Send</button>
                    </div>
                </div>
            </div>
            `;
    return html;
}

function auksjonerUtløptFrist(){
    let html = '<h2>Auksjoner med utløpt frist.</h2>';
    model.inputs.adminAuctionPage.itemsUtløptFrist = findItemsUtløptFrist();
    if(model.inputs.adminAuctionPage.itemsUtløptFrist.length == 0) html += '<p>Ingen varer.</p>';
    else {
        model.inputs.adminAuctionPage.itemsUtløptFrist.forEach(itemsId => {
            html+= `
                    <div onclick="model.inputs.adminAuctionPage.selectedUtløptFristItemsId = ${itemsId}; updateView()">
                        <p>${model.data.items[itemsId-1].title}</p>
                    </div>
                   `;
        });
        if(model.inputs.adminAuctionPage.selectedUtløptFristItemsId){
            let findAuctionDeadline = new Date(model.data.items[model.inputs.adminAuctionPage.selectedUtløptFristItemsId-1].deadline).toLocaleDateString();
            let highestBid = 0;
            let highestBidGiver= {id: '', name: '', email: '', mobile: ''};
            model.data.auctionListe.forEach(item =>{
                if(eval(item.itemId) ==  model.inputs.adminAuctionPage.selectedUtløptFristItemsId){
                    for(userId in item.bids){
                        if(item.bids[userId].bid[item.bids[userId].bid.length-1] > highestBid){
                            highestBid = item.bids[userId].bid[item.bids[userId].bid.length-1];
                            highestBidGiver.id = userId;
                        }
                    }
                }
            });
            for(let userId in model.data.users){
                if(userId == highestBidGiver.id){
                    highestBidGiver.name = model.data.users[userId].firstname + ' ' + model.data.users[userId].surname;
                    highestBidGiver.email = model.data.users[userId].email;
                    highestBidGiver.mobile = model.data.users[userId].mobile;
                }
            }
            html += `
                        <div>
                            <table border = 1>
                                <tr>
                                    <th>Utløpsdato</th>
                                    <th>Høyeste Bud</th>
                                    <th>Høyeste Bud giver</th>
                                </tr>
                                <tr>
                                    <td>${findAuctionDeadline}</td>
                                    <td>${highestBid}</td>
                                    <td>
                                        Navn: ${highestBidGiver.name}<br/>
                                        E-post: ${highestBidGiver.email}<br/>
                                        Mobile: ${highestBidGiver.mobile}<br/>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div>
                            <p>Legge vare til brukerens handlekurv</p>
                            <button onclick="AddToUsersShoppingCartAdmin(${highestBidGiver.id}, ${highestBid})">Legg til</button>
                        </div>
                    `;
        }
    }
    return html;
}

function generateCategoryElems(parentId){
    let html = ""
    for(let i = 0; i<model.inputs.category.categoryList.length; i++){
        if(model.inputs.category.categoryList[i].parent==parentId){
            html += `
                <div>
                    <label>${model.inputs.category.categoryList[i].name}</label>
                    <input type = "checkbox" ${model.inputs.category.categoryList[i].checked? "checked":""} onchange = "checkFilterBox(${i})"/>
                    ${model.inputs.category.categoryList[i].checked? generateCategoryElems(model.inputs.category.categoryList[i].id):""}
                </div>`
        }
    }
    return html
}

