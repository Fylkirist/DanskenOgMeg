const app = document.getElementById("app")

function updateView(){
    switch(model.app.currentView){
        case "frontPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showSearchBox() + frontPageProductView()
            break
        case "filteredPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showSearchBox() + showFilterBox() + showFilteredProducts()
            break
        case "registerPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + registerFormView();
            break
        case "productPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showSearchBox() + productDisplay(model.app.currentProduct)
            break
        case "createProduct":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showSearchBox() + createSaleView()
            break
        case "shoppingCart":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showShoppingCart()
            break
        case "adminAuction":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + adminAuctionPage()
            break
    }
}

//window.onload = updateView()