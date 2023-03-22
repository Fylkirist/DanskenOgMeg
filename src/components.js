function updateView(){
    let container = document.getElementById('app');
    container.innerHTML = '';

    switch (model.app.currentView){
        case 'frontPage':
        container.appendChild(registerFormView())
        break;
    }


}


function registerFormView() {

    let container = /*html */`
      <div class="form-container">
        <div class="form-group">
          <input type="text" placeholder="First Name" oninput="model.inputs.register.firstName = this.value;">
          <input type="text" placeholder="Last Name" oninput="model.inputs.register.lastName = this.value;">
        </div>
        <div class="form-group">
          <input type="email" placeholder="Email" oninput="model.inputs.register.email = this.value;">
          <input type="tel" placeholder="Telefon Nr:" oninput="model.inputs.register.mobile = this.value;">
        </div>
        <div class="form-group">
          <input type="text" placeholder="Brukernavn:" oninput="model.inputs.register.userName = this.value;">
          <input type="password" placeholder="Passord:" oninput="model.inputs.register.password = this.value;">
          <input type="password" placeholder="Gjenta Passord:" oninput="model.inputs.register.repeatPassword = this.value;">
        </div>
        <div class="form-group">
          <input type="text" placeholder="Adresse:" oninput="model.inputs.register.address = this.value;">
          <input type="text" placeholder="Post nummer:" oninput="model.inputs.register.zip = this.value;">
          <input type="text" placeholder="By:" oninput="model.inputs.register.city = this.value;">
        </div>
        <div class="form-group">
          <input type="text" placeholder="Card info" oninput="model.inputs.register.cardNumber = this.value;">
          <input type="date" placeholder="Fra dato" oninput="model.inputs.register.fromDate = this.value;">
          <input type="text" placeholder="CVE" oninput="model.inputs.register.cve = this.value;">
        </div>
        <button onclick="registerUser()">Register</button>
        <div id="melding"></div>
      </div>
    `;
    document.getElementById('app').innerHTML = container;
    return container;
  }