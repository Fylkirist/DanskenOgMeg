function filteredPageUpdateView(){
    let container = document.createElement('div');
    container.id= 'filteredPageViewContainer';
    container.appendChild(showCategory());

    let products = document.createElement('div');
    products.id = 'filteredProducts';

    let categoryHeader = document.createElement('h4');
    categoryHeader.textContent = 'Products in Selected Categories';
    categoryHeader.id = 'categoryHeader';
    products.appendChild(categoryHeader);

    if(model.inputs.filteredProductPage.selectedMainCategories.length === 1 ) {
        let showText = document.createElement('p');
        showText.textContent = 'No categories have been chosen.';
        products.appendChild(showText);
    }
    else if(model.inputs.filteredProductPage.selectedSubCategories.length > 1 ) {
   
            for(let i = 0; i < model.data.items.length; i++){
                let productContainer = document.createElement('div');
                productContainer.className = 'productContainer';

                for(let j=0; j<model.data.items[i].category.length; j++){
                    let categoryName = model.data.items[i].category[j];
                    if (model.inputs.filteredProductPage.selectedSubCategories.includes(categoryName)){
                        let productTitle = document.createElement('p');
                        productTitle.textContent = model.data.items[i].title;
                        productContainer.appendChild(productTitle);

                        let productImage = document.createElement('img');
                        productImage.src = model.data.items[i].images[0];
                        productContainer.appendChild(productImage);
                        products.appendChild(productContainer);
                        break;
                    }

                }

            }
        }
    else if (model.inputs.filteredProductPage.selectedMainCategories.length > 1){

            for(let i = 0; i < model.data.items.length; i++){
                let productContainer = document.createElement('div');
                productContainer.className = 'productContainer';

                for(let j=0; j<model.data.items[i].category.length; j++){
                    let categoryName = model.data.items[i].category[j];

                    if (model.inputs.filteredProductPage.selectedMainCategories.includes(categoryName)){
                        let productTitle = document.createElement('p');
                        productTitle.textContent = model.data.items[i].title;
                        productContainer.appendChild(productTitle);

                        let productImage = document.createElement('img');
                        productImage.src = model.data.items[i].images[0];
                        productContainer.appendChild(productImage);
                        products.appendChild(productContainer);
                        break;
                    }

                }

            }
        }
    
    
    container.appendChild(products);


    return container;
}