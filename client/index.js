function checkLog() {
  if (localStorage.token) {
    $('#formulir-masuk').hide()
    $('#main').show()
    getTasks()
  }
  else {
    $('#main').hide()
    $('#formulir-masuk').show()
  }
}

function onSignIn(googleUser) {
  let { id_token } = googleUser.getAuthResponse()
  $.post('http://localhost:3000/google-sign-in', { id_token })
    .then(jwt => {
      window.localStorage.setItem('jwt', jwt.token)
    })
    .catch(err => {
      console.log(err.message)
      swal('Error', err.responseJSON.message, 'error')
    })
}

function getTasks() {
  $.ajax({
    method: 'get',
    url: 'http://localhost:3000/todos',
    headers: {
      token: localStorage.token
    }
  })
    .done(data => {
      // console.log({data})
      for ([index, item] of data.entries()) {
        let { dueDate, status } = item
        let date = dueDate.slice(0,10)
        let setStatus = (status) ? '✔' : '❌'
        let templateCheck = ''
        if(status) {
          templateCheck = `<button class="btn btn-primary" onclick="checkTask('${item._id}')" value="${item._id}">Uncheck</button>`
        } else {
          templateCheck = `<button class="btn btn-primary" onclick="checkTask('${item._id}')" value="${item._id}">Check</button>`
        }
        $('#taskBody').empty().append(`<tr><td>${index+1}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${setStatus}</td>
        <td>${date}</td>
        <td>${templateCheck}
        <button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Edit</button>
        <button class="btn btn-primary" onclick="deleteTask('${item._id}')">Delete</button></td></tr>`)
        /* punya button edit -> onclick="editTask('${item._id}')" */
      }
    })
    .fail(err => {
      console.log(err)
      swal(`Error ${err.status}: ${err.statusText}`, err.responseJSON.error, 'error')
    })
}

function createTask() {
  event.preventDefault()
  let data = $(this).serializeArray().reduce((acc, cur) => {
    acc[cur.name] = cur.value
    return acc
  }, {})
  data.id = window.localStorage.id
  $.ajax({
    url: 'http://localhost:3000/tasks',
    method: 'post',
    data: data
  })
  .done(task => {
    getTasks()
  })
  .fail(err => {
    console.log({err})
    swal('Error', err.responseJSON.message, 'error')
  })
}

function register(event) {
  event.preventDefault()
  let data = $(this).serializeArray().reduce((acc, cur) => {
    acc[cur.name] = cur.value
    return acc
  }, {})
  $.ajax({
    url: 'http://localhost:3000/users',
    method: 'post',
    data: data
  })
    .done(jwt => {
      // ================================
      swal('Success!', 'You are now registered.', 'success')
    })
    .fail(err => {
      swal('Error', err.responseJSON.message, 'error')
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
      window.localStorage.setItem('token', response.token)
      window.localStorage.setItem('name', response.name)
      window.localStorage.setItem('email', response.email)
      window.localStorage.setItem('id', response.id)
      $('#name').text(response.name);
      swal(`Welcome ${response.name}!`, `You are now logged in.`, 'success')
      checkLog()
    })
    .fail(err => {
      swal('Error', err.responseJSON.message, 'error')
    })
}

function signOut() {
  if(gapi.auth2) {
    var auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut()
    .then(function () {
      emptyLocalStorage()
    })
    .catch(err => {
      swal('Error', err.responseJSON.message, 'error')
    })
  } else {
    emptyLocalStorage()
  }
}

function emptyLocalStorage() {
  $('#taskbody').empty()
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('id')
  window.localStorage.removeItem('email')
  swal('Signed out', `Goodbye, ${localStorage.name}!`, 'success')
  window.localStorage.removeItem('name')
  checkLog()
}

function checkTask(id) {
  // event.preventDefault()
  console.log('jalan function')
  console.log(id)
  $.ajax({
    url: `http://localhost:3000/tasks/${id}`,
    method: 'put',
    data: {
      checkStatus : true,
      _id: window.localStorage.id
    }
  })
  .done(data => {
    console.log(data)
    window.location.assign('/')
  })
  .fail(err => {
    console.log('err')
    console.log(err)
    console.log('err')
    swal('Error', err.responseJSON.message, 'error')
  })
}
function editTask(id) {
  // event.preventDefault()
}
function deleteTask(id) {
  // event.preventDefault()
  console.log('id')
  console.log(id)
  swal({
    title: 'Delete confirmation',
    text: 'Are you sure you want to delete this task?',
    icon: 'warning',
    buttons: {
      cancel: true,
      confirm: "Yes"
    }
  })
  .then(yes => {
    if(yes) {
      $.ajax({
        url: `http://localhost:3000/tasks/${id}`,
        method: 'delete',
        data: {id: window.localStorage.id}
      })
      .done(data => {
        window.location.assign('/')
      })
      .fail(err => {
        console.log(err)
        swal('Error', err.responseJSON.message, 'error')
      })
    } else {

    }
  })
}

$(document).ready(function () {
  checkLog()
  $('a').click(function(event) {event.preventDefault()})
  $('#form-signup').submit(register)
  $('#form-login-regular').submit(login)
  $('#form-add-task').submit(createTask)
})