function updateFrontPageView(){
    let html = '';

    html += /*html*/ `
            <div class="frontPageContainer">
                <div class="headerContainer">
                    <h1 class="overskrift">Dansken og meg</h1>
                    ${!model.app.loggedInStatus ? `<div class="registerButton" onclick="">Registrer</div>
                    <div class="loginButton" onclick="loginDropDown()">Login</div>` :
                     `<div class="userButton" onclick="">${model.app.loggedInUser.userName}</div>`}
  
                    <div class="cartIcon" onclick="">🛒</div>
                    <h3 class="underskrift">VintageSkatter</h1>
                    <input type="search" class="searchBar" placeholder="Søk varer her." onchange="" name="q" value="" />
                    <div class="searchButton" onclick="">Search</div>
                    ${model.inputs.login.dropdown ? 
                        `<input type="text" 
                                class="userNameInput" 
                                onchange="model.inputs.login.username = this.value"
                                value="${model.inputs.login.username}"
                                required
                        /> 
                        <input type="password" 
                                class="passwordInput" 
                                onchange="model.inputs.login.password = this.value"
                                value="${model.inputs.login.password}"
                                required
                        /> 
                        <div class="loginSubmitButton" onclick="checkUserIdPassword()">Submit</div>
                        ${model.inputs.login.wrongUserNamePassword ? 
                            `<p class="wrongUser">${model.app.wrongUserNamePasswordMessage}</p> 
                            <p class="forgotPassword">
                                <span onclick=""> Forgot password?</span> 
                                <span onclick=""> New user?</span>
                            </p>` :
                            ''
                        }
                        ` : ''
                    }
                </div>
            </div>
    `;

    return html;
}