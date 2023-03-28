const app = document.getElementById("app")

function updateView(){
    switch(model.app.currentView){
        case "frontPage":
            app.innerHTML = createHeaderSection() + showSearchBox() + frontPageProductView()
            break
        case "filteredPage":
            app.innerHTML = createHeaderSection() + showSearchBox() + showFilterBox() + showFilteredProducts()
            break
        case "registerPage":
            app.innerHTML = registerFormView();
            break
        case "productPage":
            app.innerHTML = createHeaderSection() + showSearchBox() + productDisplay(model.app.currentProduct)
            break
        case "createProduct":
            break
    }
}

window.onload(updateView())