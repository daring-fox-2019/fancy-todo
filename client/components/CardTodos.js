let cardTodos = function () {
  return `
  <div class="col-7">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title mb-4">Todos</h5>
        <ul class="nav nav-pills mb-4" id="links-todo">
          <li class="nav-item">
            <a class="nav-link active" href="#user-todos">My Todos</a>
          </li>
        </ul>
        <div class="tab-content" id="detail-todo">
          <div class="tab-pane fade show active" id="user-todos">
          </div>
        </div>
      </div>
    </div>
  </div>
  `
}

let linkProject = function (project) {
  return `
  <li class="nav-item">
    <a class="nav-link" href="#${project._id}-todos">${project.title}</a>
  </li>
  `
}

let panelTodos = function (category) {
  return `
  <div class="tab-pane fade show" id="${category}-todos">
  </div>
  `
}

let cardTodo = function (todo, control = true) {
  return `
  <div class="card mb-3">
    <div class="card-body">
      ${control
        ? `
          <div style="position: absolute; top: 0; right: 0;" class="border-left border-bottom">
            <a class="btn border-right button-edit" href="#" data-id="${todo._id}"><i class="fa fa-pencil"></i></a>
            <a class="btn button-delete" href="#" data-id="${todo._id}"><i class="fa fa-times"></i></a>
          </div>
        `: ''}
      <p class="h5 mt-4">${todo.title}</p>
      <p>${todo.description}</p>
      ${todo.author
          ? `<h6>Author <small class="text-muted font-weight-bolder">${todo.author.email}</small></h6>`
          : ''
        }
      <h6>
        <span class="mr-2">Due</span>
        <small class="text-muted font-weight-bolder">${moment(todo.dueDate).format('MMM Do YY')}</small>
      </h6>
      <form>
        <h6>
          <span class="mr-2">Status</span>
          <div class="form-check form-check-inline">
            <input data-id="${todo._id}" type="radio" name="${todo._id}-status" class="form-check-input status-todo" id="ongoing" value="ongoing" ${todo.status === 'ongoing' ? 'checked' : ''} ${!control ? 'disabled': ''}>
            <label class="form-check-label">Ongoing</label>
          </div>
          <div class="form-check form-check-inline">
            <input data-id="${todo._id}" type="radio" name="${todo._id}-status" class="form-check-input status-todo" id="done" value="done" ${todo.status === 'done' ? 'checked' : ''} ${!control ? 'disabled': ''}>
            <label class="form-check-label" for="done">Done</label>
          </div>
        </h6>
      </form>
    </div>
  </div>
  `
}

function renderCardTodos (target, todos) {
  target.append(cardTodos())

  if (todos) {
    todos.forEach(todo => $('#user-todos').append(cardTodo(todo)))
  }

  $('.status-todo').change(function (e) {
    axios
      .get(`http://localhost:3000/todos/${$(this).data('id')}`, {
        headers: {
          Authorization: localStorage.getItem('FancyTodo_auth_token')
        }
      })
      .then(({ data }) => {
        data.todo.status = e.target.value
        return axios.put(`http://localhost:3000/todos/${$(this).data('id')}`, data.todo, {
          headers: {
            Authorization: localStorage.getItem('FancyTodo_auth_token')
          }
        })
      })
      .then(({ data }) => {
        renderTodos()
      })
      .catch(err => console.log(err))
  })

  $('.button-edit').click(function (e) {
    e.preventDefault()


    $('#panel-dashboard').children().last().remove()
    renderFormTodo($('#panel-dashboard'), $(this).data('id'))
  })

  $('.button-delete').click(function (e) {
    e.preventDefault()

    axios
      .delete(`http://localhost:3000/todos/${$(this).data('id')}`, {
        headers: {
          Authorization: localStorage.getItem('FancyTodo_auth_token')
        }
      })
      .then(() => {
        renderTodos()
      })
      .catch(err => console.log(err))
  })

  axios
    .get('http://localhost:3000/projects', {
      headers: {
        Authorization: localStorage.getItem('FancyTodo_auth_token')
      }
    })
    .then(({ data }) => {
      data.projects.forEach(project => {
        $('#links-todo').append(linkProject(project))
        $('#detail-todo').append(panelTodos(project._id))

        project.membersId.forEach(userId => {
          axios
            .get(`http://localhost:3000/users/${userId}`, {
              headers: {
                Authorization: localStorage.getItem('FancyTodo_auth_token')
              }
            })
            .then(({ data }) => {
              $(`#${project._id}-members`).append(`<span>${data.user.email}</span>`)
            })
        })

        Promise.all(project.todosId.map(id => {
          return axios.get(`http://localhost:3000/todos/${id}`, {
            headers: {
              Authorization: localStorage.getItem('FancyTodo_auth_token')
            }
          })
        }))
          .then(responses => {
            let todos = responses.map(res => res.data.todo)
            todos.forEach(todo => {
              axios
                .get(`http://localhost:3000/users/${todo.authorId}`, {
                  headers: {
                    Authorization: localStorage.getItem('FancyTodo_auth_token')
                  }
                })
                .then(({ data }) => {
                  todo.author = data.user
                  $(`#${project._id}-todos`).append(cardTodo(todo, false))
                })
                .catch(err => console.log(err))
            })
          })
          .catch(err => console.log(err))

        $('#links-todo').find($('a.nav-link')).click(function (e) {
          e.preventDefault()
          if (!$(this).hasClass('active')) {
            $('#links-todo').find($('a.nav-link.active')).toggleClass('active')
            $(this).toggleClass('active')
            $('#detail-todo').find($('div.tab-pane.active')).toggleClass('active')
            $(`${$(this).attr('href')}`).toggleClass('active')
          }
        })
      })
    })
}
