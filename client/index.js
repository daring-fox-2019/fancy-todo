let myTodos
let currentId

function getTasks() {
  $.ajax({
    method: 'get',
    url: 'http://localhost:3000/todos/MyTodo',
    headers: {
      token: localStorage.token
    }
  })
    .done(data => {
      myTodos = data
      $('#form-project').hide()
      fillTodos(data);
    })
    .fail(err => {
      console.log({err})
      swal(`Error ${err.status}: ${err.statusText}`, err.responseJSON.error, 'error')
    })
}
function fillTodos(data) {
  if (!Array.isArray(data) || !data.length)
    $('#empty').show();
  else
    $('#empty').hide();
  $('#task-body').empty();
  for ([index, item] of data.entries()) {
    let { dueDate, status } = item;
    let date = dueDate.slice(0, 10);
    let setStatus = (status) ? '✔' : '❌';
    let templateCheck = '';
    if (status) {
      templateCheck = `<button class="btn btn-primary btn-sm" onclick="checkTask('${item._id}','${item.status}')" value="${item._id}">Uncheck</button>`;
    }
    else {
      templateCheck = `<button class="btn btn-primary btn-sm" onclick="checkTask('${item._id}','${item.status}')" value="${item._id}">Check</button>`;
    }
    $('#task-body').append(`<tr><td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${setStatus}</td>
        <td>${date}</td>
      <td>${templateCheck}
      <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modalEdit" onclick="editTodo('${item._id}')">Edit</button>
        <button class="btn btn-primary btn-sm" onclick="deleteTask('${item._id}')">Delete</button></td></tr>`);
  }
}

function editTodo(id) {
  console.log({myTodos})
  let data = myTodos.filter(item => item._id === id)[0]
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
      $('#modalEdit').modal('hide')
      if(projectId == 'main') {
        getTasks()
      } else {
        projectUpdate();
      }
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
      $('#form-add-task')[0].reset()
      if(projectId == 'main') {
        getTasks()
      } else {
        projectUpdate();
      }
    })
    .fail(err => {
      console.log({err})
      let message = (err.responseJSON.message) ? err.responseJSON.message : err.responseJSON.error
      swal('Error', message, 'error')
    })
}

function checkTask(id, status) {
  // event.preventDefault()
  // console.log({projectId})
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
    if(projectId == 'main') {
      getTasks()
    } else {
      projectUpdate();
    }
  })
  .fail(err => {
    console.log({err})
    let message = (err.responseJSON.message)
                ? err.responseJSON.message
                : (err.responseJSON.error)
                ? err.responseJSON.error
                : err.responseJSON.err
    swal('Error', message, 'error')
  })
}
function projectUpdate() {
  $.ajax({
    method: 'get',
    url: 'http://localhost:3000/projects/myProjects',
    headers: {
      token: localStorage.token
    }
  })
    .done(response => {
      myTodos = response[0].todos;
      // console.log({response})
      myProjects = response;
      showWhichTodos(projectId);
    })
    .fail(err => {
      console.log({ err });
      let message = (err.responseJSON.message)
        ? err.responseJSON.message
        : (err.responseJSON.error)
          ? err.responseJSON.error
          : err.responseJSON.err;
      swal('Error', message, 'error');
    });
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
        if(projectId == 'main') {
          getTasks()
        } else {
          projectUpdate();
        }
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
  $('#form-add-task').submit(createTask)
  $('#form-edit-task').submit(submitEdit)
  $('#form-signup').submit(register)
  $('#form-login-regular').submit(login)
  $('#form-create-project').submit(createProject)
  $('#form-add-member').submit(addMember)
  $('#form-project-todo').submit(createProjectTodo)
})