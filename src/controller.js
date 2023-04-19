function addToOrderHistory(auksjonsId,userId) {
    const item = model.data.items.find((item) => item.id === auksjonsId);
    if(auksjonsId)
     {
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
  function calculateDeadline(itemsId){
    let setDeadline;
    let html = '';
    const item = model.data.items.find((item, index) => {
        if (item.id == itemsId) {
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
      }
    }
  const deadlineClock = document.getElementById(`deadline-${itemsId}`);
  if (deadlineClock) {
    deadlineClock.innerHTML = html;
  }
}

model.data.items.forEach((item) => {
  setInterval(() => {
    calculateDeadline(item.id);
  }, 1000);
});

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
    const auction = model.data.auctionListe.find((navigation) => navigation.itemId === auctionID);
    const bids = auction.bids[model.app.userId];
    const item = model.data.items.find((item) => item.id === auction.itemId);

    const userIdAuction = Object.keys(auction.bids);
    const alleBudIListe = userIdAuction.map(userID => Math.max(...auction.bids[userID].bid));
    const maxBidAlleBrukere = Math.max(...alleBudIListe);
    
    const highestAutoBidData = getHighestAutoBid(auctionID);
    const highestAutoBid = highestAutoBidData.highestAutoBid;
    const highestAutoBidUser = highestAutoBidData.highestAutoBidUser;
   

  if (bids.deleted) {
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
      item.price = maxBidAlleBrukere
      bids.deleted = true
      bids.bid = []
    }
  }
activeAuctionList()
  }