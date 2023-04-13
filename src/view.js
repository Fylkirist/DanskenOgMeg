const app = document.getElementById("app")

function updateView(){
    switch(model.app.currentView){
        case "frontPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showSearchBox() + frontPageProductView() + createPageFooter()
            break
        case "filteredPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + showSearchBox() + showFilterBox() + showFilteredProducts() + createPageFooter()
            break
        case "registerPage":
            app.innerHTML = createHeaderSection() + profileMenuComponent() + registerFormView();
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
    }
}

window.onload = updateView()