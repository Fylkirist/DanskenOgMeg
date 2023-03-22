function searchForItems(searchedInputWords){
    
    model.inputs.searchPage.searchedWords = '';
    model.inputs.searchPage.matchedItemsIndices = [];
    model.inputs.searchPage.categoryMatched = false;

    model.inputs.filteredProductPage.selectedMainCategories = [];
    model.inputs.filteredProductPage.selectedSubCategories = [];

    model.app.currentView = 'filteredPage';

    let searchedWords = searchedInputWords.trim().toLowerCase();
    let searchedWordsArray = searchedWords.split(' ');
   
    model.inputs.searchPage.searchedWords = searchedWords;

    let matchedWithTitle = false;
    let matchedWithAllCategories = false;



    if(searchedWords.length > 1){
        for(let i = 0; i < model.inputs.category.selectedMainCategories.length; i++){
                
            model.inputs.category.selectedMainCategories[i].title = '';
            model.inputs.category.selectedMainCategories[i].checked = false;

            for(let j = 0; j < model.inputs.category.selectedMainCategories[i].selectSubCategories.length; j++){
                model.inputs.category.selectedMainCategories[i].selectSubCategories[j].title = '';
                model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked = false;
            }
        }

        for(let i = 0; i < model.data.items.length; i++){

            
            let itemTitleArray = model.data.items[i].title.toLowerCase().split(' ');

            let matchedWordsOrNot = 0;

            for(let k = 0; k<searchedWordsArray.length; k++){
                for(let l = 0; l<itemTitleArray.length; l++){
                    if (searchedWordsArray[k] === itemTitleArray[l]){
                        matchedWordsOrNot++;
                    }
                }
            }

            if(model.data.items[i].title.toLowerCase() === searchedWords){
                
                model.inputs.searchPage.matchedItemsIndices.push(i);
                matchedWithTitle = true;
                let mainCategoryIndex;
                let subCategoryIndex;
                for(let m = 0; m < model.data.itemsCategory.length; m++){
                    for(let n = 0; n < model.data.itemsCategory[m].subCategory.length; n++){
                        if(model.data.items[i].category.includes(model.data.itemsCategory[m].subCategory[n].title)){
                            mainCategoryIndex = m;
                            subCategoryIndex = n;
                            break;
                        }

                    }
                }
                selectSubCategory(mainCategoryIndex, subCategoryIndex, true);
                break;
            }
            else if(model.data.items[i].title.toLowerCase().includes(searchedWords)||
                    searchedWords.includes(model.data.items[i].title.toLowerCase())){
                
                model.inputs.searchPage.matchedItemsIndices.push(i);
                matchedWithTitle = true;

                let mainCategoryIndex;
            
                for(let m = 0; m < model.data.itemsCategory.length; m++){
                    
                        if(model.data.items[i].category.includes(model.data.itemsCategory[m].title)){
                            mainCategoryIndex = m;
                            
                            break;
                        }
                }
                selectMainCategory(mainCategoryIndex, true);
            }

            else if (matchedWordsOrNot > 0){
                
                model.inputs.searchPage.matchedItemsIndices.push(i);
                matchedWithTitle = true;
                let mainCategoryIndex;
            
                for(let m = 0; m < model.data.itemsCategory.length; m++){
                    
                        if(model.data.items[i].category.includes(model.data.itemsCategory[m].title)){
                            mainCategoryIndex = m;
                            
                            break;
                        }
                }
                selectMainCategory(mainCategoryIndex, true);

            }
            
        }
        if(!matchedWithTitle){


            for(let i = 0; i <model.data.itemsCategory.length; i++){
                let subCategoryMatched = false;
                
                for(let j = 0; j <model.data.itemsCategory[i].subCategory.length; j++){

                    let subCategoryTitleArray = model.data.itemsCategory[i].subCategory[j].title.toLowerCase().split(' ');
                    let matchedSubCategoryTitleOrNot = 0;

                    for(let k = 0; k<searchedWordsArray.length; k++){
                        for(let l = 0; l<subCategoryTitleArray.length; l++){
                            if (searchedWordsArray[k] === subCategoryTitleArray[l]){
                                matchedSubCategoryTitleOrNot++;
                            }
                        }
                    }



                    if(model.data.itemsCategory[i].subCategory[j].title.toLowerCase() === searchedWords ||
                    searchedWords.includes(model.data.itemsCategory[i].subCategory[j].title.toLowerCase()) ||
                    model.data.itemsCategory[i].subCategory[j].title.toLowerCase().includes(searchedWords) ||
                    matchedSubCategoryTitleOrNot > 0){
                            model.inputs.searchPage.categoryMatched = true;
                            subCategoryMatched = true;
                            matchedWithAllCategories = true;
                            selectSubCategory(i, j, true);
                            break;
                    }
                }
                if(!subCategoryMatched){
                    let mainCategoryTitleArray = model.data.itemsCategory[i].title.toLowerCase().split(' ');
                    let matchedMainCategoryTitleOrNot = 0;

                    for(let m = 0; m<searchedWordsArray.length; m++){
                        for(let n = 0; n<mainCategoryTitleArray.length; n++){
                            if (searchedWordsArray[m] == mainCategoryTitleArray[n]){
                                matchedMainCategoryTitleOrNot++;
                            }
                        }
                    }

                    if(model.data.itemsCategory[i].title.toLowerCase() === searchedWords ||
                    searchedWords.includes(model.data.itemsCategory[i].title.toLowerCase())||
                    model.data.itemsCategory[i].title.toLowerCase().includes(searchedWords) ||
                    matchedMainCategoryTitleOrNot > 0){

                            model.inputs.searchPage.categoryMatched = true;
                            matchedWithAllCategories = true;
                            selectMainCategory(i, true);
                            break;
                    }
                }
            }
        }
    }

        //model.app.currentView = 'filteredPage';
        model.inputs.category.wholeCategoryShow = true;

    

    updateView();

}


