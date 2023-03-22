function searchForItems(searchedInputWords){
    model.app.currentView = 'searchPage';
    model.inputs.searchPage.searchedWords = '';
    model.inputs.searchPage.matchedItemsIndices = [];


    let searchedWords = searchedInputWords.trim().toLowerCase();
   
    model.inputs.searchPage.searchedWords = searchedInputWords;

    for(let i = 0; i < model.data.items.length; i++){
        if(model.data.items[i].title.toLowerCase() === searchedWords){
            model.inputs.searchPage.matchedItemsIndices.push(i);
            break;
        }
        else if(model.data.items[i].title.toLowerCase().includes(searchedWords)){
            model.inputs.searchPage.matchedItemsIndices.push(i);
        }
        

    }


    updateView();

}