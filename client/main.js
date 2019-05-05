function isAuth () {
  return !!localStorage.getItem('FancyTodo_auth_token')
}

$(document).ready(function () {
  let nav = $('#navbar-nav')
  let main = $('main')

  $('#app').on('logged-in', function () {
    nav.html('')
    main.html('')
    renderLinkLogout(nav)
    renderPanelDashboard(main)

    axios
      .get('http://localhost:3000/todos', {
        headers: {
          Authorization: localStorage.getItem('FancyTodo_auth_token')
        }
      })
      .then(({ data }) => {
        renderCardTodos($('#panel-dashboard'), data.todos)
        renderFormTodo($('#panel-dashboard'))
      })
      .catch(err => console.log(err))
  })

  $('#app').on('logged-out', function () {
    nav.html('')
    main.html('')
    renderLinkRegister(nav)
    renderLinkLogin(nav)
    renderFormLogin(main)
  })

  if (!isAuth()) {
    renderLinkRegister(nav)
    renderLinkLogin(nav)
    renderFormLogin(main)
  } else {
    renderLinkLogout(nav)
    renderPanelDashboard(main)

    axios
      .get('http://localhost:3000/todos', {
        headers: {
          Authorization: localStorage.getItem('FancyTodo_auth_token')
        }
      })
      .then(({ data }) => {
        renderCardTodos($('#panel-dashboard'), data.todos)
        renderFormTodo($('#panel-dashboard'))
      })
      .catch(err => console.log(err))
  }
})
