let dataCentral
let currentId

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
      console.log({jqXHR, status})
    })
}

function getTasks() {
  $.ajax({
    method: 'get',
    url: 'http://localhost:3000/todos/MyTodo',
    headers: {
      token: localStorage.token
    }
  })
    .done(data => {
      dataCentral = data
      if(!Array.isArray(data) || !data.length) $('#empty').show()
      else $('#empty').hide()
      $('#task-body').empty()
      for ([index, item] of data.entries()) {
        let { dueDate, status } = item
        let date = dueDate.slice(0,10)
        let setStatus = (status) ? '✔' : '❌'
        let templateCheck = ''
        if(status) {
          templateCheck = `<button class="btn btn-primary" onclick="checkTask('${item._id}','${item.status}')" value="${item._id}">Uncheck</button>`
        } else {
          templateCheck = `<button class="btn btn-primary" onclick="checkTask('${item._id}','${item.status}')" value="${item._id}">Check</button>`
        }
        $('#task-body').append(`<tr><td>${index+1}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${setStatus}</td>
        <td>${date}</td>
      <td>${templateCheck}
      <button class="btn btn-primary" data-toggle="modal" data-target="#modalEdit" onclick="editTodo('${item._id}')">Edit</button>
        <button class="btn btn-primary" onclick="deleteTask('${item._id}')">Delete</button></td></tr>`)
        /* punya button edit -> onclick="editTask('${item._id}')" */
      }
    })
    .fail(err => {
      console.log({err})
      swal(`Error ${err.status}: ${err.statusText}`, err.responseJSON.error, 'error')
    })
}

function editTodo(id) {
  let data = dataCentral.filter(item => item._id === id)[0]
  let date = data.dueDate.slice(0, 10)
  currentId = id
  $('#nameEdit').val(data.name)
  $('#descriptionEdit').val(data.description)
  $('#dateEdit').val(date)
}

function submitEdit() {
  event.preventDefault()
  console.log({currentId})
  let data = $(this).serializeArray().reduce((acc, cur) => {
    acc[cur.name] = cur.value
    return acc
  }, {})
  console.log({data})
  $.ajax({
    url: `http://localhost:3000/todos/${currentId}`,
    method: 'put',
    data: data,
    headers: {
      token: localStorage.token
    }
  })
    .done(task => {
      getTasks()
      $('#modalEdit').modal('hide')
      swal('Success!', 'Data successfully edited.', 'success')
      .then(() => {
      })
    })
    .fail(err => {
      let message = (err.responseJSON.message) ? err.responseJSON.message : err.responseJSON.error
      swal('Error', message, 'error')
    })
}

function createTask() {
  event.preventDefault()
  let data = $(this).serializeArray().reduce((acc, cur) => {
    acc[cur.name] = cur.value
    return acc
  }, {})
  $.ajax({
    url: 'http://localhost:3000/todos',
    method: 'post',
    data: data,
    headers: {
      token: localStorage.token
    }
  })
    .done(task => {
      getTasks()
    })
    .fail(err => {
      console.log({err})
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
  console.log({data})
  $.ajax({
    url: 'http://localhost:3000/register',
    method: 'post',
    data: data
  })
    .done(jwt => {
      swal('Success!', 'You are now registered.', 'success')
    })
    .fail(err => {
      console.log({err})
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

function signOut() {
  if(gapi.auth2) {
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

function checkTask(id, status) {
  // event.preventDefault()
  status = (status == 'true') ? false : true
  $.ajax({
    url: `http://localhost:3000/todos/${id}`,
    method: 'put',
    data: {
      status,
    },
    headers: {
      token: localStorage.token
    }
  })
  .done(data => {
    getTasks()
  })
  .fail(err => {
    let message = (err.responseJSON.message) ? err.responseJSON.message : err.responseJSON.error
    swal('Error', error, 'error')
  })
}
function deleteTask(id) {
  swal({
    title: 'Are you sure?',
    text: 'Deleted todo will be permanently lost!',
    icon: 'warning',
    buttons: {
      cancel: true,
      confirm: "Yes"
    }
  })
  .then(yes => {
    if(yes) {
      $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: 'delete',
        headers: { token: window.localStorage.token }
      })
      .done(data => {
        swal('Poof!', 'Todo deleted.', 'success')
        getTasks()
      })
      .fail(err => {
        console.log({err})
        let message = (err.responseJSON.message) ? err.responseJSON.message : err.responseJSON.error
        swal('Error', message, 'error')
      })
    } else {
      swal('Deletion canceled.')
    }
  })
}

$(document).ready(function () {
  checkLog()
  $('a').click(function(event) {event.preventDefault()})
  $('#form-signup').submit(register)
  $('#form-login-regular').submit(login)
  $('#form-add-task').submit(createTask)
  $('#form-edit-task').submit(submitEdit)
})