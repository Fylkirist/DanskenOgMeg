function showSearchBox() {
    return /*html*/ `
    <div class="searchContainer">
        <div class="searchBox">
            <input type="text" oninput="model.inputs.search.input = this.value" onchange="doSearch()">
            <button onclick="doSearch()">Søk</button>
        </div>
    </div>
    `;
}