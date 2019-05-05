var baseURL = `http://localhost:3000`
var signedIn = true
var editTodoId

function dontRefresh(){
  if($('#filterByStatus').val()){
    searchTodos()
  }
  else getAllTodos()
}
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
      $('#messageSuccess').text(`Hai ${data.name}, kamu berhasil login`)
      console.log("success register", data)
      getAllTodos()
      $("#TodoLists").show()
      $("#login-register-form").hide()
    })
    .fail((err) => {
      console.log(err)
      $('#messageError').text(err.responseJSON.message)
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
      $('#messageSuccess').text(`Hai ${data.name}, kamu berhasil login`)
      console.log("success login", data)
      // $('#namaUser').text(data.name)
      getAllTodos()
      $("#TodoLists").show()
      $("#login-register-form").hide()
    })
    .fail((err) => {
      console.log(err)
      $('#messageError').text(err.responseJSON.message)
    })
}

function onSignIn(googleUser) {
  event.preventDefault()
  let profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  let id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    url: `${baseURL}/users/signinGoogle`,
    type: 'POST',
    data: {
      id_token
    }
  })
    .done((data) => {
      console.log(data)
      if(data.passRandom) $('#messageSuccess').text('Hurry up change your password now, your password is', data.passRandom)
      localStorage.setItem('token', data.token)
      $('#messageSuccess').text(`Hai ${data.name}, kamu berhasil login`)
      getAllTodos()
      $("#TodoLists").show()
      $("#login-register-form").hide()
    })
    .fail((err) => {
      $('#messageError').text('response failed :', err)
    })
}

function logout(){
  event.preventDefault()
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token')
    $("#TodoLists").hide()
    $("#login-register-form").show()
    console.log('User signed out.');
  });
}

function addNewTodo() {
  event.preventDefault()
  let newduedate = new Date($('#newDuedate').val())

  let today = new Date()

  if (newduedate < today) {
    $('#messageError').text("Due date cant be the past!!!")
  }
  else {
    $.ajax({
      url: `${baseURL}/todos/create`,
      method: 'POST',
      // crossDomain: true, // kalau error HTTP 405 Method not Allowed
      headers: {token: localStorage.getItem('token')},
      data: {
        title: $('#newTitle').val(),
        description: $('#newDesc').val(),
        duedate: newduedate
      }
    })
      .done(function (response) {
        console.log(response)
        $("#TodoLists").show()
        $("#createTodo").hide()
        getAllTodos()
      })
      .fail(function (jqXHR, textStatus) {
        $('#messageError').text('response failed :', textStatus)
      })
  }
}
function getAllTodos() {
  $.ajax({
    url: `${baseURL}/todos/read`,
    method: 'GET',
    headers: {token: localStorage.getItem('token')},
  })
  .done(todos => {
    $('#results').empty()
    for(let todo of todos) {
        $('#results').append(`
        <li><p>${todo.title}</p><p>${todo.description}</p><p>${todo.status}</p><p>${todo.duedate.slice(0,10)}</p><a onclick=editTodo('${todo._id.toString()}') href="">EDIT</a> <------------------------------------> <a onclick=deleteTodo('${todo._id.toString()}') href="">DELETE</a>
        </li>`)
      }
    })
    .fail((err) => {
      console.log(err)
      $('#messageError').text(err.responseJSON.message)
    })
}
function searchTodos() {
  let selected = $('#filterByStatus').val()
  let query = `?status=${selected}`
  $.ajax({
    url: `${baseURL}/todos/read/search${query}`,
    method: 'GET',
    headers: {token: localStorage.getItem('token')}
  })
  .done(todos => {
    $('#results').empty()
    for(let todo of todos) {
        $('#results').append(`
        <li><p>${todo.title}</p><p>${todo.description}</p><p>${todo.status}</p><p>${todo.duedate.slice(0,10)}</p><a onclick=editTodo('${todo._id.toString()}') href="">EDIT</a> <------------------------------------> <a onclick=deleteTodo('${todo._id.toString()}') href="">DELETE</a>
        </li>`)
      }
    })
    .fail((err) => {
      console.log(err)
      $('#messageError').text(err.responseJSON.message)
    })
}

function editTodo(todoId) {
  event.preventDefault()
  console.log(todoId,typeof todoId)
  $.ajax({
    url: `${baseURL}/todos/read/${todoId}`,
    method: 'GET',
    headers: {token: localStorage.getItem('token')}
  })
    .done(todo => {
      $('#editTodoForm').show()
      $('#selectedTitle').val(todo.title)
      $('#selectedDescription').val(todo.description)
      $('#selectedStatus').val(todo.status)
      todo.duedate = todo.duedate.slice(0,10)
      $('#selectedDueDate').val(todo.duedate)
      $('#editTodoForm').attr("onsubmit",`javascript:updateTodo('${todoId}')`)
    })
    .fail((err) => {
      console.log(err)
      $('#messageError').text(err.responseJSON.message)
    })
}

function updateTodo(todoId) {
  event.preventDefault()
  console.log(todoId,typeof todoId)
  if(todoId){
    $.ajax({
      url: `${baseURL}/todos/update/${todoId}`,
      method: 'PUT',
      headers: {token: localStorage.getItem('token')},
      data: {
        title: $('#selectedTitle').val(),
        description: $('#selectedDescription').val(),
        status: $('#selectedStatus').val(),
        duedate: new Date($('#selectedDueDate').val()),
      }
    })
      .done(todo => {
        $('#messageSuccess').text(`Update ${todo.title} Berhasil`)
        dontRefresh()
        $('#editTodoForm').attr("onsubmit",null).hide()
      })
      .fail((err) => {
        console.log(err)
        $('#messageError').text(err.responseJSON.message)
      })
  }
}

function deleteTodo(todoId) {
  event.preventDefault()
  $.ajax({
    url: `${baseURL}/todos/delete/${todoId}`,
    method: 'DELETE',
    headers: {token: localStorage.getItem('token')}
  })
    .done(result => {
      $('#messageSuccess').text(`Delete Todo Berhasil`)
      dontRefresh()
    })
    .fail((err) => {
      console.log(err)
      $('#messageError').text(err.responseJSON.message)
    })
}

// $("#createTodo").hide()
// $("#TodoLists").hide()
// $("#login-register-form").hide()
$(document).ready(() => {
  $('#pills-register').submit(register)
  $('#pills-login').submit(login)
  $('#createTodoForm').submit(addNewTodo)
  $('#editTodoForm').submit(updateTodo)
  $('#createNewTodo').on('click', function () {
    event.preventDefault()
    $("#TodoLists").hide()
    $("#createTodo").show()
  })
  $('#filterByStatus').on('change', searchTodos);
  if (localStorage.hasOwnProperty('token')) {
    $("#TodoLists").show()
    getAllTodos()
    // $("#login-register-form").hide()
  }
  else {
    // $("#TodoLists").hide()
    $("#login-register-form").show()
  }
})