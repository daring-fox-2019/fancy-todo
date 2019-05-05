let linkLogin = function () {
  return `
  <li class="nav-item">
    <a href="#" class="nav-link" id="link-login">Login</a>
  </li>
  `
}

function renderLinkLogin (target) {
  target.append(linkLogin())
  $('#link-login').click(function (e) {
    e.preventDefault()

    $('main').html('')
    renderFormLogin($('main'))
  })
}
