function updateView(){
    let container = document.getElementById('app');
    container.innerHTML = '';

    switch (model.app.currentView){
        case 'frontPage':
        container.appendChild(registerFormView())
        break;
    }


}


function registerFormView(){
let container = document.createElement("div");

let contName = document.createElement('div')
let inputFirstName = document.createElement('input');
let inputLastName = document.createElement('input');

inputFirstName.placeholder = "First Name";
inputLastName.placeholder= "Last Name"

contName.appendChild(inputFirstName);
contName.appendChild(inputLastName);

let contPhoneMail = document.createElement('div')
let inputMail = document.createElement('input');
let inputPhone = document.createElement('input');

inputMail.placeholder="Email"
inputPhone.placeholder="Telefon Nr:"

contPhoneMail.appendChild(inputMail)
contPhoneMail.appendChild(inputPhone)

let contUserPass = document.createElement('div');
let inputUsername = document.createElement('input');
let inputPassword = document.createElement('input');
let inputRepeatPassword = document.createElement('input');

inputUsername.placeholder="Brukernavn: "
inputPassword.placeholder="Passord: "
inputRepeatPassword.placeholder="Gjenta Passord: "



contUserPass.appendChild(inputUsername)
contUserPass.appendChild(inputPassword)
contUserPass.appendChild(inputRepeatPassword)


let inputAdress = document.createElement('input');
let inputZip = document.createElement('input');
let inputCity = document.createElement('input');
let contAdress = document.createElement('div')

inputAdress.placeholder = "Adresse: "
inputZip.placeholder = "Post nummer: "
inputCity.placeholder = "By: "

contAdress.appendChild(inputAdress)
contAdress.appendChild(inputZip)
contAdress.appendChild(inputCity)


let inputCard = document.createElement('input');
let inputStartDate = document.createElement('input');
let inputEndDate = document.createElement('input');
let inputCve = document.createElement('input');
let contCardInfo = document.createElement('div')

inputStartDate.type = "time";
inputEndDate.type = ""

contCardInfo.appendChild(inputCard)
contCardInfo.appendChild(inputStartDate)
contCardInfo.appendChild(inputEndDate)
contCardInfo.appendChild(inputCve)
contCardInfo.className="form-group"


container.className="form-container"
contAdress.className="form-group";
contUserPass.className="form-group"
contPhoneMail.className="form-group"
contName.className="form-group"




container.appendChild(contName)
container.appendChild(contPhoneMail)
container.appendChild(contUserPass)
container.appendChild(contAdress)
container.appendChild(contCardInfo)


return container;




        
}
