
function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: "http://localhost:3000/login",
        method: "POST",
        data: {
            googleToken: id_token
        }
    })
        .done(response => {
            localStorage.setItem("token", response.token)
            fetchTodo()
            $("#login-page").fadeOut(1000, function () {
                $("#home").fadeIn(1000)
            })

        })
        .fail((jqXHR, textStatus) => {
            console.log("errorrr nicchhh")
            console.log("request failed", textStatus)
        })
}
function register() {
    event.preventDefault()
    const name = $("#register-name").val()
    const email = $("#register-email").val()
    const username = $("#register-username").val()
    const password = $("#register-password").val()
    $.ajax({
        url: "http://localhost:3000/user",
        method: "POST",
        data: {
            name: name,
            email: email,
            username: username,
            password: password
        }
    })
        .done(response => {
            localStorage.setItem('token', response)
            fetchTodo()
            $("#login-page").fadeOut(1000, function () {
                $("#home").fadeIn(1000)
            })
        })
        .fail((jqXHR, textStatus) => {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'That email is taken....',
            })
            console.log("errorrr nicchhh")
            console.log("request failed", textStatus)
        })
}
function login() {
    console.log("HEHUEHUEHEUEHU")
    event.preventDefault()
    const email = $("#email").val()
    const password = $("#password").val()
    $.ajax({
        url: "http://localhost:3000/login",
        method: "POST",
        data: {
            email: email,
            password: password
        }
    })
        .done(response => {
            if (response.token) {
                localStorage.setItem("token", response.token)
                fetchTodo()
                $("#login-page").fadeOut(1000, function () {
                    $("#home").fadeIn(1000)
                })
            }
        })
        .fail((jqXHR, textStatus) => {
            // console.log("errorrr nicchhh")
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Invalid username/password',
            })
            $("#password").val('')
            console.log("request failed", textStatus)
        })
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2) {
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }
    localStorage.removeItem('token')

    $("#home").fadeOut(1000, function () {
        $("#login-page").fadeIn(1000, function () {
            $("#todo-list").empty()
        })
    })
}



$(document).ready(function () {
    $("#home").hide()
    $('.modal').modal();
    $('.fixed-action-btn').floatingActionButton();
    $('input#input_text, textarea#description').characterCounter();
    $('.datepicker').datepicker();
});