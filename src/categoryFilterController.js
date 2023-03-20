function showHideCategories(){

    (model.inputs.category.wholeCategoryShow) ? model.inputs.category.wholeCategoryShow = false :
                                               model.inputs.category.wholeCategoryShow = true;

    updateView();
}
function selectMainCategory(mainCategoryIndex, trueOrFalse){
    if(trueOrFalse){
        model.inputs.category.selectedMainCategories[mainCategoryIndex].title = model.data.itemsCategory[mainCategoryIndex].title;    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = true;
        filteredCategories();
    }
    else if(!trueOrFalse){
        model.inputs.category.selectedMainCategories[mainCategoryIndex].title = '';    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = false;
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
    if(trueOrFalse){
        model.inputs.category.selectedMainCategories[mainCategoryIndex].title = model.data.itemsCategory[mainCategoryIndex].title;
        model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = true;
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].title = model.data.itemsCategory[mainCategoryIndex].subCategory[subCategoryIndex].title;    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].checked = true;
        filteredCategories();
    }
    else if(!trueOrFalse){
        // model.inputs.category.selectedMainCategories[mainCategoryIndex].title = '';
        // model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = false;
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].title = '';    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].checked = false;
        filteredCategories();
    }
    

    updateView();

}