function filteredPageUpdateView(){
    let container = document.createElement('div');
    container.appendChild(showCategory());

    let products = document.createElement('div');
    products.id = 'filteredProducts';

    let categoryHeader = document.createElement('ul');
    categoryHeader.textContent = 'Selected Categories';

    for(let i = 0; i < model.inputs.filteredProductPage.selectedCategories.length; i++){
        let productCategories = document.createElement('li');
        productCategories.textContent = model.inputs.filteredProductPage.selectedCategories[i];

        categoryHeader.appendChild(productCategories);

    }
    products.appendChild(categoryHeader);
    container.appendChild(products);


    return container;
}