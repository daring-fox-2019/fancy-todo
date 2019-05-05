
function detailProject(id) {
  idProjectSelected = id
  let statusOwner = null

  $('#addProject').hide()
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
                    <th scope="col">Status</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody id='list-todo'>
                  
                </tbody>
              </table>
            </div>
            <div id="buttonDeleteProject">
            </div>
          </div>
          
      `)

      if (data.owner._id == localStorage.userId) {
        console.log("OWNER");
        console.log(data._id);
        
        $('#buttonDeleteProject').append(`<button type="button" class="btn btn-danger" onClick="deleteProject('${data._id}')">
            Delete Project
          </button>`)
      }

      for (members of data.members) {
        $('#list-members').append(`<li>${members.name}</li>`)
      }

      for ([index, todo] of data.todos.entries()) {
        $('#list-todo').append(`<tr>
              <th scope="row">${index + 1}</th>
              <td>${todo.name}</td>
              <td>${todo.description}</td>
              <td>${todo.status}</td>
              <td>${todo.due_date}</td>
              <td>
                <i class="fas fa-info-circle"></i>
                <i class="fas fa-edit" data-toggle="modal" data-target="#modalEditTodo"></i>
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
  console.log("MASUK");

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

function addMember() {
  console.log($('#listUser').val());
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

        $('#list-members').empty()
        for (members of response.members) {
          $('#list-members').append(`<li>${members.name}</li>`)
        }
        console.log("ADD member success");

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

