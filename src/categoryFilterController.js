function showHideCategories(){

    (model.inputs.category.wholeCategoryShow) ? model.inputs.category.wholeCategoryShow = false :
                                               model.inputs.category.wholeCategoryShow = true;

    updateView();
}
function selectMainCategory(mainCategoryIndex, trueOrFalse){
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
        // model.inputs.category.selectedMainCategories[mainCategoryIndex].title = '';
        // model.inputs.category.selectedMainCategories[mainCategoryIndex].checked = false;
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].title = '';    
        model.inputs.category.selectedMainCategories[mainCategoryIndex].selectSubCategories[subCategoryIndex].checked = false;
        filteredCategories();
    }
    

    updateView();

}