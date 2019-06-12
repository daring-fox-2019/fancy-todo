function onSignIn(googleUser) {
  let id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: "POST",
    url: `http://localhost:3000/users/googleLogin`,
    data: {
      token: id_token
    }
  })
    .done((response) => {
      localStorage.setItem('token', response.token) //response token hasil jwt
      localStorage.setItem('userId', response.userId)
      localStorage.setItem('userName', response.name)
      $('#navbarDropdown').append(localStorage.getItem('userName'))
      listTodo()
      listProject()
      $('#loginForm').hide()
      $('#content').show()
    })
    .fail((jqXHR, textStatus) => {
      console.log(`request failed ${textStatus}`)
    })
}

function login(event) {
  event.preventDefault()
  if ($('#email').val() != '' && $('#password').val() != '') {
    let email = $('#email').val()
    let password = $('#password').val()

    $.ajax({
      url: "http://localhost:3000/users/login",
      method: "POST",
      data: {
        email, password
      }
    })
      .done((response) => {
        $('#email').val('')
        $('#password').val('')
        $('#loginForm').hide()
        $('#content').show()
        localStorage.setItem('token', response.token)
        localStorage.setItem('userId', response.userId)
        localStorage.setItem('userName', response.name)
        $('#navbarDropdown').append(localStorage.getItem('userName'))
        listTodo()
        listProject()
      })
      .fail((jqXHR, textStatus) => {
        console.log(jqXHR);

        console.log(`request failed ${textStatus}`)
      })
  }
}

function registerForm(event) {
  event.preventDefault()
  $('#registerForm').show()
  $('#loginForm').hide()
  $('#name').val('')
  $('#emailRegis').val('')
  $('#passwordRegis').val('')
}

function register(event) {
  event.preventDefault()
  if ($('#name').val() && $('#emailRegis').val() && $('#passwordRegis').val()) {
    let name = $('#name').val()
    let email = $('#emailRegis').val()
    let password = $('#passwordRegis').val()

    $.ajax({
      url: `http://localhost:3000/users`,
      method: "POST",
      data: {
        name, email, password
      }
    })
      .done(response => {
        $('#name').val('')
        $('#email').val('')
        $('#password').val('')
        $('#loginForm').show()
        $('#registerForm').hide()
      })
      .fail((jqXHR, textStatus) => {
        console.log(`request failed ${textStatus}`)
      })
  }
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')

    $('#loginForm').show()
    $('#content').hide()
    $('#list-project').empty()
    console.log('User signed out.');
  });
}
