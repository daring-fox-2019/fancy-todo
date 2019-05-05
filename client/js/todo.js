function detailTodo(id) {

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
      let buttonStatus = ''
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
        buttonStatus = `<button type="button" class="btn btn-secondary btn-sm" onclick="changeStatus('${todo._id}')">Change Status</button>`
      }

      $('#detail-todo').append(`<div class="card ${info}">
                          <h5 class="card-header">Detail Todo</h5>
                          <div class="card-body">
                              <h5 class="card-title"> Name : ${todo.name}</h5>
                              <p class="card-text">Description : ${todo.description}</p>
                              <p class="card-text">Due Date : ${year}-${month}-${date}</p>
                              <p class="card-text">Status : ${status}
                              ${buttonStatus}
                                </p>
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick='edit("${todo._id}")'>
                                Edit
                                </button>
                                <a class="btn btn-danger" onclick='deleteTodo("${todo._id}")'>Delete</a>
                          </div>
                      </div>

                      <!-- Modal -->
                      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="exampleModalLabel">Edit Todo</h5>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div class="modal-body">
                            <form id="form-register">
                              <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" class="form-control" id="title" placeholder="Name taks">
                              </div>
                              <div class="form-group">
                                <label for="description">Description</label>
                                <input type="text" class="form-control" id="description" placeholder="The description">
                              </div>
                              <div class="form-group">
                                <label for="due_date">Due Date</label>
                                <input type="text" class="form-control" id="due_date" placeholder="YYYY-MM-DD">
                              </div>
                            </form>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                              <button type="button" class="btn btn-primary" onclick='editTodo("${todo._id}")'>Save changes</button>
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

function editTodo(id) {

  let name = $('#title').val()
  let description = $('#description').val()
  let due_date = $('#due_date').val()

  $.ajax({
    url: `http://localhost:3000/todos/${id}`,
    method: 'PUT',
    data: {
      name, description, due_date
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      $('#exampleModal').modal('hide');
      $(".modal-backdrop").remove();
      $('#detail-todo').empty()
      $('#nama').val('')
      $('#description').val('')
      $('#due_date').val('')
      listTodo()
      // swal("Update Task Success", "", "success");
    })
    .fail(err => {
      swal("This not yours!", "", "error");
    })
}

function edit(id) {
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
      $('#title').val(data.name)
      $('#description').val(data.description)
      $('#due_date').val(`${year}-${month}-${date}`)
    })
    .fail(err => {
      swal("This not yours!", "", "error");
    })

}

function deleteTodo(id) {
  let projectId = idProjectSelected
  $.ajax({
    url: `http://localhost:3000/todos/${id}`,
    method: 'DELETE',
    data:{
      projectId
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      swal("Delete Task Success", "", "success");
      $('#detail-todo').empty()
      listTodo()
    })
    .fail(err => {
      swal("This not yours!", "", "error");
    })
}

function changeStatus(id) {
  $.ajax({
    url: `http://localhost:3000/todos/${id}`,
    method: 'PATCH',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      swal("Success update status!", "", "success");
      listTodo()
    })
    .fail(err => {
      swal("This not yours!", "", "error");
    })
}

function listTodo() {
  $('#list-todo').empty()

  $.ajax({
    url: 'http://localhost:3000/todos',
    method: 'GET',
    headers: {
      headers: {
        token: localStorage.getItem('token')
      }
    }
  })
    .done(function (response) {
      for ([index,todo] of response.data) {
        let info = null
        let difference = Math.ceil((new Date(todo.due_date) - new Date()) / (24 * 60 * 60 * 1000))
        if (todo.status == true) {
          info = "list-group-item-success"
        } else if (difference < 0 && todo.status == false) {
          info = "list-group-item-danger"
        } else if ((difference == 1 || difference == 0) && todo.status == false) {
          info = "list-group-item-warning"
        }

        $('#list-todo').append(`<tr>
            <th scope="row">${index+1}</th>
            <td>${todo.name}</td>
            <td>${todo.description}</td>
            <td>${todo.status}</td>
            <td>${todo.due_date}</td>
            <td>
              <i class="fas fa-info-circle"></i>
              <i class="fas fa-edit" data-toggle="modal" data-target="#modalEditTodo"></i>              
              <i class="fas fa-trash-alt" onclick='deleteTodo("${todo._id}")'></i>
            </td>
          </tr>`
      )
      }

    })
}

function addTodo() {
  let name = $('#nama').val()
  let description = $('#description').val()
  let due_date = $('#due_date').val()
  let status = false
  let projectId = idProjectSelected

  $.ajax({
    url: "http://localhost:3000/todos",
    method: 'POST',
    data: {
      name, description, due_date, status, projectId
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done((response) => {
      $('#nama').val('')
      $('#description').val('')
      $('#due_date').val('')
      detailProject(projectId)
    })
    .fail((jqXHR, textStatus) => {
      console.log(`request failed ${textStatus}`)
    })
}
