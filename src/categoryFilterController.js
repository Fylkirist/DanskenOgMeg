function showHideCategories(){

    (model.inputs.category.wholeCategoryShow) ? model.inputs.category.wholeCategoryShow = false :
                                               model.inputs.category.wholeCategoryShow = true;

    updateView();
}
function selectMainCategory(mainCategoryIndex, trueOrFalse){
    model.app.currentView = 'filteredPage';
    model.inputs.category.wholeCategoryShow = true;
    if(trueOrFalse){
        for (let i = 0; i < model.inputs.category.selectedMainCategories.length; i ++){
              for(let j = 0; j < model.inputs.category.selectedMainCategories[i].selectSubCategories.length; j++){
                model.inputs.category.selectedMainCategories[i].selectSubCategories[j].title = '';
                model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked = false;
            }
        } 
        model.inputs.category.selectedMainCategories[mainCategoryIndex].title = model.data.itemsCategory[mainCategoryIndex].title;    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = true;
        filteredCategories();
    }
    else if(!trueOrFalse){
        model.inputs.category.selectedMainCategories[mainCategoryIndex].title = '';    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = false;
        for(let i = 0; i <model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories.length; i++ ){
            model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[i].checked = false;
            model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[i].title = '';
        }
        filteredCategories();
    }
    

    updateView();

}
function showHideSubCategories(mainCategoryIndex){
    
    (model.inputs.category.selectedMainCategories[mainCategoryIndex].showSubCategories) ? 
        model.inputs.category.selectedMainCategories[mainCategoryIndex].showSubCategories = false :
        model.inputs.category.selectedMainCategories[mainCategoryIndex].showSubCategories = true;

    updateView();
}
function selectSubCategory(mainCategoryIndex, subCategoryIndex, trueOrFalse){
    model.app.currentView = 'filteredPage';
    model.inputs.category.wholeCategoryShow = true;
    model.inputs.category.selectedMainCategories[mainCategoryIndex].showSubCategories = true;
    if(trueOrFalse){
        for(let i = 0; i < model.inputs.category.selectedMainCategories.length; i++){
            if(i !== mainCategoryIndex){
                model.inputs.category.selectedMainCategories[i].title = '';
                model.inputs.category.selectedMainCategories[i].checked = false;
                for(let j = 0; j < model.inputs.category.selectedMainCategories[i].selectSubCategories.length; j++){
                    model.inputs.category.selectedMainCategories[i].selectSubCategories[j].title = '';
                    model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked = false;
                }
            }   

        }
        model.inputs.category.selectedMainCategories[mainCategoryIndex].title = model.data.itemsCategory[mainCategoryIndex].title;
        model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = true;
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].title = model.data.itemsCategory[mainCategoryIndex].subCategory[subCategoryIndex].title;    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].checked = true;
        filteredCategories();
    }
    else if(!trueOrFalse){
        model.app.currentView = 'filteredPage';
        // model.inputs.category.selectedMainCategories[mainCategoryIndex].title = '';
        // model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = false;
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].title = '';    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].checked = false;
        filteredCategories();
    }
    

    updateView();

}
function selectSubCategoryOnClick(mainCategoryIndex, subCategoryIndex){
    model.app.currentView = 'filteredPage';
    if(!model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].checked){
        for(let i = 0; i < model.inputs.category.selectedMainCategories.length; i++){
            if(i !== mainCategoryIndex){
                model.inputs.category.selectedMainCategories[i].title = '';
                model.inputs.category.selectedMainCategories[i].checked = false;
                for(let j = 0; j < model.inputs.category.selectedMainCategories[i].selectSubCategories.length; j++){
                    model.inputs.category.selectedMainCategories[i].selectSubCategories[j].title = '';
                    model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked = false;
                }
            }   

        }
        model.inputs.category.selectedMainCategories[mainCategoryIndex].title = model.data.itemsCategory[mainCategoryIndex].title;
        model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = true;
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].title = model.data.itemsCategory[mainCategoryIndex].subCategory[subCategoryIndex].title;    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].checked = true;
        filteredCategories();
    }
    else if(model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].checked){
        // model.inputs.category.selectedMainCategories[mainCategoryIndex].title = '';
        // model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = false;
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].title = '';    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].checked = false;
        filteredCategories();
    }
    updateView();
}
function setMinPriceRange(minPriceRange){
    model.app.currentView = 'filteredPage';
    model.inputs.filteredProductPage.priceRange.min = minPriceRange;
    if(eval(minPriceRange) > 50000) {
        model.inputs.filteredProductPage.priceRange.min = '50000';
    }


    updateView();

}
function setMaxPriceRange(maxPriceRange){
    model.app.currentView = 'filteredPage';
    model.inputs.filteredProductPage.priceRange.max = maxPriceRange;
    if(eval(maxPriceRange) < 50001) {
        model.inputs.filteredProductPage.priceRange.max = '50001';
    }



    updateView();

}