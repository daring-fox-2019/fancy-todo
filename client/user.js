let allUsers
function checkLog() {
  if (localStorage.token) {
    $('#formulir-masuk').hide()
    $('#main').show()
    getTasks()
    getMyProjects()
    getUsers()
  }
  else {
    $('#main').hide()
    $('#formulir-masuk').show()
  }
}
function getUsers() {
  $.ajax({
    method: 'get',
    url: 'http://localhost:3000/users'
  })
    .done(users => {
      allUsers = users
      // console.log({users})
      $('#user-list').empty()
      $('#user-list').append(`<option selected>Choose...</option>`)
      for([index, item] of users.entries()) {
        $('#user-list').append(`
          <option value="${item._id}">${item.name}</option>
        `)
      }
      let isi = $('#user-list').html()
      $('#user-list-2').html(isi)
    })
    .fail(err => {
      console.log({err, dari: 'getUsers'})
      let message = (err.responseJSON.message) ? err.responseJSON.message : err.responseJSON.error
      swal('Error', message, 'error')
    })
}
function register(event) {
  event.preventDefault()
  let data = $(this).serializeArray().reduce((acc, cur) => {
    acc[cur.name] = cur.value
    return acc
  }, {})
  // console.log({ data })
  $('#form-signup')[0].reset()
  $.ajax({
    url: 'http://localhost:3000/register',
    method: 'post',
    data: data
  })
    .done(jwt => {
      swal('Success!', 'You are now registered.', 'success')
    })
    .fail(err => {
      console.log({ err })
      let message = (err.responseJSON.message) ? err.responseJSON.message : err.responseJSON.error
      swal('Error', message, 'error')
    })
}
function login(event) {
  event.preventDefault()
  let data = $(this).serializeArray().reduce((acc, cur) => {
    acc[cur.name] = cur.value
    return acc
  }, {})
  $.ajax({
    url: `http://localhost:3000/login`,
    method: 'post',
    data: data
  })
    .done(response => {
      $('#form-login-regular')[0].reset()
      $('Task')
      window.localStorage.setItem('token', response.token)
      window.localStorage.setItem('name', response.name)
      window.localStorage.setItem('email', response.email)
      window.localStorage.setItem('id', response.id)
      $('#name').text(response.name);
      swal(`Welcome ${response.name}!`, `You are now logged in.`, 'success')
      checkLog()
    })
    .fail(err => {
      let message = (err.responseJSON.message) ? err.responseJSON.message : err.responseJSON.error
      swal('Error', message, 'error')
    })
}
function onSignIn(googleUser) {
  let { id_token } = googleUser.getAuthResponse()
  $.ajax({
    url: 'http://localhost:3000/auth/google',
    method: 'post',
    headers: {
      token: id_token
    }
  })
    .done(response => {
      const { id, email, name, token } = response
      localStorage.setItem('token', token)
      localStorage.setItem('name', name)
      localStorage.setItem('email', email)
      localStorage.setItem('id', id)
      $('#name').text(name);
      swal(`Welcome ${name}!`, `You are now logged in.`, 'success')
      checkLog()
    })
    .fail((jqXHR, status) => {
      console.log({ jqXHR, status })
    })
}
function signOut() {
  if (gapi.auth2) {
    var auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut()
      .then(function () {
        emptyLocalStorage()
      })
      .catch(err => {
        let message = (err.responseJSON.message) ? err.responseJSON.message : err.responseJSON.error
        swal('Error', message, 'error')
      })
  } else {
    emptyLocalStorage()
  }
}
function emptyLocalStorage() {
  $('#task-body').empty()
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('id')
  window.localStorage.removeItem('email')
  swal('Signed out', `Goodbye, ${localStorage.name}!`, 'success')
  window.localStorage.removeItem('name')
  checkLog()
}

$(document).ready(function () {
  checkLog()
  $('#form-signup').submit(register)
  $('#form-login-regular').submit(login)
})