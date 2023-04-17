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
            let budListe ="";


            //Sjekker om item er samma som auction id og om det er instock
            if (item && item.inStock) {
            // vi finner høyest bud og ledende bruker
              Object.keys(bids).forEach((userID) => {
                const userBid = bids[userID].bid[bids[userID].bid.length - 1];
                const isAutomatic = bids[userID].autoBid || false;
                if (userBid > maxbid || (userBid === maxbid && !isAutomatic)) {
                  maxbid = userBid;
                  bidUserLead = userID;
                }
              });
              // Skriver ut date + time, må desverre skrive det her og ellers må jeg bruke alt for mye get elementByID i controller...
              const deadline = new Date(item.deadline).getTime();
              let html = '';
              if (deadline > new Date().getTime()) {
                item.timerValue = deadline;
                let miliSecondsRemaining = deadline - new Date().getTime();
                let daysRemaining = parseInt(miliSecondsRemaining / (1000 * 60 * 60 * 24));
                let hoursRemaining = parseInt(((miliSecondsRemaining / (1000 * 60 * 60 * 24)) - daysRemaining) * 24);
                let minutesRemaining = parseInt((((miliSecondsRemaining / (1000 * 60 * 60 * 24)) - daysRemaining) * 24 - hoursRemaining) * 60);
                let secondsRemaining = parseInt((((((miliSecondsRemaining / (1000 * 60 * 60 * 24)) - daysRemaining) * 24) - hoursRemaining) * 60 - minutesRemaining) * 60);
      
                html = `
                ${daysRemaining} dager og ${hoursRemaining} timer og ${minutesRemaining} minutter. sekkunder: ${secondsRemaining}
                `;
              }
            // går igjennom bud arrayet i auctionListen, teller bud + budmengde!
            userBids.bid.forEach((budMengde, index) => {
                budListe += `<div>Bud: ${index + 1}: ${budMengde}</div>`;
              });
            //skriver ut alt!!
              auksjonsliste += `
              <div class="auctionItem">
              <h3>${item.title}</h3>
              <img src="${item.images[0]}">
              <div>${item.description}</div>
              <div><h4>Ledende Bud: ${item.isAutoBid ? 'Automatic' : item.price}</h4></div> <!-- må sjekke om det er auto -->
              <div>Ledende bruker: ${bidUserLead}</div>
                      
              <div>Du har totalt: ${userBids.bid.length} bud:</div>
                      <div id="deadline-${item.id}" class="deadline">${html}</div>
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
      <button onclick="avsluttendeAuksjoner()"> Dine Avsluttende auksjoner</button>
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
      bids.autoBid = autoBid
      bids.bid.push(item.price)
                }
        }
        

  if (buttonID === 'delete') {
            if (bids.bid.length > 0) {
      bids.deleted = true;
      bids.bid = [];
            }
        }
    
activeAuctionList();  
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
      const vunnet = winner(itemsId);
      model.data.items[posistion].inStock = false;
    
      
      if (vunnet === model.app.userId) {
        model.data.items[posistion].vunnet = true;
      }
    
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

function avsluttendeAuksjoner(){
    let html = ``;

    model.data.auctionListe.forEach((auction) => {
      const auksjonId = auction.itemId
      const bid = auction.bids;
      const userId = Object.keys(bid)
      const item = model.data.items.find((item) => item.id === auksjonId);
    

      if (userId.includes(model.app.userId) && !item.inStock){
        const item = model.data.items.find((item) => item.id === auksjonId);
        
           html +=`
           <div class="containerForAvsluttendeAuksjoner">
           <h3>${item.title}</h3>
           <div>${item.description}</div>
           <div>Siste bud: ${item.price}</div>
           <img src="${item.images[0]}">
           <div>Auksjonen ble avsluttet : ${item.deadline}</div>
         </div>`
        
         if(item.vunnet){
          html+= `<h4>Vinner!!!</h4><button> Betal nå! </button>`
         }
        
        
      }
    })
    const view = `
    <div class="container">
    <button>Alle Auksjoner</button> 
    <button onclick="activeAuctionList()">Dine Aktive Auksjoner</button> 
    <button onclick="avsluttendeAuksjoner()">Dine Avsluttende auksjoner</button>
    ${html || '<div>Du har ingen avsluttende Auksjoner</div>'}
    </div>`;
    return view;
  }

  function winner(itemId) {
    const auction = model.data.auctionListe.find((auksjon) => auksjon.itemId === itemId);
    const bud = auction.bids

    let winner= null;
    let maxBud = 0;

    Object.keys(bud).forEach((userId) =>{
      const brukerSineBud = bud[userId].bid;
      const maxBudBruker = Math.max(...brukerSineBud)

      if (maxBudBruker > maxBud)
      {
        maxBud = maxBudBruker;
        winner = userId;
      }

    })
    return winner;
  }