let myProjects
let projectId
function getMyProjects() {
  $.ajax({
    method: 'get',
    url: 'http://localhost:3000/projects/myProjects',
    headers: {
      token: localStorage.token
    }
  })
    .done(dataArr => {
      myProjects = dataArr
      // console.log({dataArr, dari: 'getMyProjects'})
      if(!Array.isArray(dataArr) || !dataArr.length) $("#empty-project").show()
      else $('#emtpy-project').hide()
      $('#project-list').empty()
      $('#project-list').append(`<button type="button" class="list-group-item list-group-item-action" onclick="showWhichTodos('main')">My Todos</button>`)
      for([index, item] of dataArr.entries()) {
        $('#project-list').append(`<button type="button" class="list-group-item list-group-item-action" onclick="showWhichTodos('${item._id}')">${item.name}</button>`)
      }
    })
    .fail(err => {
      console.log({err, dari: 'getMyProjects'})
      swal(`Error ${err.status}: ${err.statusText}`, err.responseJSON.error, 'error')
    })
}
function showWhichTodos(input) {
  projectId = input
  // console.log({input, projectId, dari: 'which'})
  if(input == 'main') {
    getTasks()
  } else {
    let data = myProjects.filter(item => item._id == input)[0].todos
    console.log({data})
    $('#form-project').show()
    fillTodos(data)
    // $('#task-body').prepend(`<select class="custom-select my-1 mr-sm-2" class="user-list" name="user"></select>`)
  }
}
function createProject() {
  event.preventDefault()
  let data = $(this).serializeArray().reduce((acc, cur) => {
    acc[cur.name] = cur.value
    return acc
  }, {})
  console.log({data, dari: 'createProject'})
  $.ajax({
    method: 'post',
    url: 'http://localhost:3000/projects',
    data,
    headers: {
      token: localStorage.token
    }
  })
    .done(response => {
      $('#form-create-project')[0].reset()
      getMyProjects()
    })
    .fail(err => {
      console.log({err})
      let message = (err.responseJSON.message) ? err.responseJSON.message : err.responseJSON.error
      swal('Error', message, 'error')
    })
}
function addMember() {
  event.preventDefault()
  let data = $(this).serializeArray().reduce((acc, cur) => {
    acc[cur.name] = cur.value
    return acc
  }, {})
  data.status = true
  console.log({userId: data.user, projectId, dari: 'add member'})
  $.ajax({
    method: 'put',
    url: `http://localhost:3000/projects/${projectId}/${data.user}`,
    headers: {
      token: localStorage.token
    },
    data: { method: 'add' }
  })
    .then(response => {
      swal('Yay~!', 'Successfully added member.', 'success')
      getMyProjects()
    })
    .catch(err => {
      console.log({err})
      let message = (err.responseJSON.message) ? err.responseJSON.message : err.responseJSON.error
      swal('Error', message, 'error')
    })
}
function createProjectTodo() {
  event.preventDefault()
  let data = $(this).serializeArray().reduce((acc, cur) => {
    acc[cur.name] = cur.value
    return acc
  }, {})
  console.log({data})
  $.ajax({
    url: `http://localhost:3000/projects/${projectId}`,
    method: 'post',
    data,
    headers: {
      token: localStorage.token
    }
  })
    .done(response => {
      $('#modal-project').modal('hide')
      projectUpdate()
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