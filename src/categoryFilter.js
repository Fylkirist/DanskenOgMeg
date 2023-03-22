function showCategory(){
    return `
    <div id="categoryContainer">
        <span class="categoryText" onclick="showHideCategories()"> Kategorier ↓</span>
        <div id="mainCategoriesContainer">
            ${(() => {
                let categoryHTML = '';
                if (model.inputs.category.wholeCategoryShow) {
                    for (let i = 0; i < model.data.itemsCategory.length; i++) {
                        categoryHTML += `
                            <div class="CategoryContainer">
                                <input type="checkbox" ${model.inputs.category.selectedMainCategories[i].checked? "checked":""} onchange="selectMainCategory(${i}, this.checked)" />
                                <p class="categoryNameMain" onclick="showHideSubCategories(${i})">${model.data.itemsCategory[i].title} ↓</p>
                                ${(() => {
                                    if (model.inputs.category.selectedMainCategories[i].showSubCategories) {
                                        let subCategoryHTML = '';
                                        for (let j = 0; j < model.data.itemsCategory[i].subCategory.length; j++) {
                                            subCategoryHTML += `
                                                <div class="subCategoryContainer">
                                                    <input type="checkbox" ${model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked ? 'checked':''}" onchange="selectSubCategoryOnClick(${i}, ${j})" />
                                                    <p class="categoryNameSub">${model.data.itemsCategory[i].subCategory[j].title}</p>
                                                </div>
                                            `;
                                        }
                                        return subCategoryHTML;
                                    } else {
                                        return '';
                                    }
                                })()}
                            </div>
                        `;
                    }
                }
                return categoryHTML;
            })()}
            <div class="priceSlider">
                <h5>Price Range:</h5>
                <p>Move Slider to choose the price range. </p>
                <div class="min-max">
                    <div class="min">
                        <label for="minPriceInput">Min: </label>
                        <input id="minPriceInput" type="number" min="0" max="50000" step="1000" value="${model.inputs.filteredProductPage.priceRange.min}" onchange="setMinPriceRange(this.value)" />
                    </div>
                    <div class="max">
                        <label for="maxPriceInput">Max: </label>
                        <input id="maxPriceInput" type="number" min="50001" max="99999" value="${model.inputs.filteredProductPage.priceRange.max}" onchange="setMaxPriceRange(this.value)" />
                    </div>
                </div>
                <div class="min-max-range">
                    <input class="range" type="range" min="0" max="50000" step="1000" value="${model.inputs.filteredProductPage.priceRange.min}" onchange="setMinPriceRange(this.value)" />
                    <input class="range" type="range" min="50001" max="99999" step="1000" value="${model.inputs.filteredProductPage.priceRange.max}" onchange="setMaxPriceRange(this.value)" />
                </div>
                <div style="clear:both;"></div>
            </div>
        </div>
    </div>
`;
}