function checkLogin(bruker, passord)
{
const users = model.data.users;

    for (let userId in users)
    {
        const user = users[userId];
        console.log(userId)
        console.log(user)

        if(user.username === "bruker" && user.password === "passord")
        {
        model.app.loggedInStatus = bruker.permission;
        
        }

    }
}