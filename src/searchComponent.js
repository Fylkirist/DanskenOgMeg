function createSearchComponent(){
    let searchContainer = document.createElement('div');
    searchContainer.classList = 'searchContainer';

    let searchBox = document.createElement('input');
    searchBox.type = 'search';
    //searchBox.name = 'q';
    searchBox.placeholder = 'Search for items here';
    // searchBox.size = '30';
    // searchBox.required = true;
    searchBox.classList = 'searchBox';
    searchBox.value = model.inputs.searchPage.searchedWords;
    searchBox.setAttribute('onchange', 'searchForItems(this.value)');

    searchContainer.appendChild(searchBox);


    return searchContainer;
}