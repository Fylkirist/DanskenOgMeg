function activeAuctionList() {
    let auksjonsliste = ``;
    model.data.auctionListe.forEach((auction) => {
        const auctionID = auction.itemId;
        const bids = auction.bids;
        const userIDs = Object.keys(bids);
        let maxbid = 0;
        let bidUserLead;
    
             // Sjekker over userid hvis det er likt som userId tegner vi opp de aktive auction
            if (userIDs.includes(model.app.userId)) {
                const userBids = bids[model.app.userId];
                const item = model.data.items.find((item) => item.id === auctionID);
                const deadline = calculateDeadline(item.id);
                let budListe ="";
        


            if (item && item.inStock) {
            // vi finner høyest bud + ledende bruker
            Object.keys(bids).forEach((userID) => {
                const userBid = bids[userID].bid[bids[userID].bid.length - 1];
                const isAutomatic = bids.autoBid || false;
                if (userBid > maxbid || (userBid === maxbid && !isAutomatic)) {
                maxbid = userBid;
                bidUserLead = userID;
                }
            });

            userBids.bid.forEach((budMengde, index) => {
                budListe += `<div>Bud: ${index + 1}: ${budMengde}</div>`;
              });
      
                const userBidList = renderUserBids(auction);
                budListe += userBidList;
                auksjonsliste += `
                <div class="auction-item">
                    <h3>${item.title}</h3>
                    <div>${item.description}</div>
                    <div><h4>Leading Bid: ${item.isAutoBid ? 'Automatic' : item.price}</h4></div>
                    <div>Ledende bruker: ${bidUserLead}</div>
                    <div>Du har totalt: ${userBids.bid.length} bud:</div>
                    <div id="deadline-${item.id}"></div>
                    <div id="user-bids-${auctionID}">
                    ${budListe}
                    </div>                   
                    <button onclick="activeAuctionController('${auctionID}','minbud')"> Øk med min bud:' ${item.minBid} '</button>
                    <input type="number" placeholder="Sett manuelt bud" onchange="activeAuctionController('${auctionID}','manuelt', this.value)">
                    <input type="number" placeholder="Sett automatisk bud" onchange="activeAuctionController('${auctionID}','automatic', this.value)">
                    <button onclick="activeAuctionController('${auctionID}','delete')">Slett bud</button>
                </div>`;
            }
        }   
      }
    );
    
                const auctionView = `
                <div class="auction-container">
                    <button onclick="${model.app.userId="0000002"}">Logg inn vanlig bruker </button><br><br>
                    <button>Alle Auksjoner</button> 
                    <button onclick="activeAuctionList()">Dine Aktive Auksjoner</button> 
                    <button> Dine Avsluttende auksjoner</button>
                    ${auksjonsliste || '<div>Du har ingen aktive Auksjoner</div>'}
                </div>`;
        
                document.getElementById('app').innerHTML = auctionView;
    }


function activeAuctionController(auctionID, buttonID, input) {
  const auction = model.data.auctionListe.find((navigation) => navigation.itemId === auctionID);
  const bids = auction.bids[model.app.userId];
  const item = model.data.items.find((item) => item.id === auction.itemId);

  if (bids.deleted) {
    return;
  }

  if (buttonID === 'minbud') {
    const nyttBud = item.price + item.minBid;
    item.price = nyttBud;
    bids.bid.push(nyttBud);
    
  }

  if (buttonID === 'manuelt') {
    if (parseInt(input) > item.minBid) {
      const nyttBud = item.price + parseInt(input);
      item.price = nyttBud;
      bids.bid.push(nyttBud);
    }
  }
  

  if (buttonID === 'automatic') {
    const autoBid = parseInt(input);
    const otherUsers = Object.keys(auction.bids).filter(userID => userID !== model.app.userId);
    const maxBid = Math.max(...otherUsers.map(userID => Math.max(...auction.bids[userID].bid)));

    if (autoBid > item.minBid && autoBid > item.price) {
      if (autoBid > maxBid) {
        const nyttBud = maxBid + item.minBid
        item.price = nyttBud;
      } else {
        const nyttBud = autoBid - item.minBid
        item.price = nyttBud
      }
      bids.automatic = autoBid
      bids.bid.push(item.price)
    }
  }


  if (buttonID === 'delete') {
    if (bids.bid.length > 0) {
      bids.deleted = true;
      bids.bid = [];
    }
  }
  
  renderUserBids(auction)

}

function renderUserBids(auction) {
    const bids = auction.bids[model.app.userId];
    const item = model.data.items.find((item) => item.id === auction.itemId);
    let budListe = "";
    bids.bid.forEach((budMengde, index) => {
      budListe += `<div>Bud: ${index + 1}: ${budMengde}</div>`;
    });
    const bidListContainer = document.getElementById(`user-bids-${auction.itemId}`);
    if (bidListContainer) {
      bidListContainer.innerHTML = budListe;
    }
  }
  

function calculateDeadline(itemsId){
    let setDeadline;
    let posistion;
    let html = '';
    const item = model.data.items.find((item, index) => {
        if (item.id == itemsId) {
          posistion = index;
          return true;
        }
        return false;
      });
    setDeadline = item.deadline;

    
    let miliSecondsRemaining = parseInt(new Date(setDeadline) - new Date());
    let daysRemaining = parseInt(miliSecondsRemaining/(1000*60*60*24));
    let hoursRemaining = parseInt(((miliSecondsRemaining/(1000*60*60*24)) - daysRemaining) * 24);
    let minutesRemaining = parseInt(((((miliSecondsRemaining/(1000*60*60*24)) - daysRemaining) * 24) - hoursRemaining) * 60);
    let secondsRemaining = parseInt(((((((miliSecondsRemaining/(1000*60*60*24)) - daysRemaining) * 24) - hoursRemaining) * 60) - minutesRemaining) * 60);

    if (miliSecondsRemaining > 1000){
        html = `
                ${daysRemaining} dager og ${hoursRemaining} timer og ${minutesRemaining} minutter. sekkunder: ${secondsRemaining}
             `;
    }
    else {
        html = 'Bud er stengt.'
        model.data.items[posistion].inStock = false;
    }
  const deadlineElement = document.getElementById(`deadline-${itemsId}`);
  if (deadlineElement) {
    deadlineElement.innerHTML = html;
  }
}

model.data.items.forEach((item) => {
  setInterval(() => {
    calculateDeadline(item.id);
  }, 1000);
});

