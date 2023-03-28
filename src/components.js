function activeAuctionList() {
  
  let auksjonsliste = ``;

  model.data.auctionListe.forEach((auction) => {
    const auctionID = auction.itemId;
    const bids = auction.bids;
    const userIDs = Object.keys(bids);

    if (userIDs.includes(model.app.userId)) {
      const budFraBruker = bids[model.app.userId];
      const item = model.data.items.find((item) => item.id === auctionID);


      if (item) {
        let budListeForBruker = '';
        budFraBruker.forEach((bidAmount, index) => {
        budListeForBruker += `<div>Bud: ${index + 1}: ${bidAmount}</div>`;
        });

        auksjonsliste += `
          <div class="auction-item">
            <h3>${item.title}</h3>
            <div>${item.description}</div>
            <div>Pris: ${item.price}</div>
            <div>Du har totalt: ${budFraBruker.length} bud:</div>
            ${budListeForBruker}
          </div>
        `;
      }

    }
  });

  const auctionView = `
    <div class="auction-container">
      <button onclick="${model.app.userId="0000002"}">Logg inn vanlig bruker </button><br><br>
      <button>Alle Auksjoner</button> 
      <button onclick="activeAuctionList()">Dine Aktive Auksjoner</button> 
      <button> Dine Avsluttende auksjoner</button>
      ${auksjonsliste || '<div>Du har ingen aktive Auksjoner</div>'}
    </div>`;

  document.getElementById('app').innerHTML = auctionView;
};
function AvlusttendeAuksjoner(){
// Alle avsluttende auksjoner som du har deltatt i
// + de du har vunnet!! 


}
