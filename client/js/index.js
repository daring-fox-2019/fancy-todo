var idProjectSelected = null

if (!localStorage.getItem('token')) {
  $('#loginForm').show()
  $('#registerForm').hide()
  $('#content').hide()
} else {
  $('#loginForm').hide()
  $('#registerForm').hide()
  $('#content').show()
  $('#navbarDropdown').append(localStorage.getItem('userName'))
}

function myTodo(){
  console.log("MASUK TODO");
  
  $('#todo').show()
  $('#project').hide()
}

function myProject(){
  console.log("MASUK Project");

  $('#project').show()
  $('#todo').hide()
}

function back() {
  $('#loginForm').show()
  $('#registerForm').hide()
}

function createTodo() {
  $('#detail-todo').empty()
  // $('#addTodo').show()
}

$(document).ready(function () {
  listProject()
  $('#email').val('')
  $('#password').val('')
  $('#form-login').submit(login)
  $('#form-addProject').submit(addProject)
  $('#registerForm').submit(register)
  $('#form-addMember').submit(addMember)

  // $('#addTodo').hide()
  $('#todo').hide()
  $('#project').hide()
  $('#addProject').hide()
  $('#editTodo').hide()
})
