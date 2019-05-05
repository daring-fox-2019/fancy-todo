var baseURL = `http://localhost:3000`
var eee
function register() {
  event.preventDefault()
  let name = $('#nameregister').val()
  let email = $('#emailregister').val()
  let password = $('#passwordregister').val()
  $.ajax({
    url: `${baseURL}/users/register`,
    method: 'POST',
    data: {
      name,
      email,
      password
    }
  })
    .done((data) => {
      localStorage.setItem('token', data.token)
      console.log("success register", data)
      window.location = './index.html'
    })
    .fail((err) => {
      console.log(err)
      $('#message').text(err.responseJSON.message)
    })
}

function login() {
  event.preventDefault()
  let email = $('#emaillogin').val()
  let password = $('#passwordlogin').val()
  $.ajax({
    url: `${baseURL}/users/login`,
    method: 'POST',
    data: {
      email,
      password
    }
  })
    .done((data) => {
      localStorage.setItem('token', data.token)
      console.log("success login", data)
      // $('#namaUser').text(data.name)
      window.location = './index.html'
    })
    .fail((err) => {
      console.log(err)
      $('#message').text(err.responseJSON.message)
    })
}

function logout(){
  event.preventDefault()
  localStorage.removeItem('token')
  window.location = './index.html'
}

function addNewTodo() {
  event.preventDefault()
  let duedate = $('#newDuedate').val().split("/")
  let duedate = new Date(duedate)
  let timeDueDate = duedate.getTime()
  let today = new Date()
  let timeToday = today.getTime()
  if (timeDueDate < timeToday) {
    $('#message').text("Due date cant be the past!!!")
  }
  else {
    $.ajax({
      url: `${baseURL}/todos/create`,
      method: 'POST',
      data: {
        title: $('#newTitle').val(),
        description: $('#newDesc').val(),
        duedate: $('#newDuedate').val()
      }
    })
      .done(function (response) {
        console.log(response)
        window.location = './index.html';
        $("#TodoLists").show()
        $("#createTodo").hide()
      })
      .fail(function (jqXHR, textStatus) {
        $('#message').text('response failed :', textStatus)
      })
  }
}
function showByStatus() {
  event.preventDefault()
  let status = this.value
  $.ajax({
    url: `${baseURL}/todos/read`,
    method: 'GET',
    data: {
      status
    }
  })
    .done(todos => {
      for(let todo of todos) {
        $('#results').append(`
        <li><p>${todo.title}</p><p>${todo.description}</p><p>${todo.status}</p><p>${todo.duedate}</p><a onclick=selectTodo('${todo._id}')>EDIT</a>
        </li>`)
      }
    })
    .fail((err) => {
      console.log(err)
      $('#message').text(err.responseJSON.message)
    })
}
// $("#createTodo").hide()
// $("#TodoLists").hide()
// $("#login-register-form").hide()
$(document).ready(() => {
  $('#pills-register').submit(register)
  $('#pills-login').submit(login)
  $('#createTodoForm').submit(addNewTodo)
  $('#createNewTodo').on('click', function () {
    $("#TodoLists").hide()
    $("#createTodo").show()
  })
  $('#filterByStatus').on('change', showByStatus);
  if (localStorage.hasOwnProperty('token')) {
    $("#TodoLists").show()
    $("#login-register-form").hide()
  }
  else {
    $("#TodoLists").hide()
    $("#login-register-form").show()
  }
})