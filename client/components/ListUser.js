let listUser = function () {
  return `
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Users</h5>
      <hr>
    </div>
  </div>
  `
}

function renderFormTodo (target) {
  target.append(formTodo())

  $('input[type="radio"]').change(function (e) {
    $('select[name="project"]').prop('disabled', e.target.value !== 'project')
  })
}
