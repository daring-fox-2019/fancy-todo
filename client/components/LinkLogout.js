let linkLogout = function () {
  return `
  <li class="nav-item">
    <a href="#" class="nav-link btn" id="link-logout">Logout</a>
  </li>
  `
}

function renderLinkLogout (target) {
  target.append(linkLogout())
  $('#link-logout').click(function (e) {
    e.preventDefault()

    localStorage.removeItem('FancyTodo_auth_user')
    localStorage.removeItem('FancyTodo_auth_token')
    $('#app').trigger('logged-out')
  })
}
