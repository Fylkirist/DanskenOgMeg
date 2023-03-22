function searchForItems(searchedInputWords){
    
    model.inputs.searchPage.searchedWords = '';
    model.inputs.searchPage.matchedItemsIndices = [];

    let searchedWords = searchedInputWords.trim().toLowerCase();
   
    model.inputs.searchPage.searchedWords = searchedWords;

    let matchedWithTitle = false;

    for(let i = 0; i < model.data.items.length; i++){
        if(model.data.items[i].title.toLowerCase() === searchedWords){
            model.app.currentView = 'searchPage';
            model.inputs.searchPage.matchedItemsIndices.push(i);
            matchedWithTitle = true;
            break;
        }
        else if(model.data.items[i].title.toLowerCase().includes(searchedWords)){
            model.app.currentView = 'searchPage';
            model.inputs.searchPage.matchedItemsIndices.push(i);
            matchedWithTitle = true;
        }
        
    }
    if(!matchedWithTitle){

        for(let i = 0; i < model.inputs.category.selectedMainCategories.length; i++){
            
                model.inputs.category.selectedMainCategories[i].title = '';
                model.inputs.category.selectedMainCategories[i].checked = false;

                for(let j = 0; j < model.inputs.category.selectedMainCategories[i].selectSubCategories.length; j++){
                    model.inputs.category.selectedMainCategories[i].selectSubCategories[j].title = '';
                    model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked = false;
                }
        }

        for(let i = 0; i <model.data.itemsCategory.length; i++){
            let subCategoryMatched = false;
            
            for(let j = 0; j <model.data.itemsCategory[i].subCategory.length; j++){

                if(model.data.itemsCategory[i].subCategory[j].title.toLowerCase() === searchedWords ||
                   searchedWords.includes(model.data.itemsCategory[i].subCategory[j].title.toLowerCase()) ||
                   model.data.itemsCategory[i].subCategory[j].title.toLowerCase().includes(searchedWords)){
                        model.inputs.searchPage.categoryMatched = true;
                        subCategoryMatched = true;
                        selectSubCategory(i, j, true);
                        break;
                   }
            }
            if(!subCategoryMatched){
                if(model.data.itemsCategory[i].title.toLowerCase() === searchedWords ||
                searchedWords.includes(model.data.itemsCategory[i].title.toLowerCase()) ||
                model.data.itemsCategory[i].title.toLowerCase().includes(searchedWords)){
                        model.inputs.searchPage.categoryMatched = true;
                        selectMainCategory(i, true);
                        break;
                }
            }
        }
    }

    updateView();

}