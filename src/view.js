const app = document.getElementById("app")

function updateView(){
    switch(model.app.currentView){
        case "frontPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showSearchBox() + (model.app.loggedInStatus && model.data.users[model.app.userId].permissions == "admin"? renderFrontPageAdminSettings() : frontPageProductView()) + createPageFooter()
            break
        case "filteredPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showSearchBox() + showFilterBox() + showFilteredProducts() + createPageFooter()
            break
        case "registerPage":
            app.innerHTML = registerFormView();
            break
        case "productPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showSearchBox() + productDisplay(model.app.currentProduct) + createPageFooter()
            break
        case "createProduct":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showSearchBox() + createSaleView() + createPageFooter()
            break
        case "shoppingCart":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showShoppingCart() + createPageFooter()
            break
        case "loginPage":
            app.innerHTML = createLoginPage()
            break
        case "manageMembersPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + adminMembersPage()
            break
        case "checkoutPage":
            app.innerHTML = createHeaderSection() + checkOut() + createPageFooter()
            break
        case "adminAuction":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + adminAuctionPage() + createPageFooter()
            break
        case "auctionPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + createPageFooter()
            break
        case "editUserPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent + editUserPage() + createPageFooter()
    }
}

window.onload = updateView()