const formLogin = function () {
  return `
  <div class="card mx-auto" style="width: 320px">
    <div class="card-body">
      <h5 class="card-title">Login</h5>
      <hr class="mb-4">
      <form id="form-login" method="POST">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" name="email" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" name="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block mt-4">Login</button>
      </form>
    </div>
  </div>
  `
}

function renderFormLogin (target) {
  target.append(formLogin())
  $('#form-login').submit(function (e) {
    e.preventDefault()

    let data = $(this).serialize()

    axios
      .post('http://localhost:3000/auth/login', data)
      .then(({ data }) => {
        $(this).trigger('reset')
        let { token, user } = data

        localStorage.setItem('FancyTodo_auth_token', token)
        localStorage.setItem('FancyTodo_auth_user', JSON.stringify(user))

        $('#app').trigger('logged-in')
      })
      .catch(err => console.log(err))
  })
}
