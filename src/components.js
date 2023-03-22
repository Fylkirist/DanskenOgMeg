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
inputFirstName.oninput = function (){
    model.inputs.register.firstName = inputFirstName.value;
};
inputLastName.oninput = function(){
    model.inputs.register.lastName = inputLastName.value;
}


let contPhoneMail = document.createElement('div')
let inputMail = document.createElement('input');
let inputPhone = document.createElement('input');
inputMail.oninput = function(){
    model.inputs.register.email = inputMail.value;
}
inputPhone.oninput = function(){
    model.inputs.register.mobile = inputPhone.value;
}



let contUserPass = document.createElement('div');
let inputUsername = document.createElement('input');
let inputPassword = document.createElement('input');
let inputRepeatPassword = document.createElement('input');
inputUsername.oninput = function(){
    model.inputs.register.userName = inputUsername.value;
}
inputPassword.oninput = function(){
    model.inputs.register.password = inputPassword.value;
}
inputRepeatPassword.oninput = function(){
model.inputs.register.repeatPassword = inputRepeatPassword.value}


let inputAdress = document.createElement('input');
let inputZip = document.createElement('input');
let inputCity = document.createElement('input');
let contAdress = document.createElement('div')

inputAdress.oninput = function (){
    model.inputs.register.address = inputAdress.value;
}
inputZip.oninput = function (){
    model.inputs.register.zip = inputZip.value;
}
inputCity.oninput = function (){
    model.inputs.register.city = inputCity.value;
}




let inputCard = document.createElement('input');
let inputEndDate = document.createElement('input');
let inputCve = document.createElement('input');
let contCardInfo = document.createElement('div')
inputCard.oninput = function (){
    model.inputs.register.cardNumber = inputCard.value;
}
inputEndDate.oninput = function (){
    model.inputs.register.fromDate = inputEndDate.value;
}

let Register = document.createElement('button')
let Melding = document.createElement('div')
Register.textContent = "Register";
    Register.onclick = function () 
        {
            if(model.inputs.register.password !== model.inputs.register.repeatPassword)
                {
                    Melding.textContent = "Passordene matcher ikke"
                    updateView()
                    return;
                }
        RegisterPushUser();
        }

inputFirstName.placeholder = "First Name";
inputLastName.placeholder= "Last Name"
inputMail.placeholder="Email"
inputPhone.placeholder="Telefon Nr:"
inputUsername.placeholder="Brukernavn: "
inputPassword.placeholder="Passord: "
inputRepeatPassword.placeholder="Gjenta Passord: "
inputAdress.placeholder = "Adresse: "
inputZip.placeholder = "Post nummer: "
inputCity.placeholder = "By: "
inputCard.placeholder = "Card info"
inputCve.placeholder = "CVE"
inputEndDate.type = "date";



contName.appendChild(inputFirstName);
contName.appendChild(inputLastName);

contPhoneMail.appendChild(inputMail)
contPhoneMail.appendChild(inputPhone)

contUserPass.appendChild(inputUsername)
contUserPass.appendChild(inputPassword)
contUserPass.appendChild(inputRepeatPassword)

contAdress.appendChild(inputAdress)
contAdress.appendChild(inputZip)
contAdress.appendChild(inputCity)

contCardInfo.appendChild(inputCard)
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
container.appendChild(Register)


return container;




        
}
