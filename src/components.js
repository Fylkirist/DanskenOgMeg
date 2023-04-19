function activeAuctionList() {
  let auksjonsliste = ``
  model.data.auctionListe.forEach((auction) => {
    const auctionID = auction.itemId
    const bids = auction.bids
    const userIDs = Object.keys(bids)
    let maxbid = 0
    let maxBidUser

             // Sjekker over userid hvis det er likt som userId tegner vi opp de aktive auction
        if (userIDs.includes(model.app.userId)) {
            const userBids = bids[model.app.userId]
            const item = model.data.items.find((item) => item.id === auctionID)
            let budListe =""


            //Sjekker om item er samma som auction id og om det er instock
            if (item && item.inStock && item.auction) {
            // vi finner høyest bud og ledende bruker
              Object.keys(bids).forEach((userID) => {
                const userBid = bids[userID].bid[bids[userID].bid.length - 1]  
                if (userBid > maxbid) {
                  maxbid = userBid
                  userID = model.data.users[userID].username
                  maxBidUser = userID
                  item.price = maxbid
              }
             })
            
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
                ${daysRemaining} dager og ${hoursRemaining} timer og ${minutesRemaining} minutter. sekkunder: ${secondsRemaining}
                `
              }
            // går igjennom bud arrayet i auctionListen, teller bud + budmengde!
            userBids.bid.forEach((budMengde, index) => {
                budListe += `<div>Bud: ${index + 1}: ${budMengde}</div>`;
              })
            //skriver ut alt!!
              auksjonsliste += `
              <div class="auctionItem">
              <h3>${item.title}</h3>
              <img src="${item.images[0]}">
              <div>${item.description}</div>
              <div><h4>Ledende Bud: ${item.price}</h4></div> 
              <div>Ledende bruker: ${maxBidUser}</div>
              <h5></h5>
                      
              <div>Du har totalt: ${userBids.bid.length} bud:</div>
                      <div id="deadline-${item.id}" class="deadline">${clock}</div>
                      <div id="user-bids-${auctionID}">
                      ${budListe}
              </div>
              <button onclick="activeAuctionController('${auctionID}','minbud')"> Øk med min bud:' ${item.minBid} '</button>
              <input type="number" placeholder="Sett manuelt bud" onchange="activeAuctionController('${auctionID}','manuelt', this.value)">
              <input type="number" placeholder="Sett automatisk bud" onchange="activeAuctionController('${auctionID}','automatic', this.value )">
              <button onclick="activeAuctionController('${auctionID}','delete')">Slett bud</button>
              <div onclick="activeAuctionController('${auctionID}','editAuto'),", >Ditt automatiskeBud:${bids[model.app.userId].autoBid} </div>
              <input type="number" placeholder="Endre automatiskBud" onchange="activeAuctionController('${auctionID}','editAuto', this.value)">
              </div>`;
            }
        }
      }
    );

  const html = `
    <div class="auction-container">
      <button onclick="activeAuctionList()">Dine Aktive Auksjoner</button> 
      <button onclick="avsluttendeAuksjoner()"> Dine Avsluttende auksjoner</button>
      ${auksjonsliste || '<div>Du har ingen aktive Auksjoner</div>'}
    </div>`;

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
           <div class="containerForAvsluttendeAuksjoner">
           <h3>${item.title}</h3>
           <div>${item.description}</div>
           <div>Siste bud: ${item.price}</div>
           <img src="${item.images[0]}">
           <div>Auksjonen ble avsluttet : ${item.deadline}</div>
         </div>`
        
         if(auction.bids[model.app.userId].vunnet){
          html+= `<h4>Vinner!!!</h4><button onclick="changeView('checkoutPage')"> Betal nå! </button>`
          addToOrderHistory(auksjonId,model.app.userId)
         }
        
        
      }
    })
    const view = `
    <div class="container">
    <button onclick="activeAuctionList()">Dine Aktive Auksjoner</button> 
    <button onclick="avsluttendeAuksjoner()">Dine Avsluttende auksjoner</button>
    ${html || '<div>Du har ingen avsluttende Auksjoner</div>'}
    </div>`;
     return view;
  }
  