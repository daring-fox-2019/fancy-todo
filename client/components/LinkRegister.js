let linkRegister = function () {
  return `
  <li class="nav-item">
    <a href="#" class="nav-link" id="link-register">Register</a>
  </li>
  `
}

function renderLinkRegister (target) {
  target.append(linkRegister())
  $('#link-register').click(function (e) {
    e.preventDefault()

    $('main').html('')
    renderFormRegister($('main'))
  })
}
