var idProjectSelected = null

if (!localStorage.getItem('token')) {
  $('#loginForm').show()
  $('#registerForm').hide()
  $('#content').hide()
} else {
  $('#loginForm').hide()
  $('#registerForm').hide()
  $('#content').show()
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
  $('#addProject').hide()
  $('#editTodo').hide()
})
