

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
        if(usersId != "0000001"){
            html += `
                    <div onclick="model.inputs.adminMembersPage.selectedUsersId = ${usersId}; updateView()">
                        ${model.data.users[usersId].firstName} ${model.data.users[usersId].surName}
                    </div>
                `;
        }
    }
    if(!html) html = '<p>Ingen medlemmer.</p>'
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
        else {
            html = '<tr><td colspan="5">Ingen Varer</td></tr>';
        }
    });
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
                        <td>${item.bidWon ? 'Vunnet' : 'Tapet'}</td>
                        <td>${item.deadline}</td>
                        <td>${item.usersHighestBid}</td>
                    </tr>
                `;
    });
    return html;
}