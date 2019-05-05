$(document).ready(function(){
  $("#content-view").hide()
  $('.login-true').hide()
  $('.ui.menu')
    .visibility({
      type   : 'fixed'});
  
  setTimeout(function(){
    $('.ui.menu.placeholder').hide(); 
    $("#content-view").transition('fly up')}, 2000)
  
  $('.ui.dropdown').dropdown();
  checkLogin()
  // getQuote()
})

function getQuote(){
  $('#get-another-quote-button').on('click', function(e) {
    e.preventDefault();
    $.ajax( {
      method :'GET',
      url: 'http://quotes.rest/qod.json',
    })
    .done(function(response) {
      $("#quote-content").text(`"${response.contents.quotes[0].quote}.toString()" - ${response.contents.quotes[0].author}.toString()`)
      });
    })
    .fail(function(jqXHR, textStatus) {
      console.log(textStatus);
    })
}



function checkLogin(){
  if(localStorage.getItem('token')) {
    let id_token = localStorage.getItem('token')
    $(".login-false").hide()
    $(".login-true").show()
  } else {
    $(".login-true").hide()
    $(".login-false").show()
    $(".register-form-view").hide()
  }
}

function onSignIn(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token;
  console.log('tokeeeen ', idToken);
  $.ajax({
      url: `http://localhost:3000/users/loginGoogle`,
      method: `POST`,
      headers: {
          token:idToken}
  })
  .done(function(response) {
      localStorage.setItem('token', response.token)
      $(".login-true").show()
      $(".login-false").hide()
  })
  .fail(function(jqXHR, textStatus) {
      console.log(textStatus);
  })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    if(localStorage.getItem('token')) {
        localStorage.removeItem('token')
        $(".login-true").hide()
        $(".login-false").show()
    }
  });
}