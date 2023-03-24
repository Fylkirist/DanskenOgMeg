function createSaleView(){
    return `
        <div class = "CreateSaleContainer">
            <label id = "productLabel">Produktnavn</input>
            <input id = "productName" type = "text" oninput = "model.inputs.createSale.title = this.value"/>
            <input id = "productDescription" type = "text" oninput = "model.inputs.createSale.description = this.value"
            <label id = "priceLabel">Pris: </label>
            <input id = "priceInput" type = "text" oninput = "model.inputs.createSale.price = this.value"></input>
            <label id = "categoryLabel">Legg til kategorier</label>
            <input id = "categoryMain" type = "text" oninput = "model.inputs.createSale.mainCategory = this.value" value = "model.inputs.createSale.mainCategory"></input>
            <button id = "mainCategoryAdd" onclick = "addMainCategory()">"Sett hovedkategori"</button>
            <input id = "categorySub" type = "text" oninput = "model.inputs.createSale.subCategory = this.value" placeholder = "Underkategori"/>
            <button id = "subCategoryAdd" onclick = "addSubCategory()">Legg til underkategori</button>
            <div id = "galleryFrame">Bildegalleri</div>
            <input oninput = "model.inputs.createSale.addImage = imageGalleryInput.value" type = "file" id = "galleryInput"></input>
            <button id = "addImageButton" onclick = "insertImage()">"Legg til bilde"</button>
            <input id = "mainPicture" type = "file" oninput = "model.inputs.createSale.mainImage = mainPicture.value"></input>
            <label id = "productId">${model.data.items[model.data.items.length -1].id++}</label>
            <label>Auksjon: </label>
            <input type = "checkbox" id = "auctionBox" ${model.inputs.createSale.auction? 'checked':''} onchange = "model.inputs.createSale.auction = !model.inputs.createSale.auction"/>
            <label>Budfrist</label>
            <input id = "deadline" type = "datetime-local" oninput = "model.inputs.createSale.deadline = this.value"></input>
            <input id = "minimumBidInput" type = "text" placeholder = "Minste tillatte budøkning" oninput = "model.inputs.createSale.minimumBidAmmount = this.value"></input>
            <label>Kan leveres:</label>
            <input id = "deliveryBox" type = "checkbox" ${model.inputs.createSale.deliver? "checked":""} onchange = "model.inputs.createSale.deliver = this.checked"></input>
            <button id = "saveButton" onclick = "createProduct()">Lagre produkt</button>
        </div>
    ` 
}