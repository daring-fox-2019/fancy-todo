let idProjectSelected = null

function detailProject(id) {
  idProjectSelected = id

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
      console.log(data);
      
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
                            <ul id='list-todo'>
                            </ul>

                          </div>
                        </div>
                        
                        <div class="modal fade" id="modalMember" tabindex="-1" role="dialog" aria-labelledby="modalMemberLabel" aria-hidden="true">
                          <div class="modal-dialog" role="document">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="modalMemberLabel">Add Member</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div class="modal-body" style="text-align: center">
                                <select id="listUser" class="combobox">
                                  <option disabled selected>-- Choose --</option>
                                </select>
                                <br/><br/>
                                <div class="modal-footer">
                                  <button type="submit" class="btn btn-primary" onClick="addMember()">Save</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="modal fade" id="modalTodo" tabindex="-1" role="dialog" aria-labelledby="modalTodoLabel" aria-hidden="true">
                          <div class="modal-dialog" role="document">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="modalTodoLabel">Add Todo</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div class="modal-body">
                                <select id="listUser" class="combobox">
                                  <option disabled selected>-- Choose --</option>
                                </select>
                                <br/>
                                <div class="modal-footer">
                                  <button type="submit" class="btn btn-primary" onClick="addMember()">Save</button>
                                </div>
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

      $.ajax({
        url: `http://localhost:3000/users`,
        method: 'GET'
      })
        .done(function ( data ) {
          console.log(data);
          for(user of data){
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
        if(jqXHR.status===400){
          
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


{/* <div id="addTodo">
            <h1 class="justify-content-center">Add Todo</h1>
            <form id="form-addTodo">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" id="nama" placeholder="Name taks">
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <input type="text" class="form-control" id="description" placeholder="The description">
              </div>
              <div class="form-group">
                <label for="due_date">Due Date</label>
                <input type="text" class="form-control" id="due_date" placeholder="YYYY-MM-DD">
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div> */}