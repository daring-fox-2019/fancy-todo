function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  console.log(id_token)
  $.ajax({
    url: 'http://localhost:3000/login/google',
    type: 'post',
    headers: {
      id_token
    }
  })
  .done(function(response){
    console.log(response)
    localStorage.setItem('token',response.access_token)
  })
  .fail(function(err) {
    console.log( err );
  })
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token')
  });
}

$(document).ready(() => {
  $('#navbar').hide()
  $('#login-window').show()
  $('#register-window').hide()


  $('#register').click(() => {
    $('#login-window').hide()
    $('#register-window').fadeIn()
  })

  $('#register-back').click(() => {
    event.preventDefault()
    $('#login-window').fadeIn()
    $('#register-window').hide()
  })

  $('#login-form').submit(() => {
    // $('#navbar').show()
    console.log('hai')
  })


})