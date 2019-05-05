const formRegister = function () {
  return `
  <div class="card mx-auto" style="width: 320px;">
    <div class="card-body">
      <h5 class="card-title">Register</h5>
      <hr class="mb-4">
      <form id="form-register">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" name="email" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" name="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block mt-4">Register</button>
      </form>
    </div>
  </div>
  `
}

function renderFormRegister (target) {
  target.append(formRegister())
  $('#form-register').submit(function (e) {
    e.preventDefault()

    let data = $(this).serialize()

    axios
      .post('http://localhost:3000/auth/register', data)
      .then(() => {
        $('main').html('')
        renderFormLogin($('main'))
      })
      .catch(err => console.log(err))
  })
}
