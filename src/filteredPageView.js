function filteredPageUpdateView(){
    let filteredProducts = '';
    let showText = '';

    if (model.inputs.filteredProductPage.selectedMainCategories.length === 0) {
        showText = `<p>No categories have been chosen.</p>`;
    } 
    else{
        for (let i = 0; i < model.data.items.length; i++) {
            for (let j = 0; j < model.data.items[i].category.length; j++) {
                let categoryName = model.data.items[i].category[j];

                if (
                    model.inputs.filteredProductPage.selectedSubCategories.includes(categoryName) &&
                    model.data.items[i].price > eval(model.inputs.filteredProductPage.priceRange.min) &&
                    model.data.items[i].price < eval(model.inputs.filteredProductPage.priceRange.max)
                ) {
                    filteredProducts += `<div class="productContainer">
                                            <p>${model.data.items[i].title}</p>
                                            <img src="${model.data.items[i].images[0]}">
                                        </div>`;
                    break;
                }

                if (
                    model.inputs.filteredProductPage.selectedMainCategories.includes(categoryName) &&
                    model.data.items[i].price > eval(model.inputs.filteredProductPage.priceRange.min) &&
                    model.data.items[i].price < eval(model.inputs.filteredProductPage.priceRange.max)
                ) {
                    filteredProducts += `<div class="productContainer">
                                            <p>${model.data.items[i].title}</p>
                                            <img src="${model.data.items[i].images[0]}">
                                        </div>`;
                     break;
                }
            }
        }
    }

  let container = `
    <div id="filteredPageViewContainer">
      ${showCategory()}
      <div id="filteredProducts">
        <h4 id="categoryHeader">Products in Selected Categories</h4>
        ${showText}
        ${filteredProducts}
      </div>
    </div>
  `;

  return container;
}