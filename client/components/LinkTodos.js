let linkTodos = function () {
  return `
  <li class="nav-item">
    <a href="#" class="nav-link" id="link-todos">Todos</a>
  </li>
  `
}

function renderLinkTodos (target) {
  target.append(linkTodos())
  $('#link-todos').click(function (e) {
    e.preventDefault()

    $('main').html('')
    renderCardTodos($('main'))
  })
}
