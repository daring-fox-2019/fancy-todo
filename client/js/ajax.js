var token = localStorage.getItem('token')
var user = localStorage.getItem('user')

$('#loginForm').on('submit', function() {
    event.preventDefault();
    let email = $('#email').val()
    let password = $('#password').val()
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/signin',
        data: {
            email: email.trim(),
            password: password
        }
    })
    .done(function(data) {
       console.log(data)
       isToken()
       localStorage.setItem('token', data.token)
       localStorage.setItem('user',JSON.stringify(data.details))
    })
    .fail(function(err) {
        console.log(err);
    })
})


$('#signForm').on('submit', function() {
    event.preventDefault();
    let email_ = $('#email-sign').val()
    let password_ = $('#password-sign').val()
    console.log(email_)
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/signup',
        data: {
            email: email_.trim(),
            password: password_
        }
    })
    .done(function(data) {
       console.log(data)
    })
    .fail(function(err) {
        console.log(err);
    })
})

$('#todoForm').on('submit', function() {
    event.preventDefault();
    let todo = $('#mytodo').val()
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/todo',
        data: {
            description: todo,
            token: token
        }
    })
    .done(function(data) {
        readTodo(data.todo.owner)
    })
    .fail(function(err) {
        console.log(err);
    })
})

function readTodo(owner){
    $.ajax({
        method: 'GET',
        url: `http://localhost:3000/todo/${owner}`,
    })
    .done(function(data) {
        let index = data.todo.length - 1
        let id = data.todo[index]._id
        $('#content-todo').append(`
        <div id = "${id}" style="display:flex;width:120px; margin:0 auto;">
        <p>${data.todo[index].description}</p>
        <tab>
        <button id="${id}" type="submit" class="btn-outline-danger" onclick="deleteData('${id}')">delete</button>
        </div>`)
    })
    .fail(function(err) {
        console.log(err);
    })
}

function deleteData(input){
    $(`#${input}`).remove()
    $.ajax({
        method:'DELETE',
        url:`http://localhost:3000/todo/${input}`
    })
    .done(function(data){
        console.log('sucess')
    })
    .fail((jqXHR, textStatus) => {
        console.log(jqXHR, textStatus);
    })
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;
    
    $.ajax({
        url:"http://localhost:3000/gsignin",
        method:"POST",
        data:{
            token:id_token
        }
    })
    .done(response => {
        console.log(response)
        localStorage.setItem("token", response);
        isToken()
    })
    .fail((jqXHR, textStatus) => {
        console.log(jqXHR, textStatus);
      });
}

function signout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log("User signed out.");
    });
    localStorage.clear()
    $('#loginPage').show()
    $('#navbar').hide()
    //$('#main-content').hide()
    $('#signOut').hide()
    $('#todo').hide()
    $('#content-todo').hide()
    // $('#signIn').show()
}

function isToken() {
    console.log(token)
    console.log(user)
    $('#loginPage').hide()
    $('#todo').show()
    $('#navbar').show()
    $('#signOut').show()
    $('#content-todo').show()
}

$(document).ready(function () {
    if (token) {
        isToken()
    } else {
        $('#loginPage').show()
        $('#navbar').hide()
        $('#signOut').hide()
        $('#todo').hide()
        // $('#main-content').hide()
        // $('#signIn').show()
    }
})