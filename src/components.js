function activeAuctionList() {
  let auksjonsliste = ``
  
  model.data.items.forEach((item) => {
    if (item.auction && item.inStock) {
        const auctionID = item.id;
        const auction = model.data.auctionListe.find(a => a.itemId === auctionID);
        const bids = auction ? auction.bids : {};
        const userIDs = Object.keys(bids);
        let maxbid = 0;
        let maxBidUser;
        const bidDeleted = bids?.[model.app.userId]?.deleted ?? false;
        // Skriver ut date + time, må desverre skrive det her og ellers må jeg bruke alt for mye getelementByID i auctioncontroller...
        const deadline = new Date(item.deadline).getTime()
        let clock = '';
        if (deadline > new Date().getTime()) {
        item.timerValue = deadline
        let miliSecondsRemaining = deadline - new Date().getTime()
        let daysRemaining = parseInt(miliSecondsRemaining / (1000 * 60 * 60 * 24))
        let hoursRemaining = parseInt(((miliSecondsRemaining / (1000 * 60 * 60 * 24)) - daysRemaining) * 24)
        let minutesRemaining = parseInt((((miliSecondsRemaining / (1000 * 60 * 60 * 24)) - daysRemaining) * 24 - hoursRemaining) * 60)
        let secondsRemaining = parseInt((((((miliSecondsRemaining / (1000 * 60 * 60 * 24)) - daysRemaining) * 24) - hoursRemaining) * 60 - minutesRemaining) * 60);

        clock = `
        ${daysRemaining} dager og ${hoursRemaining} timer og ${minutesRemaining} minutter. sekunder: ${secondsRemaining}
        `
        }
         // vi finner høyest bud og ledende bruker
         Object.keys(bids).forEach((userID) => {
            const userBid = bids[userID].bid[bids[userID].bid.length - 1];
            if (userBid > maxbid) {
                  maxbid = userBid;
                  maxBidUser = model.data.users[userID] ? model.data.users[userID].username : 'unknown';
                  item.price = maxbid;
                }
              });
              
              auksjonsliste += `
              <div class="auctionItem">
              <div class="auctionItem-info">
                <h3>${item.title}</h3>
                <img src="${item.images[0]}">
                <div>${item.description}</div>
                <div><h4>Ledende Bud: ${item.price}</h4></div>
                <div>Ledende bruker: ${maxBidUser ? maxBidUser : 'Det er ingen bud for øyeblikket'}</div>
                <div class="auction" id="auction-${auctionID}">
                  <p>Tid igjen: <span id="deadline-${item.id}">${clock}</span></p>
                </div>`
                if (bidDeleted) {
                    auksjonsliste += `<div> Du har avsluttet Auksjonen!</div>`;

                  } else {
                    auksjonsliste += `
                      <div class="auctionItem-buttons">
                        <button onclick="activeAuctionController('${auctionID}','minbud')"> Øk med min bud:' ${item.minBid} '</button>
                        <button onclick="activeAuctionController('${auctionID}','delete')">Slett bud</button>
                      </div>
                      <div class="input-fields">
                        <input type="number" placeholder="Sett manuelt bud" onchange="activeAuctionController('${auctionID}','manuelt', this.value)">
                        <input type="number" placeholder="Sett automatisk bud" onchange="activeAuctionController('${auctionID}','automatic', this.value )">
                        <input type="number" placeholder="Endre automatiskBud" onchange="activeAuctionController('${auctionID}','editAuto', this.value)">
                      </div>
                      <div><p>Ditt autobud er : ${bids[model.app.userId]?.autoBid ?? '0'}</p></div>
                      `;
                  }
                  
                  auksjonsliste += `</div>`;
            
                  
                  
      
            // Sjekker over userid hvis det er likt som userId tegner vi opp de aktive auction

            if (userIDs.includes(model.app.userId)) {
                const userBids = bids[model.app.userId];
                let budListe = "";
                userBids.bid.forEach((budMengde, index) => {
                    budListe += `<div>Bud: ${index + 1}: ${budMengde}</div>`;
                });
                auksjonsliste += `
                <div class="user-auction-info">
                    <div>Du har totalt: ${userBids.bid.length} bud:</div>
                    <div id="user-bids-${auctionID}">
                        ${budListe}
                    </div>
                </div>`;
             
            // går igjennom bud arrayet i auctionListen, teller bud + budmengde!
                userBids.bid.forEach((budMengde, index) => {
                    budListe += `<div>Bud: ${index + 1}: ${budMengde}</div>`;
                });
            //skriver ut alt!!
             
            }
        }
      }
    );
    setInterval(updateAllTimers, 1000);
  const html = `
    <div class="auction-container">
      <div class="buttonAuctionStart">
      <button onclick="changeView('auctionPage')">Dine Aktive Auksjoner</button> 
      <button onclick="changeView('endedAuctions')"> Dine Avsluttende auksjoner</button>
      </div>
      ${auksjonsliste || '<div>Du har ingen aktive Auksjoner</div>'}
      </div>
    `;
    
  return html;
    }


function avsluttendeAuksjoner(){
    let html = ``;

    model.data.auctionListe.forEach((auction) => {
      const auksjonId = auction.itemId
      const bid = auction.bids;
      const userId = Object.keys(bid)
      const item = model.data.items.find((item) => item.id === auksjonId)
     

      
      if (userId.includes(model.app.userId) && !item.inStock){
        const item = model.data.items.find((item) => item.id === auksjonId);
           html +=`
           <div class="auctionItem">
           <div class="auctionItem-info">
           <div class="containerForAvsluttendeAuksjoner">
           <h3>${item.title}</h3>
           <div>${item.description}</div>
           <div>Siste bud: ${item.price}</div>
           <img src="${item.images[0]}">
           <div>Auksjonen ble avsluttet : ${item.deadline}</div>
         </div>
         </div>
         </div>`
        
         if(auction.bids[model.app.userId].vunnet){
          html+= `<h4>Vinner!!!</h4><button onclick="changeView('checkoutPage')"> Betal nå! </button>`
          addToOrderHistory(auksjonId,model.app.userId)
          addToShoppingCart(auksjonId);


         }
        
        
      }
    })
    const view = `
    <div class="auction-container">
    <div class="buttonAuctionStart">
      <button onclick="changeView('auctionPage')">Dine Aktive Auksjoner</button> 
      <button onclick="changeView('endedAuctions')"> Dine Avsluttende auksjoner</button>
      </div>
    ${html || '<div>Du har ingen avsluttende Auksjoner</div>'}
    </div>`;
     return view;
  }
  
function adminAuctionPage(){
    return `${model.data.users[model.app.userId].permissions == 'admin' ? 
                `
                <div>
                    ${ongoingAuctions()}
                </div>
                <div>
                    ${showExpiredAuctions()}
                </div>
                `: 
                ''
            }
        `;
}

function renderFrontPageAdminSettings(){
    return `
        <div id = "frontPageSettingsContainer">
            <div id = "frontPageTopSettings">
                <div id = "frontPageTopAddProduct">
                    ${model.inputs.adminFrontPage.showTopList?
                        showAddProductList('top'):`
                        <div class = "frontPageAddDisplay" onclick = "openAddProductMenu('top')">Legg til produkt</div>
                    `}
                </div>
                ${model.data.frontPageTop.map((elem,i) =>{
                    return `
                        <div class = "frontPageSettings">
                            ${model.data.items[elem].title}
                            <img class = "frontPageSettingsTopPic" src = "${model.data.items[elem].images[0]}"/>
                            <button onclick = "removeFromFrontPageDisplay('top',${i})">Fjern fra forside</button>
                        </div>`
                }).join("")}
            </div>
            <div id = "frontPageBotSettings">
                <div id = "frontPageBotAddProduct">
                ${model.inputs.adminFrontPage.showBotList?
                    showAddProductList('bot'):`
                    <div class = "frontPageAddDisplay" onclick = "openAddProductMenu('bot')">Legg til produkt</div>
                `}
                </div>
                ${model.data.frontPageBottom.map((elem,i) =>{
                    return`
                        <div>
                            ${model.data.items[elem].title}
                            <img class = "frontPageSettingsBotPic" src = "${model.data.items[elem].images[0]}"/>
                            <button onclick = "removeFromFrontPageDisplay('bot',${i})">Fjern fra forside</button>
                        </div>`
                }).join("")}
            </div>
        </div>
    ` 
}

function showAddProductList(pos) {
    let arr = pos === "top" ? model.data.frontPageTop : model.data.frontPageBottom;
    let auction = pos === "top" ? true:false
    return `
        <div class="frontPageAddProductList">
            <button onclick="closeProductList('${pos}')">Cancel</button>
            ${model.data.items.map((item, i) => {
                    return arr.includes(i) || item.auction != auction ? "" : `
                <div>
                    <label onmouseleave = "updateView()" onmouseenter="addProductDisplayHover(this.parentElement, ${i})">${item.title}</label>
                    <button onclick="addProductToDisplay(${i},'${pos}')">Legg til</button>
                </div>`;
            }).join("")}
        </div>
    `;
}

function addProductDisplayHover(element, i) {
    let item = model.data.items[i];
    let hoverDiv = document.createElement('div');
    hoverDiv.className = "frontPageSettingsHoverDiv"
    hoverDiv.innerHTML = `
        <h3 class = "frontPageSettingsHoverTitle">${item.title}</h3>
        <img class = "frontPageSettingsHoverImg" src="${item.images[0]}"/>
        <p class = "frontPageSettingsHoverType" >${item.auction ? "Auksjonsvare" : "Fastprisvare"}</p>
        <p class = "frontPageSettingsHoverPrice" >Pris: ${item.price}</p>
    `;
    hoverDiv.onmouseleave = function() {
        this.parentNode.removeChild(this);
    };
    element.appendChild(hoverDiv);
}

function ongoingAuctions(){
    return `<div>
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
    for(let userId in model.data.users){
        if(userId == highestBidGiver.id){
            highestBidGiver.name = model.data.users[userId].firstName + ' ' + model.data.users[userId].surName;
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

function showExpiredAuctions(){
    let html = '<h2>Auksjoner med utløpt frist.</h2>';
    model.inputs.adminAuctionPage.itemsUtløptFrist = findItemsExpiredDeadline();
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
                highestBidGiver.name = model.data.users[userId].firstName + ' ' + model.data.users[userId].surName;
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
                <div class = "filterBoxCategoryElem">
                    <input class = "filterBoxCategoryCheck" type = "checkbox" ${model.inputs.category.categoryList[i].checked? "checked":""} onchange = "checkFilterBox(${i})"/>
                    <label class = "filterBoxCategoryElemLabel">${model.inputs.category.categoryList[i].name}</label>
                </div>
                <div class="subcategoryContainer">${model.inputs.category.categoryList[i].checked? generateCategoryElems(model.inputs.category.categoryList[i].id):""}</div>`
        }
    }
    return html
}


 function adminMembersPage(){
    let html = '';
    if(!model.app.userId || (model.app.userId && model.app.userId != "0000001")) return html;
    html = `
            <div>
                <h2>Medlemmer:</h2>
                <div>
                    ${showAllMembers()}
                </div>
            </div>
            <div>
                ${membersInformation()}
            </div>
        `;
    return html;
}

function showAllMembers(){
    let html = '';
    for(let usersId in model.data.users){
        if(model.data.users[usersId].permissions != "admin"){
            html += `
                    <div onclick="model.inputs.adminMembersPage.selectedUsersId = ${usersId}; updateView()">
                        ${model.data.users[usersId].firstName} ${model.data.users[usersId].surName}
                    </div>
                `;
        }
    }
    if(!html) html = '<p>Ingen medlemmer.</p>';
    return html;
}

function membersInformation(){
    let html = '';
    if(!model.inputs.adminMembersPage.selectedUsersId) return html;
    let usersId;
    for(let userId in model.data.users){
        if(parseInt(userId) == model.inputs.adminMembersPage.selectedUsersId){
            usersId = userId;
        }
    }
    let lastMessage = {
        type: '',
        message: '',
    };
    for(let i = 0; i < model.data.users[usersId].messages.length; i++){
        if(i == (model.data.users[usersId].messages.length-1)){
            lastMessage.type = model.data.users[usersId].messages[i].type;
            lastMessage.message = model.data.users[usersId].messages[i].message;
        }
    }
    html = `<div>
                <div>
                    <h3>Medlems opplysninger</h3>
                    <div>
                        Brukernavn: ${model.data.users[usersId].username} <br/>
                        Navn: ${model.data.users[usersId].firstName} ${model.data.users[usersId].surName} <br/>
                        Adresse: ${model.data.users[usersId].address}, ${model.data.users[usersId].zip}, ${model.data.users[usersId].city}. <br/>
                        E-post: ${model.data.users[usersId].email} <br/>
                        Mobil: ${model.data.users[usersId].mobile}
                    </div>
                </div>
                <div>
                    <h3>Siste Melding</h3>
                    <div>
                        <p>${lastMessage.type == 'admin' ? 'Dansken og meg:' : `${model.data.users[usersId].firstName}:`}</p> <div>${lastMessage.message}</div> <br/>
                        <input value="${model.inputs.adminMembersPage.messageToUser}" onchange="model.inputs.adminMembersPage.messageToUser = this.value"/>
                        <button onclick="sendMessageToUserAdminMembersPage()">Svar</button>
                    </div>
                </div>
                <div>
                    <h3>Bestilling historikk</h3>
                    <div>
                        <table border = 1>
                            <tr>
                                <th>Item</th>
                                <th>Type</th>
                                <th>Pris</th>
                                <th>Betalt/ Ubetalt</th>
                                <th>Dato</th>
                            </tr>
                            ${usersOrderHistoryAdminPage()}
                        </table>
                    </div>
                </div>
                <div>
                    <h3>Bud Historikk</h3>
                    <div>
                        <h5>Pågånede bud</h5>
                        <div>
                            <table border = 1>
                                <tr>
                                    <th>Item</th>
                                    <th>Frist Dato</th>
                                    <th>Brukers Høyeste Bud</th>
                                </tr>
                                ${usersOngoingBidHistoryAdminPage()}
                            </table>
                        </div>
                        <div>
                            <h5>Auksjoner med utløpt frist</h5>
                            <div>
                                <table border = 1>
                                    <tr>
                                        <th>Item</th>
                                        <th>Vunnet/ Tapet</th>
                                        <th>Frist Dato</th>
                                        <th>Brukers Høyeste Bud</th>
                                    </tr>
                                    ${usersPastBidHistoryAdminPage()}
                                    
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button onclick="if(confirm('Are you sure?')) deleteUserAsAdmin()"><h3>Fjern Medlem</h3></button>
                </div>
            </div>
        `;
    return html;
}

function usersOrderHistoryAdminPage(){
    let html = '';
    model.data.orderHistory.forEach(item => {
        if(parseInt(item.userId) == model.inputs.adminMembersPage.selectedUsersId){
            html += `
                        <tr>
                            <td>${item.title}</td>
                            <td>${item.type}</td>
                            <td>${item.price}</td>
                            <td>${item.paid ? 'Betalt' : 'Ubetalt'}</td>
                            <td>${item.date}</td>
                        </tr>
                    `;
        }
    });
    if(!html) html = '<tr><td colspan="5">Ingen Varer</td></tr>';
    return html;
}

function findUsersAuctionItems(){
    let itemInfo = [];
    model.data.auctionListe.forEach(item => {
        for(userId in item.bids){
            if(parseInt(userId) == model.inputs.adminMembersPage.selectedUsersId && !item.bids[userId].deleted){
                itemInfo.push({
                    id: item.itemId,
                    usersHighestBid: item.bids[userId].bid[item.bids[userId].bid.length-1],
                });
            }
        }
    });
    return itemInfo;
}

function usersOngoingBidHistoryAdminPage(){
    let html = '';
    let itemsInfo = findUsersAuctionItems();
    itemsInfo = itemsInfo.filter(item => {
        for(let i = 0; i < model.data.items.length; i++){
            if(model.data.items[i].id == item.id && (new Date(model.data.items[i].deadline) > new Date())){
                return item;
            }
        }
    });
    if(itemsInfo.length == 0) return html = '<tr><td colspan="4">Ingen Varer</td></tr>';
    itemsInfo.forEach(item => {
        model.data.items.forEach(itemInData => {
            if(item.id == itemInData.id){
                item.title = itemInData.title;
                item.deadline = new Date(itemInData.deadline).toLocaleDateString();
            }
        });
    });
    itemsInfo.forEach(item => {
        html += `
                    <tr>
                        <td>${item.title}</td>
                        <td>${item.deadline}</td>
                        <td>${item.usersHighestBid}</td>
                    </tr>
                `;
    });
    return html;
}

function usersPastBidHistoryAdminPage(){
    let html = '';
    let itemsInfo = findUsersAuctionItems();
    itemsInfo = itemsInfo.filter(item => {
        for(let i = 0; i < model.data.items.length; i++){
            if(model.data.items[i].id == item.id && (new Date(model.data.items[i].deadline) < new Date())){
                return item;
            }
        }
    });
    if(itemsInfo.length == 0) return html = '<tr><td colspan="4">Ingen Varer</td></tr>';
    itemsInfo.forEach(item => {
        model.data.auctionListe.forEach(itemInAuctionList => {
            if(itemInAuctionList.itemId == item.id){
                let maximumBid = 0;
                for(usersId in itemInAuctionList.bids){
                    if(itemInAuctionList.bids[usersId].bid[itemInAuctionList.bids[usersId].bid.length-1] > maximumBid){
                        maximumBid = itemInAuctionList.bids[usersId].bid[itemInAuctionList.bids[usersId].bid.length-1]
                    }
                }
                if(item.usersHighestBid == maximumBid){
                    item.bidWon = true;
                }
                else {
                    item.bidWon = false;
                }
            }
        });
    });
    itemsInfo.forEach(item => {
        model.data.items.forEach(itemInData => {
            if(item.id == itemInData.id){
                item.title = itemInData.title;
                item.deadline = new Date(itemInData.deadline).toLocaleDateString();
            }
        });
    });
    itemsInfo.forEach(item => {
        html += `
                    <tr>
                        <td>${item.title}</td>
                        <td>${item.bidWon ? 'Vunnet' : 'Tapt'}</td>
                        <td>${item.deadline}</td>
                        <td>${item.usersHighestBid}</td>
                    </tr>
                `;
    });
    return html;
}

function adminAuctionPage(){
    return `${model.data.users[model.app.userId].permissions == 'admin' ? 
                `
                <div>
                    ${ongoingAuctions()}
                </div>
                <div>
                    ${showExpiredAuctions()}
                </div>
                `: 
                ''
            }
        `;
}

function renderFrontPageAdminSettings(){
    return `
        <div id = "frontPageSettingsContainer">
            <div id = "frontPageTopSettings">
                <div id = "frontPageTopAddProduct">
                    ${model.inputs.adminFrontPage.showTopList?
                        showAddProductList('top'):`
                        <div class = "frontPageAddDisplay" onclick = "openAddProductMenu('top')">Legg til produkt</div>
                    `}
                </div>
                ${model.data.frontPageTop.map((elem,i) =>{
                    return `
                        <div class = "frontPageSettings">
                            ${model.data.items[elem].title}
                            <img src = "${model.data.items[elem].images[0]}"/>
                            <button onclick = "removeFromFrontPageDisplay('top',${i})">Fjern fra forside</button>
                        </div>`
                }).join("")}
            </div>
            <div id = "frontPageBotSettings">
                <div id = "frontPageBotAddProduct">
                ${model.inputs.adminFrontPage.showBotList?
                    showAddProductList('bot'):`
                    <div class = "frontPageAddDisplay" onclick = "openAddProductMenu('bot')">Legg til produkt</div>
                `}
                </div>
                ${model.data.frontPageBottom.map((elem,i) =>{
                    return`
                        <div class = "frontPageSettings">
                            ${model.data.items[elem].title}
                            <img src = "${model.data.items[elem].images[0]}"/>
                            <button onclick = "removeFromFrontPageDisplay('bot',${i})">Fjern fra forside</button>
                        </div>`
                }).join("")}
            </div>
        </div>
    ` 
}

function ongoingAuctions(){
    return `<div>
                <h2>Pågående Bud</h2>
            </div>
            <div>
                <p>Items</p>
            </div>
            <div>
                <div>
                    <input type="search" placeholder="Søk i auksjoner..." value="${model.inputs.adminAuctionPage.searchInput}" onchange="model.inputs.adminAuctionPage.searchInput = this.value; updateView()"/>
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
    for(let userId in model.data.users){
        if(userId == highestBidGiver.id){
            highestBidGiver.name = model.data.users[userId].firstName + ' ' + model.data.users[userId].surName;
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
                            <th>Høyeste Budgiver</th>
                            <th>Antall deltakere</th>
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
                        <p>Endre budfrist</p>
                        <input type="date" value="${model.data.items[model.inputs.adminAuctionPage.selectedItemId-1].deadline.substring(0, 10)}"
                        onchange="changeDeadlineAdminAuctionPage(${model.inputs.adminAuctionPage.selectedItemId-1}, this.value)"
                        />
                    </div>
                    <div>
                        <button onclick="model.app.currentProduct = ${model.inputs.adminAuctionPage.selectedItemId-1}; changeView('productPage'); updateView() ">Gå til Item side</button>
                    </div>
                    <div>
                        <p>Endre til fastprisvare</p>
                        <button onclick="model.data.items[${model.inputs.adminAuctionPage.selectedItemId-1}].auction = false; model.inputs.adminAuctionPage.selectedItemId = null; updateView()">Endre</button>
                    </div>
                    <div>
                        <p>Send Melding til alle deltakere</p>
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

function showExpiredAuctions(){
    let html = '<h2>Auksjoner med utløpt frist.</h2>';
    model.inputs.adminAuctionPage.itemsUtløptFrist = findItemsExpiredDeadline();
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
                highestBidGiver.name = model.data.users[userId].firstName + ' ' + model.data.users[userId].surName;
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
                        <th>Høyeste Budgiver</th>
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
            `;
        }
    }
    return html;
}

function createPageFooter(){
    let chatBox = model.app.loggedInStatus && model.data.users[model.app.userId].permissions == "admin"? "" : `
        <div id = "chatBoxWindow">
            <div id = "chatBox">
                ${model.app.loggedInStatus?
                    generateMessageElements()
                :`
                    <div class = "adminChatElem">
                        Hei og velkommen til Dansken&meg! Om du har spørsmål til oss, logg inn og spør oss her.
                    </div>
                `}
            </div>
            <div>
                ${model.app.loggedInStatus?`
                    <div>
                        <input id = "chatBoxMessageInput" type = "text" oninput = "model.inputs.chatBox.message = this.value" value = "${model.inputs.chatBox.message}"/>
                        <button id = "chatBoxSendMessage" onclick = "sendMessage()">Send melding</button>
                    </div>
                `:`
                    <div>
                        <div id = "chatBoxRegisterButton" onclick = "changeView('registerPage')">Registrer</div>
                        <div id = "chatBoxLoginButton" onclick = "changeView('loginPage')">Logg inn</div>
                    </div>
                `}
            </div>
        </div>
    ` 
    return`
        <div id = "pageFooterContainer">
            <div id = "pageSloganContainer"> De mest ekslusive produktene.
            </div>
            <div id = "chatBoxContainer">
                ${model.app.showChatBox?chatBox:``}
                <div id = "chatBoxButton" onclick = "toggleChatBox()"> Kontakt oss
            </div>
        </div>
    `
}

function profileMenuComponent() {
    let html = `<div class="profileMenuContainer" onmouseleave = "retractDropDown()">
                <button class="dropdownKnapp" onclick="toggleProfileMenuDropDown()">&#x2630; Meny</button>` 
    if(!model.inputs.profileMenuShowing){return html+`</div>`}
    if (!model.app.loggedInStatus) {
        html += `
        <div id="dropdownContent">
            <div onclick="changeView('filteredPage')">Alle produkter</div>
            <div class="dropdownContent-line"> </div>
            <div onclick="loginDropDown()">Logg inn</div>
        </div>` 
    }
    else if (model.data.users[model.app.userId].permissions === 'user') {
        html += `
        <div id="dropdownContent">
            <div class="dropdownContent-1" onclick="changeView('editUserPage')"><i class="bi bi-person-circle"></i> Min Profil</div>
            <div class="dropdownContent-line"> </div>
            <div onclick="changeView('filteredPage')">Alle produkter</div>
            <div class="dropdownContent-line"> </div>
            <div onclick="changeView('saleHistoryPage')">Salgshistorikk</div>
            <div class="dropdownContent-line"> </div>
            <div onclick="changeView('auctionPage')">Bud</div>
            <div class="dropdownContent-line"> </div>
            <div onclick="logout()">Logg ut</div>
        </div>`
    }

    if (model.data.users[model.app.userId] && model.data.users[model.app.userId].permissions === "admin") {
        html += `
        <div id="dropdownContent">
            <div class="dropdownContent-1" onclick="changeView('adminMessage')"><i class="bi bi-chat-dots"></i> Innbox</div>
            <div class="dropdownContent-line"> </div>
            <div class="dropdownContent-1" onclick="changeView('filteredPage')">Alle produkter</div>
            <div class="dropdownContent-line"> </div>
            <div class="dropdownContent-1" onclick="changeView('saleHistoryPage')">Salgshistorikk</div>
            <div class="dropdownContent-line"> </div>
            <div class="dropdownContent-1" onclick="changeView('adminAuction')">Bud</div>
            <div class="dropdownContent-line"> </div>
            <div class="dropdownContent-1" onclick="changeView('createProduct')">Legg til produkt</div>
            <div class="dropdownContent-line"> </div>
            <div class="dropdownContent-1" onclick="changeView('manageMembersPage')">Medlemmer</div>
            <div class="dropdownContent-line"> </div>
            <div onclick="logout()">Logg ut</div>
        </div>`
    }
    return html += `</div>`
}

function showShoppingCart(){
    let html= '';
    if(model.app.loggedInStatus && model.data.users[model.app.userId].permissions == "admin") return html;
    else {
        html = /*html*/`
            <div class="handlevognContainer">
                <div class="handlevognHeader">Handlevogn</div>
                <div id=${model.app.userId ? "allItemsBuyNowShoppingCartContainer" : "allItemsBuyNowShoppingCartContainerAnonym"}>
                    <div id="kanBuyNowHeaders"><p id="canBuyNowTextCart">Varer du kan kjøpe nå -</p><span id="emptyShoppingCartButton" onclick="clearShoppingCart()">Tøm handlevogn</span></div>
                    <div id="priceHeaderShoppingCart">
                        <span id="priceTextShoppingCart">Pris</span>
                    </div>
                    <div id="allItemsContainerShoppingCartBuyNowSection">
                    ${showItemsCanBuyNow()}
                    </div>
                    <div id="totalPriceContainerShoppingCart">
                        <span id="totalTextBuyNowShoppingCart">Total NOK</span>
                        <span id="totalKrBuyNowShoppingCart">${model.inputs.shoppingCart.totalPrice}</span>
                        <button id="checkOutPageButtonShoppingCart" ${(model.app.userId && model.data.users[model.app.userId].shoppingCart.length != 0) || (!model.app.userId && model.inputs.shoppingCart.items.canBuyNow.length != 0) ? '' : 'disabled'} onclick="changeView('checkoutPage')">Gå til kassen</button>

                    </div>
                </div>
                <div id="auctionsUserHaveBidOnContainerShoppingCart">
                    ${model.app.loggedInStatus ? `
                        <h3 id="auctionsHeaderShoppingCart">Auksjoner du har bud på:</h3>
                        <div id="winningBidHeaderShoppingCart">
                            <span>Vinnende bud</span>
                        </div>
                        <div id="winningBidsItemsContainerShoppingCart">${showWinningBids()}</div>
                        <div id="losingBidHeaderShoppingCart">
                            <span>Tapende bud</span>
                        </div>
                        <div id="losingBidsItemsContainerShoppingCart">${showLosingBids()}</div>` 
                    : ''}
                </div>
            </div>`;
    }
    return html;
}

function showItemsCanBuyNow(){
    let html = '';
    model.inputs.shoppingCart.totalPrice = 0;
    if ((!model.app.userId && model.inputs.shoppingCart.items.canBuyNow.length == 0) || (model.app.userId && model.data.users[model.app.userId].shoppingCart.length == 0)) {
        html = 'Handlekurven din er tom';
    }
    if(model.app.loggedInStatus){
        for(let i = 0; i<model.data.users[model.app.userId].shoppingCart.length;i++){
            html += `
            <div class="singleItemCanBuyShoppingCart">
                <img class="imageOfItemsCanBuyCart" src = "${model.data.items[eval(model.data.users[model.app.userId].shoppingCart[i].item)-1].images[0]}"/>
                <span class="titleOfItemsCanBuyCart">${model.data.items[eval(model.data.users[model.app.userId].shoppingCart[i].item)-1].title}</span>
                <button class="deleteSingeItemCanBuyCart" onclick = "removeFromUserShoppingCart(${i})">X</button>
                <span class="priceOfSingleItemCanBuyCart">${model.data.items[eval(model.data.users[model.app.userId].shoppingCart[i].item)-1].price * model.data.users[model.app.userId].shoppingCart[i].quantity}</span>
                <span class="quantityOfItemCanBuyCart">x${model.data.users[model.app.userId].shoppingCart[i].quantity}</span>
            </div>
            `
            model.inputs.shoppingCart.totalPrice += model.data.items[eval(model.data.users[model.app.userId].shoppingCart[i].item)-1].price * model.data.users[model.app.userId].shoppingCart[i].quantity
        }
    }
    else{
        for(let j = 0; j < model.inputs.shoppingCart.items.canBuyNow.length; j++){
            for(let i = 0; i < model.data.items.length; i++){
                
                if(model.inputs.shoppingCart.items.canBuyNow[j].id === model.data.items[i].id){
                    html += `
                    <div class="singleItemCanBuyShoppingCart">
                        <img class="imageOfItemsCanBuyCart" src="${model.data.items[i].images[0]}" />
                        <span class="titleOfItemsCanBuyCart">${model.data.items[i].title}</span>
                        <button class="deleteSingeItemCanBuyCart" onclick="deleteItemFromShoppingCart(${j})">X</button>
                        <span class="priceOfSingleItemCanBuyCart">${model.data.items[i].price}</span>
                    </div>`;
                    
                    model.inputs.shoppingCart.totalPrice += model.data.items[i].price;
                }
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
        for (let i = 0; i < model.inputs.shoppingCart.items.auctions.usersWinningBids.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id === model.data.items[j].id){
                    html += `
                    <div class="singleItemContainerInWinningBidsShoppingcart">
                        <img class="winningBidsItemImageShoppingCart" src="${model.data.items[j].images[0]}" />
                        <span class="winningBidsItemTitleShoppingCart">${model.data.items[j].title}</span>
                        ${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].deleted ? '<span class="winningBidsItemRemoveButtonShoppingCart">Du trukket bud.</span>' : `
                            <button class="winningBidsItemRemoveButtonShoppingCart" onclick="if(confirm('Are you sure?')) trekkBud(${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id}, 
                                 ${model.app.userId})"
                            >Trekk bud</button>
                            <div class="winningItemMaxBidShoppingCart">Bud: ${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid}</div>
                            <div class="winningItemDeadlineShoppingCart">Stenges om : ${calculateDeadline(model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id)}</div>
                            <input class="winningItemIncreaseBidInputShoppingCart" type="number" value = "${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid}" oninput="model.inputs.product.bidIncrease = this.value" />
                            <button class="winningItemIncreaseBidButtonShoppingCart"
                                ${model.inputs.shoppingCart.items.auctions.increasedWinningBid > model.inputs.shoppingCart.items.auctions.usersWinningBids[i].usersMaximumBid ? '' : 'disabled'}
                                onclick="raiseBid('${model.inputs.shoppingCart.items.auctions.usersWinningBids[i].id}')"
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
        for (let i = 0; i < model.inputs.shoppingCart.items.auctions.usersLosingBids.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id === model.data.items[j].id){
                    html += `
                    <div class="singleItemContainerInLosingBidsShoppingcart">
                        <img class="losingBidsItemImageShoppingCart"  src="${model.data.items[j].images[0]}" />
                        <span class="losingBidsItemTitleShoppingCart">${model.data.items[j].title}</span>
                        ${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].deleted ? '<span class="losingBidsItemRemoveButtonShoppingCart">Du trukket bud.</span>' : `
                            <button class="losingBidsItemRemoveButtonShoppingCart" onclick="if(confirm('Du kan ikke by igjen på denne varen om du trekker deg, er du sikker?')) trekkBud(${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id}, 
                                ${model.app.userId})"
                                >Trekk bud</button>
                            <div class="losingItemMaxBidShoppingCart">Nåværende bud: ${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid}</div>
                            <div class="losingItemDeadlineShoppingCart">Stenges om : ${calculateDeadline(model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id)}</div>
                            <input  type="number" 
                                class="losingItemIncreaseBidInputShoppingCart"
                                min="${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid}" 
                                step= 100
                                value="${model.inputs.shoppingCart.items.auctions.increasedWinningBid || ''}"   
                                oninput="oninput="model.inputs.product.bidIncrease = this.value""
                            />
                            <button
                                class="losingItemIncreaseBidButtonShoppingCart"
                                ${model.inputs.shoppingCart.items.auctions.increasedWinningBid > model.inputs.shoppingCart.items.auctions.usersLosingBids[i].ItemsMaximumBid ? '' : 'disabled'}
                                onclick="raiseBid('${model.inputs.shoppingCart.items.auctions.usersLosingBids[i].id}')"
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
        html = 'Budrunden er ferdig.'
    }
    return html;
}

function registerFormView() {
    let container = /*html */`
    <h1 class ="BannerRegister">Registering For Dansken & Meg</h1>
    <div class="register-form-container">
    <div class="register-formBox">
    <div class="tittleRegister">Fyllut Skjema</div>
    <div class="register-form-group">
    <input type="text" class="register-Form-Input" placeholder="First Name" oninput="model.inputs.register.firstName = this.value;">
    <input type="text" class="register-Form-Input" placeholder="Last Name" oninput="model.inputs.register.lastName = this.value;">
  </div>
  <div class="register-form-group">
    <input type="email" class="register-Form-Input" placeholder="Email" oninput="model.inputs.register.email = this.value;">
    <input type="tel" class="register-Form-Input" placeholder="Telefon Nr:" oninput="model.inputs.register.mobile = this.value;">
  </div>
  <div class="register-form-group">
    <input type="text" class="register-Form-Input" placeholder="Brukernavn:" oninput="model.inputs.register.userName = this.value;">
    <input type="password" class="register-Form-Input" placeholder="Passord:" oninput="model.inputs.register.password = this.value;">
    <input type="password" class="register-Form-Input" placeholder="Gjenta Passord:" oninput="model.inputs.register.repeatPassword = this.value;">
  </div>
  <div class="register-form-group">
    <input type="text" class="register-Form-Input" placeholder="Adresse:" oninput="model.inputs.register.address = this.value;">
    <input type="text" class="register-Form-Input" placeholder="Post nummer:" oninput="model.inputs.register.zip = this.value;">
    <input type="text" class="register-Form-Input" placeholder="By:" oninput="model.inputs.register.city = this.value;">
  </div>
  <div class="register-form-group">
    <label class="invinsible-card">1755245733</label><input type="text" class="register-Form-Input" placeholder="Card info" onchange="model.inputs.register.cardNumber = this.value; isValid(this)">
    <input type="date" class="register-Form-Input" oninput="model.inputs.register.fromDate = this.value;">
    <input type="text" class="register-Form-Input" placeholder="CVE" oninput="model.inputs.register.cve = this.value;">
  </div>
  <div class="register-form-group">
  <button class="register-form-btn" onclick="goBackToFrontPage()">Tilbake</button>
  <button class="register-form-btn" onclick="registerUser()">Register</button>
  <div>${model.inputs.register.meldingRegister}</div>
  </div>
  </div>
</div>`
    return container;
}

function showSearchBox() {
    return /*html*/ `
    <div class="searchContainer">
        <div class="searchBox">
            <input class="SearchBox-1" type="search" value="${model.inputs.search.input}" onchange="model.inputs.search.input = this.value; updateView()">
            <button class="SearchBox-2" onclick="doSearch()">Søk</button>
        </div>
    </div>
    `;
}

function frontPageProductView(){
    let topElem = model.data.frontPageTop.length > 0?generateFrontPageElement(model.data.frontPageTop[model.app.frontPageCurrentShowing.top],model.app.frontPageCurrentShowing.topPic,"top"):`<div class = "frontPagePlaceholder"></div>`
    let botElem = model.data.frontPageBottom.length > 0?generateFrontPageElement(model.data.frontPageBottom[model.app.frontPageCurrentShowing.bottom],model.app.frontPageCurrentShowing.botPic,"bot"):`<div class = "frontPagePlaceholder"></div>`
    return `
        <div id = "frontPageProductDisplay">
            <div><h1>Utstilte auksjoner</h1></div>
            <div class = "frontPageProductDisplayElement">
                <div onclick = "changeFrontPageTopProduct(-1)" class = "frontPageLeftArrow"><i class="bi bi-caret-left-square"></i></div>
                ${topElem}
                <div onclick = "changeFrontPageTopProduct(1)" class = "frontPageRightArrow"><i class="bi bi-caret-right-square"></i></div>
            </div>
            <div><h1>Utstilte varer</h1></div>
            <div class = "frontPageProductDisplayElement">
                <div onclick = "changeFrontPageBotProduct(-1)" class = "frontPageLeftArrow"><i class="bi bi-caret-left-square"></i></div>
                ${botElem}
                <div onclick = "changeFrontPageBotProduct(1)" class = "frontPageRightArrow"><i class="bi bi-caret-right-square"></i></div>
            </div>
        </div>
    ` 
}

function generateFrontPageElement(item, pic, pos){
    let varElems;
    if (model.data.items[item].auction){
        varElems = `
            <label class = "frontPagePriceDescLabel">Høyeste bud: </label>
            <label class = "frontPagePriceLabel">${model.data.items[item].price},-</label>
            <button class = "frontPageGoToProductButton" onclick = "goToProduct(${item})">Gå til auksjon</button>
        `
    }
    else{
        varElems = `
            <label class = "frontPagePriceDescLabel">Pris: </label>
            <label class = "frontPagePriceLabel">${model.data.items[item].price},-</label>
            ${model.app.loggedInStatus && model.data.users[model.app.userId].permissions == "admin"?``:`<button class = "frontPageAddProductButton" onclick = "addToShoppingCart('${model.data.items[item].id}')">Legg til i handlekurv</button>`}
            <button class = "frontPageGoToProductButton" onclick = "goToProduct(${item})">Gå til produktside</button>
        `  
    }
    return `
        <div class = "frontPageCenterElem">
            <img class = "frontPageProductImg" src = "${model.data.items[item].images[pic]}"/>
            <label onclick = changeFrontPagePic('${pos}',-1)>⮜</label>
            ${model.data.items[item].images.map((item, i) =>{
                return `<label class = "frontPageDisplayImageCircles" onclick = "changeFrontPagePic('${pos}',${i - pic})">${i == pic?"⚫":"⚪"}</label>`
            }).join("")}
            <label onclick = changeFrontPagePic('${pos}',1)>⮞</label>
            <h4 class = "frontPageProductHeader">${model.data.items[item].title}</h4>
            <p class = "frontPageProductDesc">${model.data.items[item].description}</p>
            ${varElems}    
        </div>` 
}

function createHeaderSection(){
    return /*html*/`
    <div class="headerSectionContainer">
        ${goBackAndGoForwardButtons()}
        <h1 class="overskriftHeaderSection" onclick = "toToFrontPage()">Dansken&Meg</h1>
        ${!model.app.loggedInStatus ? `<div class="registerButtonHeaderSection" onclick="goToRegisterPage()">Registrer</div>
        <div class="loginButtonHeaderSection" onclick="loginDropDown()">Login</div>` :
        `<div class="userButtonHeaderSection" onclick="">${model.data.users[model.app.userId].username}</div>`}
        ${!model.app.loggedInStatus || model.data.users[model.app.userId].permissions != "admin"? `<div class="cartIconHeaderSection" onclick="changeView('shoppingCart')">🛒</div>`:``}
        <h3 class="underskriftHeaderSection">VintageSkatter</h3>
        ${model.inputs.login.dropdown ? 
            `<input type="text" 
            class="userNameInputLoginDropdown" 
            onchange="model.inputs.login.username = this.value"
            value="${model.inputs.login.username}"
            required
            /> 
            <input type="password" 
                class="passwordInputLoginDropdown" 
                onchange="model.inputs.login.password = this.value"
                value="${model.inputs.login.password}"
                required
            /> 
            <div class="loginSubmitButtonLoginDropdown" onclick="checkUserIdPassword()">Submit</div>
            ${model.inputs.login.wrongUserNamePassword ? 
                    `<p class="wrongUserLoginDropdown">${model.app.wrongUserNamePasswordMessage}</p> 
                    <p class="forgotPasswordLoginDropdown">
                    <span onclick=""> Forgot password?</span> 
                    <span onclick=""> New user?</span>
                    </p>` 
                    : ''}` 
            : ''}
    </div>`;
}

function createSaleView(){
    let categoryList ="";
    let id = (model.data.items.length+1).toString()
    while (id.length<7){
        id = "0" + id
    }
    model.inputs.createSale.newId = id
    for( let i = 0; i<model.inputs.createSale.categoryList.length; i++){
        categoryList += ` <li class = "createSaleCategoryElement">${model.inputs.createSale.categoryList[i]}<button onclick = "deleteCategory(${i})">X</button></li>`
    }
    return /*html*/ ` 
        <div class = "CreateSaleContainer">
        <label id = "productId">Produkt ID: ${model.inputs.createSale.newId}</label>
            <div class = "createProductTopOfPage">
                <input id = "productName" type = "text" placeholder = "Produkt Navn" value = "${model.inputs.createSale.title}"  oninput = "model.inputs.createSale.title = this.value"/>
                <input id = "priceInput" type = "text" placeholder = "Pris" value = "${model.inputs.createSale.price}" oninput = "model.inputs.createSale.price = this.value">
            </div>
            <input id = "productDescription" type = "text" placeholder = "Beskrivelse" value = "${model.inputs.createSale.description}" oninput = "model.inputs.createSale.description = this.value"/>
            <div id = "categoryListContainer">
                <ul class = "createSaleCategoryList">${categoryList}</ul>
            </div>
            <div class = "categoryCreateContainer">
                <input id = "categoryMain" type = "text" placeholder = "Hovedkategori" oninput = "model.inputs.createSale.mainCategory = this.value" value = "${model.inputs.createSale.mainCategory}">
                <button id = "mainCategoryAdd" onclick = "addMainCategory()">"Sett hovedkategori"</button>
                <input id = "categorySub" type = "text" value = "${model.inputs.createSale.subCategory}" oninput = "model.inputs.createSale.subCategory = this.value" placeholder = "Underkategori"/>
                <button id = "subCategoryAdd" onclick = "addSubCategory()">Legg til underkategori</button>
            </div>
            <div id = "galleryFrame">Bildegalleri
                <i class="bi bi-upload"></i>
                <input value = "${model.inputs.createSale.addImage}" oninput = "uploadImg(event)" type = "file" id = "galleryInput">
                ${model.inputs.createSale.images.map(img => `<img class = "newProductImageGalleryElement" src = "${img}"></img>`).join('')}
            </div>
            <div class = "checkBoxesCreate">
                <label id = "aucionLabel">Auksjon: </label>
                <input type = "checkbox" id = "auctionBox" ${model.inputs.createSale.auction? 'checked':''} onchange = "model.inputs.createSale.auction = !model.inputs.createSale.auction"/>
                <label id = "deadlineLabel">Budfrist</label>
                <input id = "deadlineInput" type = "datetime-local" value = "${model.inputs.createSale.deadline}" oninput = "model.inputs.createSale.deadline = this.value">
                <input id = "minimumBidInput" type = "text" placeholder = "Minste tillatte budøkning" value = "${model.inputs.createSale.minimumBidAmmount}" oninput = "model.inputs.createSale.minimumBidAmmount = this.value">
                <label id = "deliveryCheckBoxLabel" >Kan leveres:</label>
                <input id = "deliveryBox" type = "checkbox" ${model.inputs.createSale.deliver? "checked":""} onchange = "model.inputs.createSale.deliver = this.checked">
            </div>
            <button id = "saveButton" onclick = "createProduct()">Lagre produkt</button>
        </div>` 
}

function loginView(){
    return `
        <div class = "loginRegContainer">
            <button onclick = "changeView("registerPage")" id = "registerButton">Register</button>
            <button id = "loginDropdown" onclick = "toogleLoginDrop()">Login</button>
            ${showLoginDropDown()}
        </div>
        `
}

function showLoginDropDown(){
    if(model.inputs.login.dropdown){
        return`
        <div class = "dropdownList">
        <input placeholder = "Brukernavn" oninput = "model.inputs.login.username = this.value" id = "usernameInput"></input>
        <input placeholder = "Passord" oninput = "model.inputs.login.password = this.value" id = "passwordInput"></input>
        <button onclick = "checkLogin()" id = "submitLogin">Sumbit</button>
        </div>`;
    }
    else{
        return ``
    }
}

function orderHistoryView (){
    let html = ``
    if(model.data.users[model.app.userId].permissions === "admin"){
        for(let i = 0; i < model.data.orderHistory.length; i++){
        /*html*/
            html+= `<div class = "orderHistoryElem">
                <img class = "orderHistoryItemImage" src = ${model.data.orderHistory[i].image}>
                <div class = "orderHistoryItemID">Item ID: ${model.data.orderHistory[i].itemId}</div>
                <div class = "orderHistoryStatus">Betalt: ${model.data.orderHistory[i].paid}</div>
                <div class = "orderHistoryPrice">Pris: ${model.data.orderHistory[i].price}</div>
                <div class = "orderHistoryDate">Dato: ${model.data.orderHistory[i].date}</div>
                <div class = "orderHistoryType">Type: ${model.data.orderHistory[i].type}</div>
                <div class = "orderHistoryUserId">Kjøper : ${model.data.orderHistory[i].userId} <br>
                Fornavn: ${model.data.users[model.data.orderHistory[i].userId].firstName} <br>
                Etternavn: ${model.data.users[model.data.orderHistory[i].userId].surName} </div>
            </div>`
            }
            }
        else {
            for(let i = 0; i<model.data.orderHistory.length; i++){
                if(model.app.userId === model.data.orderHistory.userId ){
                        
                 /*html*/
                    html+=`<ul>
                        <div class = "orderHistoryTitle">Produkt Navn: ${model.data.orderHistory[i].title}</div>
                        <img class = "orderHistoryItemImage" src = ${model.data.orderHistory[i].image}>
                        <div class = "orderHistoryType">Type: ${model.data.orderHistory[i].type}</div>
                        <div class = "orderHistoryDate">Dato: ${model.data.orderHistory[i].date}</div>
                        <div class = "orderHistoryPrice">Pris: ${model.data.orderHistory[i].price}</div>
                    </ul>`
                }
            } 
        }
        return /*html*/ `
            <div id = "mainOrderHistoryDiv">
                <h1 id = "orderHistoryTopText">Kjøpshistorikk</h1>
                <div class = "OrderHistoryContainer">
                    ${html}
                </div>
            </div>`
}

function productDisplay(product){
    let content;
    let images = `` 
    if(model.data.items[product].auction && model.app.loggedInStatus && model.data.users[model.app.userId].permissions != "admin"){
        content = `
            <label class = "productDisplayPriceLabel">Nåværende Bud: </label>
            <label class = "productDisplayPrice">${model.data.items[product].price},-</label>
            <input class = "productDisplayPriceInput" oninput="model.inputs.product.bidIncrease = this.value">${model.inputs.product.bidIncrease}</input>
            <button class = "productDisplayBuyButton" onclick = "raiseBid(model.data.items[${product}].id)">Øk bud</button>
            <div id = "productDisplayDeadline">Auksjonen åpent til: ${new Date(model.data.items[product].deadline).toLocaleDateString()}</div>`
    }
    else if(model.data.items[product].auction && !model.app.loggedInStatus){
        content = `
            <label class = "productDisplayPriceLabel">Nåværende Bud: </label>
            <label class = "productDisplayPrice">${model.data.items[product].price},-</label>
            <div class = "productDisplayNoBid">Du må være innlogget for å by på auksjoner</div>
            <button class = "productDisplayNoBidRegister" onclick = "changeView('registerPage')">Registrer</button>
            <button class = "productDisplayNoBidLogin" onclick = "changeView('loginPage')">Logg inn</button>
        `
    }
    else if((!model.data.items[product].auction && !model.app.loggedInStatus) || (!model.data.items[product].auction && model.app.loggedInStatus && model.data.users[model.app.userId].permissions != "admin")){
        content = `
                <label class = "productDisplayPriceLabel">Pris: </label>
                <label class = "productDisplayPrice">${model.data.items[product].price},-</label>
                <button class = "productDisplayBuyButton" onclick = "addToShoppingCart('${model.data.items[product].id}')">Legg til i handlekurv</button>
        `
    }
    else{
        content = false;
    }
    for(let i = 1; i<model.data.items[product].images.length;i++){
        images += `<div class="inlineImagesProductDisplay"><img class = "productDisplayGalleryImage" src = "${model.data.items[product].images[i]}"></img></div>`
    }
    //${showZoomedPic()}    
    return `
    <div id="singleProductDisplayContainer">
        <div class = "productDisplayTitle">${model.data.items[product].title}</div>
        <div class = "productDisplayContainer">
            <img class = "productDisplayImage" src = "${model.data.items[product].images[0]}" onclick = "blowUpGalleryImg(0)"></img>
            <div class = "productDisplayDescriptionContainer">
                <div class = "productDisplayDescriptionTitle">Beskrivelse</div>
                <p class = "productDisplayDescription">${model.data.items[product].description}</p>
                ${content ? `
                    <div id="productPriceOrBidContainer">
                        ${content}
                    </div>`:
                    ''
                }
                ${model.app.loggedInStatus && model.data.users[model.app.userId].permissions == "admin"?
                    `<div id="singleProductAdminComponentsContainer">${showAdminProductComponent(product)}</div>`:
                    ``
                }
            </div>
        </div>
        <div id = "productDisplayImageGalleryContainer">
            <p>Bildegalleri</p>
            ${images}
            <div class="clearAllDiv"></div>
        </div>
    </div>`
}

function showAdminProductComponent(product){
    return `
        <div id = "adminProductComponent">
            <div id = "adminProductId"> Produkt Id: ${model.data.items[product].id}</div>
            <input type = "checkbox" ${model.data.items[product].auction ? 'checked' : ''} onchange = "model.data.items[${product}].auction = ${!model.data.items[product].auction}"/>
            <label>Auksjonsvare</label>
            <div id="deadlineChangeOnProductPageAdmin">
                <label>Frist: </label>
                <input type = "datetime-local" value = "${model.data.items[product].deadline}" oninput = "model.data.items[${product}].deadline = this.value"/>
            </div>
            <div id="changePriceOrBidProduct">
                ${model.data.items[product].auction?
                    `
                    <p>Nåværende minbud: ${model.data.items[product].minBid}</p>
                    <input type = "number" onchange = "model.inputs.product.adminBidIncrease = this.value; updateView()" min="${model.data.items[product].minBid}" value = "${model.inputs.product.adminBidIncrease}"/><button class="changePriceOrBidButton" ${model.inputs.product.adminBidIncrease > model.data.items[product].minBid ? '' : 'disabled'} onclick = "model.data.items[${product}].minBid = ${model.inputs.product.adminBidIncrease}; updateView()">Endre minimumbudøkning</button>`:
                    `
                    <p>Nåværende pris: ${model.data.items[product].price}</p>
                    <input type = "number" onchange = "model.inputs.product.adminPriceChange = this.value; updateView()" min="${model.data.items[product].price}" value = "${model.inputs.product.adminPriceChange}"/><button class="changePriceOrBidButton" ${model.inputs.product.adminPriceChange > model.data.items[product].price ? '' : 'disabled'} onclick = "model.data.items[${product}].price = ${model.inputs.product.adminPriceChange}; updateView()">Endre pris</button>`
                }
            </div>
            <div>
                <div>
                    ${populateCategoryList(product)}
                </div>
                <div>
                    <label>Endre hovedkategori: </label>
                    <input oninput = "model.inputs.product.adminChangeMainCategory = this.value" type = "text"/>
                    <button class="changeCategoryButton" onclick = "changeMainCategory(${product})">Endre</button>
                </div>
                <div>
                    <label>Legg til underkategori: </label>
                    <input oninput = "model.inputs.product.adminAddSubCategory = this.value" type = "text"/>
                    <button class="changeCategoryButton"  onclick = "addNewSubCategory(${product})">Legg til</button>
                </div>
            </div>
        </div>` 
}

function populateCategoryList(id){
    let list = ``;
    if(model.data.items[id].category.length>0){
        list += `
                    <div>
                        Hovedkategori: <label>${model.data.items[id].category[0]}</label>
                    </div>
                `;
    }
    if(model.data.items[id].category.length>1){
        list += '<p>Underkategorier:</p>';
        for(let i = 1; i < model.data.items[id].category.length; i++){
            list += `
                <div>
                    <label>${model.data.items[id].category[i]}</label>
                    <button class="removeSubcategoryButton" onclick = "removeCategory(${id},${i})">X</button>
                </div>` 
        }
    }
    return list
}

function generateMessageElements(){ 
    return model.data.users[model.app.userId].messages.map(item => {
        return `<div class = "${item.type}ChatElem">${item.type == "admin"?"Dansken&Meg":model.data.users[model.app.userId].firstName}: ${item.message}</div>`
    }).join('')
}

function createLoginPage(){
    return `
        <div id = "loginPageContainer">
            <div id = "loginPageElement">
                <div id = "loginPageLogo" onclick = "toToFrontPage()">Dansken&meg</div>
                <label id = "loginPageUserLabel">Brukernavn</label>
                <input id ="loginPageUserInput" oninput = "model.inputs.login.username = this.value" type = "text"/>
                <label id = "loginPagePassLabel">Passord</label>
                <input id = "loginPagePassInput" oninput = "model.inputs.login.password = this.value" type = "text"/>
                <button id = "loginPageEnterButton" onclick = "checkUserIdPassword()">Logg inn</button>
                <button id = "loginPageBackButton" onclick = "changeView('registerPage')">Registrer</button>
            </div>
        </div>
    ` 
}

function showFilteredProducts(){
    model.inputs.category.filteredItems = filterItems()
    let productList = ``
    for(let i = 0; i<model.inputs.category.filteredItems.length;i++){
        productList += `
            <div class = "filteredSingleProductContainer">
                <img class = "filteredProductImg" src = "${model.data.items[model.inputs.category.filteredItems[i]-1].images[0]}"/>
                <div class = "filteredProductTitle" >${model.data.items[model.inputs.category.filteredItems[i]-1].title}</div>
                <p class = "filteredProductDescription">${model.data.items[model.inputs.category.filteredItems[i]-1].description}</p>
                <label class = "filteredProductPriceLabel">${model.data.items[model.inputs.category.filteredItems[i]-1].price},-</label>
                <div class = "filteredProductButtonsContainer">
                    ${model.data.items[model.inputs.category.filteredItems[i]-1].auction || model.app.loggedInStatus && model.data.users[model.app.userId].permissions == "admin"?``:`<button onclick = "addToShoppingCart('${model.data.items[model.inputs.category.filteredItems[i]-1].id}')">Legg til I handlekurv</button>`}
                    <button class = "filteredProductGoToButton" onclick = "goToProduct(${model.inputs.category.filteredItems[i]-1})">Gå til produktside</button>
                </div>
            </div>`
    }
    let container = `
        <div id="filteredProductListContainer">
            ${productList}
        </div>`
    return container
}

function showFilterBox(){
    let priceLimits = determinePriceLimits()
    return `
        <div id="ShowFilterBoxContainer">
            <div class = "filterBoxMainTitle""><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-nested" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.5 11.5A.5.5 0 0 1 5 11h10a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 1 3h10a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z"/>
          </svg> Kategorier</div>
            <div id="allCategoryNames">
                ${generateCategoryElems(-1)}
            </div>
            <div id="filterBoxAuctionContainer">
                <input id = "filterBoxAuctionCheck" oninput = "checkProductTypeFilter('auction')" type = "checkbox" ${model.inputs.category.filterAuctionCheck? "checked":""}/>
                <label id = "filterBoxAuctionLabel">Vis auksjonsvarer</label>
            </div>
            <div id="filterBoxNormalContainer">
                <input id = "filterBoxNormalCheck" onchange = "checkProductTypeFilter('normal')" type = "checkbox" ${model.inputs.category.filterNormalCheck? "checked":""}/>
                <label id = "filterBoxNormalLabel">Vis fastprisvarer: </label>
            </div>
            <div id="priceRangeContainer">
                <p>Angi pris range</p>
                <input id = "filterBoxPriceRange" type = "range" onchange = "changePriceLevels(this.value)" min="${priceLimits.min}" max = "${priceLimits.max}" value = "${model.inputs.category.priceRange.max}"></input>
                <input id = "filterBoxLowestPrice" type = "text" value = "${priceLimits.min}">
                <input id = "filterBoxHighestPrice" type = "text" onchange = "changePriceLevels(this.value)" value = "${model.inputs.category.priceRange.max}"></input>
            </div>
        </div>`
}

 function adminChatBox(){
    return /*html*/`
    <div class = "adminBoxContainer">
        <div class = "brukerBox">
              
        ${Object.keys(model.data.users).map((key, i) =>{ 
            return model.data.users[key].permissions == "admin"?"":/*html*/`
            <ul onclick = "showSelectedChat('${key}')">
                Brukernavn : ${model.data.users[key].username}
            </ul>
        `}).join('')}
            
        </div>

        <div class = "selectedChatBox">
         ${model.app.showChatBox!=""?currentShownChatBox():""}
        </div>
    </div>
    `
}

function currentShownChatBox(){
    return /*html*/`
    <div class = "currentChatBoxContainer">
        <div id = "messages">
        ${model.data.users[model.app.showChatBox].messages.map(message =>{ 
            return /*html*/ `
            <div class = "${message.type}">
                ${message.type == "user"?model.data.users[model.app.showChatBox].firstName+": ":`Admin: `}
                ${message.message}
            </div>
        `}).join('')}
        </div>
        <input id = "adminMessageInput" type = "text" 
            oninput = "model.inputs.adminMessagePage.adminMessage = this.value"
            value = "${model.inputs.adminMessagePage.adminMessage}">
        <button id = "admingMessageSendButton" onclick = "adminSendMessage()">Send Melding</button>
    </div>
    `
}

function editUserPage(){
    setUserInputs()
      return  /*html*/ ` 
       <div class = "editUserContainerDiv">
            <div id = "persoinalInfo">
                <div id = firstLast>
                    <h1>Personelig Informasjon</h1>
                    <input id ="firstNameChangeBox" type = "text" placeholder = "Fornavn"
                        value  = "${model.data.users[model.app.userId].firstName}" oninput = "model.inputs.register.firstName = this.value">
                    <input id ="lastNameChangeBox" type = "text" placeholder = "Etternavn"
                        value = "${model.data.users[model.app.userId].surName}" oninput = "model.inputs.register.lastName = this.value">
                    <input id ="phoneNumberChangeBox" type = "text" placeholder = "Telefon Nummer"
                        value = "${model.data.users[model.app.userId].mobile}" oninput = "model.inputs.register.mobile = this.value">
                    <input id ="emailChangeBox" type = "text" placeholder = "Epost"
                        value = "${model.data.users[model.app.userId].email}" oninput = "model.inputs.register.email = this.value">
                        <button id = "personalInfoConfirm" onclick = "oppdaterPersonalia('namePhoneEmail')">Confirm</button>
                </div>
                <div id = addressChange>
                    <h1>Addresse</h1>
                    <input id ="cityNameChangeBox" type = "text" placeholder = "By"
                        value = "${model.data.users[model.app.userId].city}" oninput = "model.inputs.register.city = this.value">
                    <input id ="adressNameChangeBox" type = "text" placeholder = "Adresse"
                        value = "${model.data.users[model.app.userId].address}" oninput = "model.inputs.register.address = this.value">
                    <input id ="zipCode" type = "text" placeholder = "Postkode"
                        value = "${model.data.users[model.app.userId].zip}" oninput = "model.inputs.register.zip = this.value">
                    <button id ="addressConfirm" onclick = "oppdaterPersonalia('adresse')">Confirm</button>
                </div>
               
                <div id = "changePassword">
                <h1>Bytt Passord</h1>
                    <input id = "currentPassword" type = "password" placeholder = "Passord"
                        oninput = "model.inputs.register.password = this.value">
                    <input id = "newPassword" type = "password" placeholder = "Ny passord"
                        oninput = "model.inputs.register.repeatPassword = this.value">
                    <button id= "passwordConfirm" onclick = "oppdaterPersonalia('byttPassord')">Confirm</button>
            </div>
            <div id = "cardInfoBox">
                
                    <h1>Betalingsinformasjon: </h1> <br>
                    ${model.data.users[model.app.userId].paymentInformation.map((payment, i) => /*html*/`
                        <div class ="showCardInfo">
                            Kortnummer: ${payment.cardNumber}<br>
                            Utløpsdato: ${payment.expirationDate}<br>
                            Kortholders fornavn: ${payment.cardHolderFirstName}<br>
                            Kortholders etternavn: ${payment.cardHolderLastName}<br>
                            By: ${payment.city}<br>
                            Adresse: ${payment.address}<br>
                            Postnummer: ${payment.zip}<br>
                            <button id = "deleteCardButton" onclick = deleteCard(${i})>Slett Kort</button>
                        </div>
                    `).join('')}
                
            </div>
            <div id = "cardAddBox">
                    <input id = "cardNumber" placeholder = "Kort Nummer"
                         oninput = "model.inputs.register.cardNumber = this.value">
                    <input id = "expirationDate" placeholder = "Utløps Dato" type = "date"
                         oninput = "model.inputs.register.toDate = this.value">
                    <input id = "cvc" placeholder ="CVC"
                         oninput = "model.inputs.register.cvc = this.value"> <br>
                    <input id = "cardFirstName" placeholder = "Fornavn"
                         oninput = "model.inputs.register.cardFirstName = this.value">
                    <input id = "cardLastName" placeholder = "Etternavn"
                         oninput = "model.inputs.register.cardLastName = this.value"><br>
                    <input id ="cardCityNameChangeBox"  placeholder = "By"
                         oninput = "model.inputs.register.cardCity = this.value">
                    <input id ="cardAdressNameChangeBox"  placeholder = "Adresse"
                         oninput = "model.inputs.register.cardAddress = this.value">
                    <input id ="CardZipCode"  placeholder = "Postkode"
                         oninput = "model.inputs.register.cardZip = this.value">
                    <button id = "cardConfirm" onclick = "addBankCard()">Confirm</button>
                </div>
        </div>
        `
 }

function checkOut(){
    let html = '';
    if(model.app.loggedInStatus && model.data.users[model.app.userId].permissions == 'admin') return '';
    else {
        html = /*html*/
            `
            <div id= "checkOutComponentContainer">
                <div id="checkOutLeftSideContainer">
                    ${(!model.app.userId && model.inputs.shoppingCart.items.canBuyNow.length == 0) || (model.app.userId && model.data.users[model.app.userId].shoppingCart.length == 0) ? 
                        '' :
                        `
                        <div id="checkOutAddress">
                        <p>Hvem skal orden sendes til?</p>
                            ${model.app.loggedInStatus ? 
                                '' : 
                                '<p><span onclick="loginDropDown()">Logg inn </span>eller fortsett under. Du kan opprette en konto etter at du har betalt.</p>'
                            }
                        <p>Fornavn: <input id="firstNameInputCheckout" type="text" value="${model.inputs.checkOutPage.firstName}" onchange="model.inputs.checkOutPage.firstName = this.value, updateView()"/></p>
                        <p>Etternavn: <input id="lastNameInputCheckout" type="text" value="${model.inputs.checkOutPage.lastName}" onchange="model.inputs.checkOutPage.lastName = this.value, updateView()"/></p>
                        <p>Addresse: <input id="addressInputCheckout" type="text" value="${model.inputs.checkOutPage.address}" onchange="model.inputs.checkOutPage.address = this.value, updateView()"/></p>
                        <p>Zip: <input id="zipInputCheckout" type="text" value="${model.inputs.checkOutPage.zipCode}" onchange="model.inputs.checkOutPage.zipCode = this.value, updateView()"/></p>
                        <p>E-post: <input id="emailInputCheckout" type="text" value="${model.inputs.checkOutPage.email}" onchange="checkValidityOfEmail(this.value)"/></p>
                        ${model.app.checkOut.invalidEmailOnCheckOutPage ? '<p style="color: red;">Invalid E-post</p>' : ''}
                        <p>Mobil: <input id="mobileInputCheckout" type="text" value="${model.inputs.checkOutPage.mobile}" onchange="model.inputs.checkOutPage.mobile = this.value, updateView()"/></p>
                            ${!model.inputs.checkOutPage.firstName ||
                            !model.inputs.checkOutPage.lastName ||
                            !model.inputs.checkOutPage.address ||
                            !model.inputs.checkOutPage.zipCode ||
                            !model.inputs.checkOutPage.email ||
                            model.app.checkOut.invalidEmailOnCheckOutPage ||
                            !model.inputs.checkOutPage.mobile ?
                            '<p style="color: red;">Fyll ut alle feltene.</p>' :
                            `<button id="addressCompletedButtonCheckout" onclick="model.inputs.checkOutPage.addressFilled = true, updateView()">Fortsett</button>`
                            }
                        </div>
                        ${model.inputs.checkOutPage.addressFilled ?
                        `
                        <div id="checkOutDeliveryMethod">
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
                                `<button id="deliveryCompletedButtonCheckout" onclick="model.inputs.checkOutPage.deliveryMethod.selected = true, updateView()">Fortsett</button>` :
                                ''  
                            }
                        </div> 
                            `:
                            ''
                        }
                        ${model.inputs.checkOutPage.deliveryMethod.selected ?
                        `
                            <div id="checkOutPaymentMethod">
                                ${model.app.loggedInStatus ? 
                                    selectCard() : 
                                    `<p>Card Number: <input class="cardNumberInputCheckout" type="text" value="${model.inputs.checkOutPage.cardNumber}" onchange="model.inputs.checkOutPage.cardNumber = this.value, updateView()"/></p>
                                    <p>Expiration Date: <input class="cardDateInputCheckout" type="text" value="${model.inputs.checkOutPage.expirationDate}" onchange="model.inputs.checkOutPage.expirationDate = this.value, updateView()"/></p>
                                    <p>cvc: <input class="cardCvcInputCheckout" type="text" value="${model.inputs.checkOutPage.cvc}" onchange="model.inputs.checkOutPage.cvc = this.value, updateView()"/></p>
                                    <p>Card Holders First Name: <input class="cardFirstNameInputCheckout" type="text" value="${model.inputs.checkOutPage.cardHolderFirstName}" onchange="model.inputs.checkOutPage.cardHolderFirstName = this.value, updateView()"/></p>
                                    <p>Card Holders Last Name: <input class="cardLastNameInputCheckout" type="text" value="${model.inputs.checkOutPage.cardHolderLastName}" onchange="model.inputs.checkOutPage.cardHolderLastName = this.value, updateView()"/></p>
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
                            '<button id="payButtonCheckout" onclick="payAtTheCheckoutPage()">Betal</button>'
                        }
                    `
                    }
                </div>
                <div id="checkOutRightSideContainer">
                    ${model.inputs.checkOutPage.emptyShoppingCart ? 
                        '<p>Du har ingenting i handlevogn.</p>' :
                        betalingsOversikt()
                    } 
                </div>
            </div>
            `;
        }
    return html;
}
function selectCard(){
    let html= '';
    if (model.data.users[model.app.userId].paymentInformation[0].cardNumber.length < 1){
        html = `
            <p>Card Number: <input class="cardNumberInputCheckout" type="text" value="${model.inputs.checkOutPage.cardNumber}" onchange="model.inputs.checkOutPage.cardNumber = this.value, updateView()"/></p>
            <p>Expiration Date: <input class="cardDateInputCheckout" type="text" value="${model.inputs.checkOutPage.expirationDate}" onchange="model.inputs.checkOutPage.expirationDate = this.value, updateView()"/></p>
            <p>cvc: <input class="cardCvcInputCheckout" type="text" value="${model.inputs.checkOutPage.cvc}" onchange="model.inputs.checkOutPage.cvc = this.value, updateView()"/></p>
            <p>Card Holders First Name: <input class="cardFirstNameInputCheckout" type="text" value="${model.inputs.checkOutPage.cardHolderFirstName}" onchange="model.inputs.checkOutPage.cardHolderFirstName = this.value, updateView()"/></p>
            <p>Card Holders Last Name: <input class="cardLastNameInputCheckout" type="text" value="${model.inputs.checkOutPage.cardHolderLastName}" onchange="model.inputs.checkOutPage.cardHolderLastName = this.value, updateView()"/></p>
        `;
    }
    else {
        if(!model.inputs.checkOutPage.addNewCard){
            html = '<p>Velg kort:</p>';
            for(let i = 0; i < model.data.users[model.app.userId].paymentInformation.length; i++){
                let lastFourDigitOfCard = parseInt(model.data.users[model.app.userId].paymentInformation[i].cardNumber.split('').splice(8,4).join(''));
                html += `
                    <div class="cardBoxCheckout" onclick="cardSelected(${i})">
                        <p>Kort Nummer: ****-****-${lastFourDigitOfCard}
                        ${checkCardValidTil(i)}
                    </div>
                `;
            }
        }
        html += !model.inputs.checkOutPage.addNewCard ? `<button id="addNewCardButtonCheckOut" onclick="addNewCardInCheckOut()">Legg til nytt kort</button>` : '';
        if(model.inputs.checkOutPage.addNewCard){
            html += `
                    <p>Card Number: <input class="cardNumberInputCheckout" type="text" value="${model.inputs.checkOutPage.cardNumber}" onchange="model.inputs.checkOutPage.cardNumber = this.value, updateView()"/></p>
                    <p>Expiration Date: <input class="cardDateInputCheckout" type="text" value="${model.inputs.checkOutPage.expirationDate}" onchange="model.inputs.checkOutPage.expirationDate = this.value, updateView()"/></p>
                    <p>cvc: <input class="cardCvcInputCheckout" type="text" value="${model.inputs.checkOutPage.cvc}" onchange="model.inputs.checkOutPage.cvc = this.value, updateView()"/></p>
                    <p>Card Holders First Name: <input class="cardFirstNameInputCheckout" type="text" value="${model.inputs.checkOutPage.cardHolderFirstName}" onchange="model.inputs.checkOutPage.cardHolderFirstName = this.value, updateView()"/></p>
                    <p>Card Holders Last Name: <input class="cardLastNameInputCheckout" type="text" value="${model.inputs.checkOutPage.cardHolderLastName}" onchange="model.inputs.checkOutPage.cardHolderLastName = this.value, updateView()"/></p>
 
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
            html = '<p style="color: red;">Card is not valid</p>';
        }
    else {
        html = '<p>Card is valid</p>';
    }
    return html;
}
function betalingsOversikt(){
    let html = '<p id="paymentOverviewHeader">Betalingsoversikt</p>';
    model.inputs.checkOutPage.totalPrice = 0;
    if(model.app.loggedInStatus){
        for(let i = 0; i < model.data.users[model.app.userId].shoppingCart.length; i++){
            for(let j = 0; j < model.data.items.length; j++){
                if(model.data.users[model.app.userId].shoppingCart[i].item == model.data.items[j].id){
                    model.inputs.checkOutPage.totalPrice += (model.data.items[j].price * model.data.users[model.app.userId].shoppingCart[i].quantity);
                    html += `
                        <div class="singleItemInfoCheckout">
                            <p class="singleItemTitleCheckout">${model.data.items[j].title}</p>
                            <button class="singleItemQuantityIncreaseCheckout" onclick="increaseItemQuantity(${i})">+</button> <p class="singleItemQuantityCheckout">${model.data.users[model.app.userId].shoppingCart[i].quantity}</p> <button class="singleItemQuantityDecreaseCheckout" onclick="decreaseItemQuantity(${i})">-</button>
                            <p class="singleItemPriceCheckout">${model.data.items[j].price * model.data.users[model.app.userId].shoppingCart[i].quantity}</p>
                        </div>
                    `;
                }
            }
        }
        html += `
                <div>
                    <div class="fraktAndMomsContainer">
                        <p class="fraktTextPaymentOverview">Frakt - </p>
                        <p class="fraktPricePaymentOverview">${model.inputs.checkOutPage.frakt}</p>
                        <p class="vatTextPaymentOverview">Total moms</p>
                        <p class="vatpricePaymentOverview">${model.inputs.checkOutPage.totalPrice * 0.25}</p>
                    </div>
                    <div class="totalNokContainerCheckout">
                        <p class="totalNokTextCheckout">Total NOK</p>
                        <p class="totalNokAmountCheckout">${model.inputs.checkOutPage.totalPrice + (model.inputs.checkOutPage.totalPrice * 0.25) + model.inputs.checkOutPage.frakt}</p>
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
                        <div class="singleItemInfoCheckout">
                            <p class="singleItemTitleCheckout">${model.data.items[j].title}</p>
                            <button class="singleItemQuantityIncreaseCheckout" onclick="increaseItemQuantity(${i})">+</button> <p class="singleItemQuantityCheckout">${model.inputs.shoppingCart.items.canBuyNow[i].quantity}</p> <button class="singleItemQuantityDecreaseCheckout" onclick="decreaseItemQuantity(${i})">-</button>
                            <p class="singleItemPriceCheckout">${model.data.items[j].price * model.inputs.shoppingCart.items.canBuyNow[i].quantity}</p>
                        </div>
                    `;
                }
            }
        }
         html += `
                <div>
                    <div class="fraktAndMomsContainer">
                        <p class="fraktTextPaymentOverview">Frakt - </p>
                        <p class="fraktPricePaymentOverview">${model.inputs.checkOutPage.frakt}</p>
                        <p class="vatTextPaymentOverview">Total moms</p>
                        <p class="vatpricePaymentOverview">${model.inputs.checkOutPage.totalPrice * 0.25}</p>
                    </div>
                    <div class="totalNokContainerCheckout">
                        <p class="totalNokTextCheckout">Total NOK</p>
                        <p class="totalNokAmountCheckout">${model.inputs.checkOutPage.totalPrice + (model.inputs.checkOutPage.totalPrice * 0.25) + model.inputs.checkOutPage.frakt}</p>
                    </div>
                </div>
                `;
    }
    return html;
}

function showZoomedPic(){
    if(model.app.zoomedPic){
        return `<img id = "zoomedPic" src = "${model.data.items[product].images[model.app.zoomedPic]}" onclick = "unZoom()"></img>`
    }
    return ``
}
function goBackAndGoForwardButtons(){
    let html = '';
    html += `
            <div class="navigationButtonsHeader">
                <button class="navigateLeftButtonHeader" ${model.app.pagesToNavigateTo.length <= 1 || model.app.indexOfThePageAreOn == 0 ? 'disabled' : ''} onclick="navigateToPreviousPage()">&#8678;</button>
                <button class="navigateRightButtonHeader"  ${model.app.pagesToNavigateTo.length <= 1 || (model.app.indexOfThePageAreOn == (model.app.pagesToNavigateTo.length-1)) ? 'disabled' : ''} onclick="navigateToNextPage()">&#8680;</button>
            </div>
            `;
    return html;
}
