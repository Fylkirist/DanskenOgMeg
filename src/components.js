function frontPageProductView(){
    let topElem = generateFrontPageElement(model.data.frontPageTop[model.app.frontPageCurrentShowing.top])
    let botElem = generateFrontPageElement(model.data.frontPageBottom[model.app.frontPageCurrentShowing.bottom])
    return `
        <div id = "frontPageProductDisplay">
            <div class = "frontPageProductDisplayElement">
                <div onclick = "changeFrontPageTopProduct(1)" class = "frontPageRightArrow"></div>
                ${topElem}
                <div onclick = "changeFrontPageTopProduct(-1)" class = "frontPageLeftArrow"></div>
            </div>
            <div class = "frontPageProductDisplayElement">
                <div onclick = "changeFrontPageBotProduct(1)" class = "frontPageRightArrow"></div>
                ${botElem}
                <div onclick = "changeFrontPageBotProduct(-1)" class = "frontPageLeftArrow"></div>
            </div>
        </div>
    ` 
}

function generateFrontPageElement(item){
    let varElems;
    if (model.data.items[item].auction){
        varElems = `
            <label>Høyeste bud: </label>
            <label>${model.data.items[item].price}</label>
            <button onclick = "">Gå til auksjon</button>
        `
    }
    else{
        varElems = `
            <label>Pris: </label>
            <label>${model.data.items[item].price}</label>
            <button onclick = "">Legg til i handlekurv</button>
            <button onclick = "">Gå til produktside</button>
        `  
    }
    return `
        <div>
            <img src = "${model.data.items[item].images[0]}"/>
            <h4>${model.data.items[item].title}</h4>
            <p>${model.data.items[item].description}</p>
            ${varElems}    
        </div>
    ` 
}