function filteredCategories(){
    model.inputs.filteredProductPage.selectedCategories = [''];
    for(let i = 0; i<model.inputs.category.selectedMainCategories.length; i++){
        if(model.inputs.category.selectedMainCategories[i].checked){
            model.inputs.filteredProductPage.selectedCategories.push(model.inputs.category.selectedMainCategories[i].title);  
            for(let j = 0; j < model.inputs.category.selectedMainCategories[i].selectSubCategories.length; j++){
                if(model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked){
                    model.inputs.filteredProductPage.selectedCategories.push(model.inputs.category.selectedMainCategories[i].selectSubCategories[j].title);
                }
            }
        }
        else if (!model.inputs.category.selectedMainCategories[i].checked){
            for(let j = 0; j < model.inputs.category.selectedMainCategories[i].selectSubCategories.length; j++){
                if(model.inputs.category.selectedMainCategories[i].selectSubCategories[j].checked){
                    model.inputs.filteredProductPage.selectedCategories.push(model.inputs.category.selectedMainCategories[i].selectSubCategories[j].title);
                }
            }
        }
    }
    updateView();
}