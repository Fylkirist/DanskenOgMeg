function profileMenuComponent() {
    let html = `<div class="profileMenuContainer">
                <button class="dropdownKnapp" onclick="toggleProfileMenuDropDown()"><h2>Meny</h2></button>` 
    if(!model.inputs.profileMenuShowing){return html}
    if (model.app.userId === false) {
        html += `
        <div id="dropdownContent" style="display: none;">
        <div onclick="model.app.currentView='allProductsPage'">Alle produkter</div>
        <div onclick="model.app.currentView='auctionPage' ">Auksjons side</div>
        </div>` 
    }
    else if (model.data.users[model.app.userId].permissions === 'user') {
        html += `
        <div id="dropdownContent" style="display: none;">
                <div onclick="model.app.currentView='myProfilePage' ">Min Profil</div>
                 <div onclick="model.app.currentView='inboxPage' ">Innbox</div>
                 <div onclick="model.app.currentView='allProductsPage'">Alle produkter</div>
                 <div onclick="model.app.currentView='salePage'">Salgs Historikk</div>
                 <div onclick="model.app.currentView='auctionPage' ">Bud</div>
        </div>` 
    }

    if (model.data.users[model.app.userId] && model.data.users[model.app.userId].permissions === "admin") {
        html += `
        <div id="dropdownContent" style="display: none;">
                <div onclick="model.app.currentView='myProfilePage' ">Min Profil</div>
                 <div onclick="model.app.currentView='inboxPage' ">Innbox</div>
                 <div onclick="model.app.currentView='allProductsPage'">Alle produkter</div>
                 <div onclick="model.app.currentView='salePage'">Salgs Historikk</div>
                 <div onclick="model.app.currentView='auctionPage' ">Bud</div>
                 <div onclick="model.app.currentView='addProductPage' ">Legg til produkt</div>
                 <div onclick="model.app.currentView='membersPage' ">Medlemmer</div>
        </div>`
    }

    html += `</div>` 
}
