var baseURL = `http://localhost:3000`

function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const id_token = googleUser.getAuthResponse().id_token
    $.ajax({
      url: `${baseURL}/users/signinGoogle`,
      type: 'POST',
      data:{
        id_token
      }
    })
    .done((result) => {
      localStorage.setItem('token', result.token)
      localStorage.setItem('userName', result.userName)
    })
    .fail((err) => {
      console.log(err)
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      localStorage.removeItem('token')
      console.log('User signed out.');
    });
  }

  function signUp(){
    let userName = $('#usernameregister').val()
    let email = $('#emailregister').val()
    let password = $('#passwordregister').val()
    $.ajax({
      url:`${baseURL}/users/signup`,
      method : 'POST',
      data: {
        userName,
        email,
        password
      }
    })
    .done((data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.userName)
    })
    .fail((err) =>{
      console.log((err));
    })
  }
  
  function signIn(){
    let email = $('#emaillogin').val()
    let password = $('#passwordlogin').val()
    $.ajax({
      url:`${baseURL}/users/signin`,
      method : 'POST',
      data: {
        email,
        password
      }
    })
    .done((data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.userName)
    })
    .fail((err) =>{
      console.log((err));
    })
  }
  function addTodo(){
      let todo = $('Todo').val()
      let userName = localStorage.getItem('userName')
      $.ajax({
        url: `${baseURL}/todos/addTodo`,
        method: 'POST',
        data:{
            todo,
            userName
        }
      })
      .done((data) => {
        console.log(data, "===")
        console.log('data berhasil ditambah', userName)
      })
      .fail((err) => {
        console.log(err)
        console.log('data gagal ditambah')
      })
  }

$(document).ready(function(){
    $("#form-register").hide()
    $("#form-login").hide()
    $("#main").hide()
    // $("#form-register").show()
    // $("#form-login").show()
    $("#main").show()
})