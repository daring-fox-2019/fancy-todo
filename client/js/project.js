function detailProject(id) {

  $('#addProject').hide()
  $('#detail-project').empty()
  $.ajax({
    url: `http://localhost:3000/projects/${id}`,
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
                            <h5>Owner</h5>
                            <h5 class="card-title"> Name : ${data.owner.name}</h5>

                            <h5>Members</h5>
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                            Add Member
                              </button>
                            <ul id='list-members'>
                            </ul>

                            <h5>Todos</h5>
                            <ul id='list-todo'>
                            </ul>

                          </div>
                        </div>
                        
                        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div class="modal-dialog" role="document">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div class="modal-body">
                                <form id="form-addMember">
                                  <div class="modal-body">
                                    <input type="text" placeholder="Name" id="nameMember">
                                  </div>
                                  <div class="modal-footer">
                                   <button type="submit" class="btn btn-primary">Save</button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
      `)

      for (members of data.members) {
        $('#list-members').append(`<li>${members.name}</li>`)
      }

      for (todo of data.todos) {
        $('#list-members').append(`<li>${todo.name}</li>`)
      }
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
      $('#exampleModal').modal('hide');
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
  $.ajax({
    url: `http://localhost:3000/todos/${id}`,
    method: 'DELETE',
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

function listProject() {
  $('#list-todo').empty()

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
  console.log($('#nameProject').val());

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

function createProject() {
  $('#detail-project').empty()
  $('#addProject').show()
}

function backProject() {
  $('#addProject').hide()
}
