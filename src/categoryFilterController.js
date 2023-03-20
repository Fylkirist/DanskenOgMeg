function showHideCategories(){

    (model.inputs.category.wholeCategoryShow) ? model.inputs.category.wholeCategoryShow = false :
                                               model.inputs.category.wholeCategoryShow = true;

    updateView();
}
function selectMainCategory(mainCategoryIndex, trueOrFalse){
    model.inputs.category.selectedMainCategories[mainCategoryIndex].title = model.data.itemsCategory[mainCategoryIndex].title;    
    model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = trueOrFalse;
    

    updateView();

}
function showHideSubCategories(mainCategoryIndex){
    
    (model.inputs.category.selectedMainCategories[mainCategoryIndex].showSubCategories) ? 
        model.inputs.category.selectedMainCategories[mainCategoryIndex].showSubCategories = false :
        model.inputs.category.selectedMainCategories[mainCategoryIndex].showSubCategories = true;

    updateView();
}
function selectSubCategory(mainCategoryIndex, subCategoryIndex, trueOrFalse){
    model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].title = model.data.itemsCategory[mainCategoryIndex].subCategory[subCategoryIndex].title;    
    model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].checked = trueOrFalse;
    

    updateView();

}