function checkLogin()
{
    const users = model.data.users;

    for (let userId in users)
    {
        const user = users[userId];
        console.log(model.inputs.login.username)
        console.log(model.inputs.login.password)

        if(model.inputs.login.username === user.username && model.inputs.login.password === user.password)
        {
            model.app.loggedInStatus = user.permissions;
            console.table(model.app.loggedInStatus)
        }

    }
}

