function registerUser() {
    let inputs = model.inputs.register;
    if (inputs.firstName.length > 0 &&
        inputs.lastName.length > 0 &&
        inputs.email.length > 0 &&
        inputs.mobile.length > 0 &&
        inputs.userName.length > 0 &&
        inputs.password.length > 0 &&
        inputs.repeatPassword.length > 0 &&
        inputs.address.length > 0 &&
        inputs.zip.length > 0
        );
    {

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
                if(brukernavnTatt) // går ut av funksjonen hvis brukernavnet ikke var unikt
                {
                        let messageContainer = document.getElementById('melding');
                        messageContainer.innerHTML = `<p>Det er ikke unikt brukernavn!!!</p>`;
                        return;
                }
                if (model.inputs.register.password === model.inputs.register.repeatPassword) // Sjekker om passordet som er repeat er likt.
            
                { 
                const newUser = {
                    username:model.inputs.register.userName,                        // tar alt fra inputs og lager ett nytt objekt
                    passowrd:model.inputs.register.password,
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
                    messages:[]
                };
                const newUserID = '000000' + (Object.keys(model.data.users).length +1);    
                model.data.users[newUserID] = newUser;                  

                let messageContainer = document.getElementById('melding');
                messageContainer.innerHTML = `<p>Velkommen til VintageSkatter !!!</p>`;


            
             if (model.inputs.register.password !== model.inputs.register.repeatPassword)
            
                {
                    let messageContainer = document.getElementById('melding');
                    messageContainer.innerHTML = `<p>Passordene stemmer ikke overens!</p>`;
                } 
            
        }   
    }   
};
