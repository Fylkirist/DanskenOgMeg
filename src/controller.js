function registerUser() {
    let inputs = model.inputs.register;
    if (inputs.firstName.length > 0 && // alle felter må være fylt ut før koden starter
        inputs.lastName.length > 0 &&
        inputs.email.length > 0 &&
        inputs.mobile.length > 0 &&
        inputs.userName.length > 0 &&
        inputs.password.length > 0 &&
        inputs.repeatPassword.length > 0 &&
        inputs.address.length > 0 &&
        inputs.zip.length > 0){    
        let brukernavnTatt = false;
        for (let userID in model.data.users){
            console.log('Checking user ID:', userID);
            console.log('Existing username:', model.data.users[userID].username);
            console.log('Input username:', model.inputs.register.userName);

            if(model.data.users[userID].username === model.inputs.register.userName){
                brukernavnTatt = true;
                break;
            }
        }
        if(brukernavnTatt)
        {    
            let messageContainer = document.getElementById('melding');
            messageContainer.innerHTML = `<p>Det er ikke unikt brukernavn!!!</p>`;
            return;
        }
        if (model.inputs.register.password === model.inputs.register.repeatPassword)
        { 
            const newUser = { // dytter inn objekt basert på inputt
                username:model.inputs.register.userName,                        
                password:model.inputs.register.password,  
                permissions: 'user',
                firstName:model.inputs.register.firstName,
                surname:model.inputs.register.surname,
                address:model.inputs.register.address,
                email:model.inputs.register.email,
                mobile:model.inputs.register.mobile,
                shoppingCart:[],
                auctionList:[],
                paymentInformation:[
                    {
                        cardNumber: model.inputs.register.cardNumber,
                        expirationDate:model.inputs.register.fromDate,
                        cardHolderFirstName:model.inputs.register.firstName,
                        cardHolderLastName:model.inputs.register.surname,
                        address:model.inputs.register.address,
                        zip:model.inputs.register.zip,
                        houseNumber:"",                    
                    }
                ],
                messages:[],
            };
            const newUserID = '000000' + (Object.keys(model.data.users).length +1);    // id property for objekte
            model.data.users[newUserID] = newUser;                  

            let messageContainer = document.getElementById('melding');
            messageContainer.innerHTML = `<p>Velkommen til VintageSkatter !!!</p>`;
        } 
        else if (model.inputs.register.password !== model.inputs.register.repeatPassword)  // Fix this line
        {
            let messageContainer = document.getElementById('melding');
            messageContainer.innerHTML = `<p>Passordene stemmer ikke overens!</p>`;
        }  
    }
    else {
        let messageContainer = document.getElementById('melding');
        messageContainer.innerHTML = `<p>Alle feltene er ikke fylt ut!!!</p>`;
        console.log(inputs);

        return;
    }
}
function isValid(input) {
    let cardNumber = input.value.replace(/\s/g,''); // remove any whitespace from the input
    if (/[^0-9-\s]+/.test(cardNumber)) return false; // invalid characters
    let sum = 0, double = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      if (double) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      double = !double;
    }
    return (sum % 10) == 0;
  }
  