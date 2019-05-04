var loginState = function(value) {
    if(value) {
        $('#dashboard').show()
        $('#landing').hide()
    }
    else {
        $('#landing').show()
        $('#dashboard').hide()
    }
}

function isLogin() {
    if(localStorage.getItem('todo_token')) {
        loginState(true)
    }
    else {
        loginState(false)
    }
}

$(document).ready(function(){
    //check if there is valid token, if it is, show dashboard
    isLogin()
})
