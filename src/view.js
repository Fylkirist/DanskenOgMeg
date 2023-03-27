const app = document.getElementById("app")

function updateView(){
    app.innerHTML = ""
    switch(model.app.currentView){
        case "frontPage":
            app.innerHTML += createHeaderSection() + frontPageProductView()
            break
        case "filteredPage":
            app.innerHTML += showFilterBox() + showFilteredProducts()
            break
        case "registerPage":
            break
    }
}