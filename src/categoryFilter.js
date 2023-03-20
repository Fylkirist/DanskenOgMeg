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
                    checkedInputSub.setAttribute('onchange', `selectSubCategory(${i}, ${j}, this.checked)`);
                    subCategoryContainer.appendChild(checkedInputSub);

                    let subCategoryName = document.createElement('p');
                    subCategoryName.className = 'categoryNameMain';
                    subCategoryName.textContent = model.data.itemsCategory[i].subCategory[j].title;
                    subCategoryContainer.appendChild(subCategoryName);

                    CategoryContainer.appendChild(subCategoryContainer);
                }

            }
        

            mainCategoriesContainer.appendChild(CategoryContainer);

            
        }
        container.appendChild(mainCategoriesContainer);

    }
  



    


    return container;
}