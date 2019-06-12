function detailTodo(id) {
  idTodoSelected = id
  $('#addTodo').hide()
  $('#detail-todo').empty()
  $.ajax({
    url: `http://localhost:3000/todos/${id}`,
    method: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function ({ data }) {
      let todo = data

      let info = null
      let status = todo.status
      let due_date = new Date(data.due_date)
      let date = due_date.getDate()
      let month = due_date.getMonth() + 1
      let year = due_date.getFullYear()

      let difference = Math.ceil((new Date(todo.due_date) - new Date()) / (24 * 60 * 60 * 1000))

      if (todo.status == true) {
        info = "list-group-item-success border-success"
      } else if (difference < 0 && todo.status == false) {
        info = "list-group-item-danger border-danger"
      } else if ((difference == 1 || difference == 0) && todo.status == false) {
        info = "list-group-item-warning border-warning"
      }

      if (date < 10) {
        date = `0${date}`
      }
      if (month < 10) {
        month = `0${month}`
      }

      if (status) {
        status = "Done"
      } else {
        status = "Not yet"
      }

      $('#detail-todo').append(`<div class="card ${info}">
                          <h5 class="card-header">Detail Todo</h5>
                          <div class="card-body">
                              <h5 class="card-title"> Name : ${todo.name}</h5>
                              <p class="card-text">Description : ${todo.description}</p>
                              <p class="card-text">Due Date : ${year}-${month}-${date}</p>
                              <p class="card-text">Status : ${status}
                                </p>
                                <button type="button" class="btn btn-secondary btn-sm" onClick="changeStatus('${todo._id}','${todo.status}')">Change Status</button>
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick='edit("${todo._id}")'>
                                Edit
                                </button>
                                <a class="btn btn-danger" onClick='deleteTodo("${todo._id}")'>Delete</a>
                          </div>
                      </div>

                      <!-- Modal Edit Private Todo -->
                      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="exampleModalLabel">Edit Private Todo</h5>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div class="modal-body">
                            <form id="form-register">
                              <div class="form-group">   
                                <label for="title">Name</label>
                                <input type="text" class="form-control" id="title" placeholder="Name taks">
                              </div>
                              <div class="form-group">
                                <label for="description">Description</label>
                                <input type="text" class="form-control" id="description" placeholder="The description">
                              </div>
                              <div class="form-group">
                                <label for="due_date">Due Date</label>
                                <input type="text" class="form-control" id="due_date" size="30" aria-describedby="due_date"
                    placeholder="yyyy-mm-dd" autocomplete="off">
                              </div>
                            </form>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                              <button type="button" class="btn btn-primary" onClick="editTodo('private')">Save changes</button>
                            </div>
                          </div>
                        </div>
                      </div>
        `)
    })
    .fail(function (err) {
      console.log(err);
    })
}

function editTodo(arg) {
  console.log(arg);

  let name, description, due_date

  if (arg == 'project') {
    name = $('#titleTodoProject').val()
    description = $('#descriptionTodoProject').val()
    due_date = $('#due_dateTodoProject').val()
  } else {
    name = $('#title').val()
    description = $('#description').val()
    due_date = $('#due_date').val()
  }

  $.ajax({
    url: `http://localhost:3000/todos/${idTodoSelected}`,
    method: 'PUT',
    data: {
      name, description, due_date
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      $('#modalEditTodo').modal('hide');
      $(".modal-backdrop").remove();
      $('#detail-todo').empty()
      $('#title').val('')
      $('#description').val('')
      $('#due_date').val('')
      detailProject(idProjectSelected)
      listTodo()
      swal("Update Task Success", "", "success");
    })
    .fail(err => {
      swal("This not yours!", "", "error");
    })
}

function deleteTodo(id) {

  swal({
    title: "Are you sure want to delete this task?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      if (willDelete) {
        let projectId = idProjectSelected
        $.ajax({
          url: `http://localhost:3000/todos/${id}`,
          method: 'DELETE',
          data: {
            projectId
          },
          headers: {
            token: localStorage.getItem('token')
          }
        })
          .done(function (response) {
            swal("Delete Task Success", "", "success");
            $('#detail-project').empty()
            $('#detail-todo').empty()
            listTodo()
            detailProject(idProjectSelected)
          })
          .fail(err => {
            swal("This not yours!", "", "error");
          })
      }
    });


}

function changeStatus(id, status) {
  let newStatus = status == 'false' ? true : false

  $.ajax({
    url: `http://localhost:3000/todos/${id}`,
    method: 'PATCH',
    data: {
      status: newStatus
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      detailTodo(id)
      swal("Success update status!", "", "success");
      detailProject(idProjectSelected)
      listTodo()
    })
    .fail(err => {
      swal("This not yours!", "", "error");
    })
}

function listTodo() {
  $('#list-myTodo').empty()

  $.ajax({
    url: 'http://localhost:3000/todos',
    method: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      for ([index, todo] of response.data.entries()) {
        let info = null
        let difference = Math.ceil((new Date(todo.due_date) - new Date()) / (24 * 60 * 60 * 1000))
        if (todo.status == true) {
          info = "list-group-item-success"
        } else if (difference < 0 && todo.status == false) {
          info = "list-group-item-danger"
        } else if ((difference == 1 || difference == 0) && todo.status == false) {
          info = "list-group-item-warning"
        }

        $('#list-myTodo').append(`<li class="list-group-item list-group-item-action ${info}" onclick='detailTodo("${todo._id}")'>${todo.name}</li>`)

      }

    })
}

function addTodo() {
  let name = $('#titleTodo').val()
  let description = $('#desc').val()
  let due_date = $('#due-date').val()
  let status = false
  let projectId = idProjectSelected
  let project = true

  $.ajax({
    url: "http://localhost:3000/todos",
    method: 'POST',
    data: {
      name, description, due_date, status, projectId, project
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done((response) => {
      $('#modalTodo').modal('hide');
      $('#titleTodo').val('')
      $('#desc').val('')
      $('#due-date').val('')
      detailProject(projectId)
    })
    .fail((jqXHR, textStatus) => {
      console.log(`request failed ${textStatus}`)
    })
}

function addMyTodo(event) {
  event.preventDefault()

  let name = $('#nama').val()
  let description = $('#description').val()
  let due_date = $('#due_date').val()
  let status = false
  let project = false

  $.ajax({
    url: "http://localhost:3000/todos",
    method: 'POST',
    data: {
      name, description, due_date, status, project
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done((response) => {
      $('#nama').val('')
      $('#description').val('')
      $('#due_date').val('')
      listTodo()
      $('#addTodo').hide()
    })
    .fail((jqXHR, textStatus) => {
      console.log(`request failed ${textStatus}`)
    })
}

function modalTodoEdit(id) {
  idTodoSelected = id

  $.ajax({
    url: `http://localhost:3000/todos/${id}`,
    method: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function ({ data }) {

      let due_date = new Date(data.due_date)
      let date = due_date.getDate()
      let month = due_date.getMonth() + 1
      let year = due_date.getFullYear()
      if (date < 10) {
        date = `0${date}`
      }
      if (month < 10) {
        month = `0${month}`
      }
      $('#titleTodoProject').val(data.name)
      $('#descriptionTodoProject').val(data.description)
      $('#due_dateTodoProject').val(`${year}-${month}-${date}`)
    })
    .fail(err => {
      swal("This not yours!", "", "error");
    })
}
