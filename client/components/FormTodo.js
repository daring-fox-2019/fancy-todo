let formTodo = function (todo) {
  return `
  <div class="col-5">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${todo ? 'Edit' : 'Create'} Todo</h5>
        <hr>
        <form id="form-todo">
          ${!todo
            ?
            `<div class="form-group">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="category" value="private" checked>
                <label class="form-check-label">Private</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="category" value="project">
                <label class="form-check-label">Project</label>
              </div>
              <button type="button" class="btn text-primary text-uppercase" data-toggle="modal" data-target="#modal-create-project"><i class="fa fa-plus"></i> Project</button>
              <div class="form-check form-check-inline" style="display: none;">
                <select class="form-control form-control-sm" name="project">
                </select>
              </div>
            </div>
            ` : ''}
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" class="form-control" name="title" value="${todo ? todo.title : ''}" required>
          </div>
          <div class="form-group">
            <label for="due-date">Due date</label>
            <input type="date" class="form-control" name="due-date" value="${todo ? moment(todo.dueDate).format('YYYY-MM-DD'): ''}" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea class="form-control" name="description" required>${todo ? todo.description : ''}</textarea>
          </div>
          <button class="btn btn-success" type="submit">Save</button>
          <button class="btn btn-light">Cancel</button>
        </form>
      </div>
    </div>

    <div class="modal" id="modal-create-project" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Create a Project</h5>
              <hr>
              <form id="form-project">
                <div class="form-group">
                  <label for="title">Title</label>
                  <input type="text" class="form-control" name="title" required>
                </div>
                <div class="form-group">
                  <label for="description">Description</label>
                  <textarea class="form-control" name="description" required></textarea>
                </div>
                <button class="btn btn-success" type="submit">Save</button>
                <button class="btn btn-light">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
}

function renderTodos () {
  axios
    .get('http://localhost:3000/todos', {
      headers: {
        Authorization: localStorage.getItem('FancyTodo_auth_token')
      }
    })
    .then(({ data }) => {
      $('#panel-dashboard').html('')
      renderCardTodos($('#panel-dashboard'), data.todos)
      renderFormTodo($('#panel-dashboard'))
    })
    .catch(err => console.log(err))
}

let choiceProject = function (project) {
  return `
    <option value="${project._id}">${project.title}</option>
  `
}

function handleFormTodoSubmit (e, id) {
  e.preventDefault()

  let formData = $(e.target).serializeArray()
  $(e.target).trigger('reset')

  let todo = {
    title: formData.find(input => input.name === 'title').value,
    description: formData.find(input => input.name === 'description').value,
    dueDate: formData.find(input => input.name === 'due-date').value,
    status: 'ongoing',
  }

  if (id) {
    axios
      .put(`http://localhost:3000/todos/${id}`, todo, {
        headers: {
          Authorization: localStorage.getItem('FancyTodo_auth_token')
        }
      })
      .then(({ data }) => {
        let inputProject = formData.find(input => input.name === 'project')
        if (formData.find(input => input.name === 'category').value === 'project') {
          return axios
            .put(`http://localhost:3000/projects/${inputProject.value}/todos`, {
              todoId: data.todo._id
            }, {
              headers: {
                Authorization: localStorage.getItem('FancyTodo_auth_token')
              }
            })
        }
      })
      .then(() => {
        renderTodos()
      })
      .catch(err => console.log(err))
  } else {
    axios
      .post('http://localhost:3000/todos', todo, {
        headers: {
          Authorization: localStorage.getItem('FancyTodo_auth_token')
        }
      })
      .then(({ data }) => {
        let inputProject = formData.find(input => input.name === 'project')
        if (inputProject) {
          return axios
            .put(`http://localhost:3000/projects/${inputProject.value}/todos`, {
              todoId: data.todo._id
            }, {
              headers: {
                Authorization: localStorage.getItem('FancyTodo_auth_token')
              }
            })
            .then(() => {})
            .catch(err => console.log(err))
        }
      })
      .then(() => {
        renderTodos()
      })
      .catch(err => console.log(err))
  }
}

function renderFormTodo (target, id) {
  if (typeof id !== 'undefined') {
    axios
      .get(`http://localhost:3000/todos/${id}`, {
        headers: {
          Authorization: localStorage.getItem('FancyTodo_auth_token')
        }
      })
      .then(({ data })=> {
        target.append(formTodo(data.todo))
        $('#form-todo').submit(e => handleFormTodoSubmit(e, id))

        $('input[type="radio"]').change(function (e) {
          if (e.target.value === 'project') $('select[name="project"]').parent().show()
          else $('select[name="project"]').parent().hide()
        })

        axios
          .get('http://localhost:3000/projects', {
            headers: {
              Authorization: localStorage.getItem('FancyTodo_auth_token')
            }
          })
          .then(({ data }) => {
            data.projects.forEach(project => {
              $('select[name="project"]').append(choiceProject(project))
            })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  } else {
    target.append(formTodo())
  }

  $('#form-todo').submit(handleFormTodoSubmit)

  $('#form-project').submit(function (e) {
    e.preventDefault()

    let project = $(this).serialize()

    axios
      .post('http://localhost:3000/projects', project, {
        headers: {
          Authorization: localStorage.getItem('FancyTodo_auth_token')
        }
      })
      .then(({ data }) => {
        $('#modal-create-project').modal('hide')
        renderTodos()
      })
      .catch(err => console.log(err))
  })

  $('input[type="radio"]').change(function (e) {
    if (e.target.value === 'project') $('select[name="project"]').parent().show()
    else $('select[name="project"]').parent().hide()
  })

  axios
    .get('http://localhost:3000/projects', {
      headers: {
        Authorization: localStorage.getItem('FancyTodo_auth_token')
      }
    })
    .then(({ data }) => {
      data.projects.forEach(project => {
        $('select[name="project"]').append(choiceProject(project))
      })
    })
    .catch(err => console.log(err))
}
