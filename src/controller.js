function registerUser() {

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
    if (model.inputs.register.password === model.inputs.register.repeatPassword) // Sjekker om passordet som er repeat er likt.
  
    { //
            const newUser = {
                username:model.inputs.register.userName,
                passowrd:model.inputs.register.password,
                permissions: 'user',
                firstName:model.inputs.register.firstName,
                surname:model.inputs.register.surname,
                address:model.inputs.register.address,
                email:model.inputs.register.email,
                mobile:model.inputs.register.mobile,
                shoppingCart:[],
                auctionList:[],
                paymentInformation:[],
                messages:[]
            };
            const newUserID = '000000' + (Object.keys(model.data.users).length +1);
            model.data.users[newUserID] = newUser;

            let messageContainer = document.getElementById('melding');
            messageContainer.innerHTML = `<p>Registration completed!</p>`;


    }
    else if (model.inputs.register.password !== model.inputs.register.repeatPassword)
    {
        {
            let messageContainer = document.getElementById('melding');
            messageContainer.innerHTML = `<p>Passordene stemmer ikke overens!</p>`;
        } 
    }
 
};
