document.getElementById("login-btn").addEventListener("click", function(){
    // user set
    const userInput = document.getElementById("login-user");
    const userName = userInput.value;

    // pass set
    const passInput = document.getElementById("login-pass");
    const pass = passInput.value;

    // fixed credentials 
    if (userName == "admin" && pass == "admin123") {
        // alert("Logging in");
        window.location.assign("home.html");
    } else {
        alert("Login Failed");
        return;
    }
});