function detailProject(id) {
  idProjectSelected = id

  $('#addProject').hide()
  $('#listUser').empty()
  $('#detail-project').empty()
  $.ajax({
    url: `http://localhost:3000/projects/${idProjectSelected}`,
    method: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function ({ data }) {
      $('#detail-project').append(`<div class="card ">
            <h5 class="card-header">Detail Project</h5>
            <div class="card-body">
              <h5 class="card-title"> Name : ${data.name}</h5>
              <h5>Owner : ${data.owner.name}</h5>

              <h5>Members</h5>
              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalMember">
              Add Member
                </button>
              <ul id='list-members'>
              </ul>

              <h5>Todos</h5>
              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalTodo">
              Add Todo
                </button>
              <table class="table">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody id='list-todo'>
                  
                </tbody>
              </table>
              <div id="buttonDeleteProject">
              </div>
            </div>
          </div>

          
          <div class="modal fade" id="modalEditTodo" tabindex="-1" role="dialog" aria-labelledby="modalEditTodoLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="modalEditTodoLabel" class="titleEditTodo">Edit Todo</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <label for="titleTodoProject">Name</label>
                  <input type="text" class="form-control" id="titleTodoProject" placeholder="Name taks">
                
                  <label for="descriptionTodoProject">Description</label>
                  <input type="text" class="form-control" id="descriptionTodoProject" placeholder="The description">
                
                  <label for="due_dateTodoProject">Due Date</label>
                  <input type="text" class="form-control" id="due_dateTodoProject" size="30" aria-describedby="due_dateTodoProject"
                    placeholder="yyyy-mm-dd" autocomplete="off">
                                  
                  <br/>
                  <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" onClick="editTodo('project')">Edit</button>
                  </div>
              </div>
            </div>
          </div>
      `)

      if (data.owner._id == localStorage.userId) {
        $('#buttonDeleteProject').append(`<button type="button" class="btn btn-danger" onClick="deleteProject('${data._id}')">
            Delete Project
          </button>`)
      }

      for (member of data.members) {
        let buttonDelete = ''
        if (data.owner._id == localStorage.userId) {
          buttonDelete = `<i class="fas fa-times-circle" onClick="deleteMember('${member._id}')"></i>`
        }
        $('#list-members').append(`<li>${member.name} ${buttonDelete}</li> `)
      }

      for ([index, todo] of data.todos.entries()) {
        let status = ''
        let buttonStatus = ''
        let info = ''

        if (todo.status === false) {
          status = 'Not yet'
          buttonStatus = `<i class="fas fa-check-circle" onClick="changeStatus('${todo._id}','${todo.status}')"></i>`
        } else {
          status = 'Done'
          buttonStatus = `<i class="fas fa-times-circle" onClick="changeStatus('${todo._id}','${todo.status}')"></i>`
        }

        let due_date = new Date(todo.due_date)
        let date = due_date.getDate()
        let month = due_date.getMonth() + 1
        let year = due_date.getFullYear()

        let difference = Math.ceil((new Date(todo.due_date) - new Date()) / (24 * 60 * 60 * 1000))

        if (date < 10) {
          date = `0${date}`
        }
        if (month < 10) {
          month = `0${month}`
        }
        
        if (todo.status == true) {
          info = "table-success"
        } else if (difference < 0 && todo.status == false) {
          info = "table-danger"
        } else if ((difference == 1 || difference == 0) && todo.status == false) {
          info = "table-warning"
        }
        
        $('#list-todo').append(`<tr class="${info}" >
              <th scope="row">${index + 1}</th>
              <td>${todo.name}</td>
              <td>${todo.description}</td>
              <td>${year}-${month}-${date}</td>
              <td>${status}</td>
              <td>
                ${buttonStatus}
                <i class="fas fa-edit" onClick="modalTodoEdit('${todo._id}')" data-toggle="modal" data-target="#modalEditTodo" ></i>
                <i class="fas fa-trash-alt" onClick='deleteTodo("${todo._id}")'></i>
              </td>
            </tr>`
        )
      }

      $.ajax({
        url: `http://localhost:3000/users`,
        method: 'GET'
      })
        .done(function (data) {
          for (user of data) {
            $('#listUser').append(`<option value="${user._id}">${user.name}</option>`)
          }
        })
    })
    .fail(function (err) {
      console.log(err);
    })
}

function editProject(id) {
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
      $(".modal-backdrop").remove();
      $('#detail-todo').empty()
      $('#nameProject').val('')
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

function deleteProject(id) {
  swal({
    title: "Are you sure want to delete this project?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      if (willDelete) {
        $.ajax({
          url: `http://localhost:3000/projects/${id}`,
          method: 'DELETE',
          headers: {
            token: localStorage.getItem('token')
          }
        })
          .done(function (response) {
            swal("Delete Project Success", "", "success");
            $('#detail-project').empty()
            listProject()
          })
          .fail(err => {
            console.log(err);

            swal("This not yours!", "", "error");
          })
      }
    });
}

function listProject() {
  $('#list-project').empty()

  $.ajax({
    url: 'http://localhost:3000/projects',
    method: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      for (project of response.data) {
        let info = null
        let difference = Math.ceil((new Date(project.due_date) - new Date()) / (24 * 60 * 60 * 1000))
        if (project.status == true) {
          info = "list-group-item-success"
        } else if (difference < 0 && project.status == false) {
          info = "list-group-item-danger"
        } else if ((difference == 1 || difference == 0) && project.status == false) {
          info = "list-group-item-warning"
        }

        $('#list-project').append(`<li class="list-group-item list-group-item-action ${info}" onclick='detailProject("${project._id}")'>${project.name}</li>`)
      }

    })
}

function addProject(event) {
  event.preventDefault()
  if ($('#nameProject').val()) {
    let name = $('#nameProject').val()

    $.ajax({
      url: "http://localhost:3000/projects",
      method: 'POST',
      data: {
        name
      },
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .done((response) => {
        $('#nameProject').val('')
        $('#addProject').hide()
        listProject()
      })
      .fail((jqXHR, textStatus) => {
        console.log(`request failed ${textStatus}`)
      })
  }
}

function deleteMember(userId) {
  swal({
    title: "Are you sure want to delete this member?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      if (willDelete) {
        $.ajax({
          url: `http://localhost:3000/projects/deleteMember/${idProjectSelected}`,
          method: 'POST',
          data: {
            user: userId
          },
          headers: {
            token: localStorage.getItem('token')
          }
        })
          .done((response) => {
            detailProject(idProjectSelected)
            swal("Delete Member Success", "", "success");
          })
          .fail((jqXHR, textStatus) => {
            console.log(jqXHR.status);
            if (jqXHR.status === 400) {

            }

            console.log(`request failed ${textStatus}`)
          })
      }
    });

}

function addMember() {
  if ($('#listUser').val()) {
    let user = $('#listUser').val()

    $.ajax({
      url: `http://localhost:3000/projects/addMember/${idProjectSelected}`,
      method: 'POST',
      data: {
        user
      },
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .done((response) => {
        $('#modalMember').modal('hide');
        detailProject(idProjectSelected)
        listProject()
      })
      .fail((jqXHR, textStatus) => {
        console.log(jqXHR.status);
        if (jqXHR.status === 400) {

        }

        console.log(`request failed ${textStatus}`)
      })
  }
}

function createProject() {
  $('#detail-project').empty()
  $('#addProject').show()
}

function backProject() {
  $('#addProject').hide()
}

