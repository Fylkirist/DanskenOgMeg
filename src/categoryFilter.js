function showCategory(){
    let container = document.createElement('div');
    container.id = 'categoryContainer';

    let categoryText = document.createElement('span');
    categoryText.textContent = 'Kategorier ↓';
    categoryText.className = 'categoryText';
    categoryText.setAttribute('onclick', 'showHideCategories()');
    container.appendChild(categoryText);

    let mainCategoriesContainer = document.createElement('div');
    mainCategoriesContainer.id = 'mainCategoriesContainer';

    if (model.inputs.category.wholeCategoryShow) {

        for(let i = 0; i<model.data.itemsCategory.length; i++){

            let CategoryContainer = document.createElement('div');
            CategoryContainer.id = 'CategoryContainer';

            let checkedInputMain = document.createElement('input');
            checkedInputMain.setAttribute('type', 'checkbox');
            checkedInputMain.checked = model.inputs.category.selectedMainCategories[i].checked;
            checkedInputMain.setAttribute('onchange', `selectMainCategory(${i}, this.checked)`);

            let categoryNameMain = document.createElement('p');
            categoryNameMain.className= 'categoryNameMain';
            categoryNameMain.textContent = model.data.itemsCategory[i].title + ' ↓';
            categoryNameMain.setAttribute('onclick', `showHideSubCategories(${i})`);


            CategoryContainer.appendChild(checkedInputMain);
            CategoryContainer.appendChild(categoryNameMain);

            if (model.inputs.category.selectedMainCategories[i].showSubCategories) {
                for(let j = 0; j < model.data.itemsCategory[i].subCategory.length; j++){

                    let subCategoryContainer = document.createElement('div');
                    subCategoryContainer.id = 'subCategoryContainer';

                    let checkedInputSub = document.createElement('input');
                    checkedInputSub.setAttribute('type', 'checkbox');
                    checkedInputSub.checked = model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked;
                    //model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked = checkedInputSub.checked;
                    checkedInputSub.setAttribute('onchange', `selectSubCategory(${i}, ${j}, this.checked)`);
                    

                    let subCategoryName = document.createElement('p');
                    subCategoryName.className = 'categoryNameSub';
                    subCategoryName.textContent = model.data.itemsCategory[i].subCategory[j].title;
                    subCategoryName.setAttribute('onclick', `selectSubCategoryOnClick(${i}, ${j})`);
                    checkedInputSub.checked = model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked;

                    subCategoryContainer.appendChild(checkedInputSub);
                    subCategoryContainer.appendChild(subCategoryName);

                    CategoryContainer.appendChild(subCategoryContainer);
                }

            }
        

            mainCategoriesContainer.appendChild(CategoryContainer);

            
        }
        container.appendChild(mainCategoriesContainer);

        let priceSliderContainer = document.createElement('div');
        priceSliderContainer.classList = 'priceSlider';

        let priceSliderHeader = document.createElement('h5');
        priceSliderHeader.textContent = 'Price Range: ';
        priceSliderContainer.appendChild(priceSliderHeader);

        let priceSliderUnderHeading = document.createElement('p');
        priceSliderUnderHeading.textContent = 'Move Slider to choose the price range. ';
        priceSliderContainer.appendChild(priceSliderUnderHeading);

        let minMaxTextContainer = document.createElement('div');
        minMaxTextContainer.classList = 'min-max';

        let minTextContainer = document.createElement('div');
        minTextContainer.classList = 'min';

        let minTextLabel = document.createElement('label');
        minTextLabel.textContent = 'Min: ';
        minTextContainer.appendChild(minTextLabel);

        let minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.min = '0';
        minInput.max = '50000';
        minInput.step = '1000';
        minInput.value = model.inputs.filteredProductPage.priceRange.min;
        minInput.setAttribute('onchange', 'setMinPriceRange(this.value)');
        minTextContainer.appendChild(minInput);
        minMaxTextContainer.appendChild(minTextContainer);

        let maxTextContainer = document.createElement('div');
        maxTextContainer.classList = 'max';

        let maxTextLabel = document.createElement('label');
        maxTextLabel.textContent = 'Max: ';
        maxTextContainer.appendChild(maxTextLabel);

        let maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.min = '50001';
        maxInput.max = '99999';
        maxInput.value = model.inputs.filteredProductPage.priceRange.max;
        maxInput.setAttribute('onchange', 'setMaxPriceRange(this.value)');
        maxTextContainer.appendChild(maxInput);
        minMaxTextContainer.appendChild(maxTextContainer);
       
        priceSliderContainer.appendChild(minMaxTextContainer);

        let minMaxRangeContainer = document.createElement('div');
        minMaxRangeContainer.classList = 'min-max-range';

        let minRange = document.createElement('input');
        minRange.classList = 'range';
        minRange.type = 'range';
        minRange.min = '0';
        minRange.max = '50000';
        minRange.step = '1000';
        minRange.value = model.inputs.filteredProductPage.priceRange.min;
        minRange.setAttribute('onchange', 'setMinPriceRange(this.value)');
        minMaxRangeContainer.appendChild(minRange);

        let maxRange = document.createElement('input');
        maxRange.classList = 'range';
        maxRange.type = 'range';
        maxRange.min = '50001';
        maxRange.max = '99999';
        maxRange.step = '1000';
        maxRange.value = model.inputs.filteredProductPage.priceRange.max;
        maxRange.setAttribute('onchange', 'setMaxPriceRange(this.value)');
        minMaxRangeContainer.appendChild(maxRange);

        priceSliderContainer.appendChild(minMaxRangeContainer);

        let clearStyleDiv = document.createElement('div');
        clearStyleDiv.style.clear = 'both';

        priceSliderContainer.appendChild(clearStyleDiv);




        container.appendChild(priceSliderContainer);

    }
  



    


    return container;
}