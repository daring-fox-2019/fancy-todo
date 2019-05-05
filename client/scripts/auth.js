$(document).ready(function (e) {
    $('#form-login').submit(handleSubmitLogin)
    $('#form-register').submit(handleSubmitRegister)
    if (localStorage.fancy_token) {
        hideLogin()
    } else {
        showLogin()
    }
})

function handleSubmitLogin(e) {
    e.preventDefault()

    let email = $('#login-email').val()
    let password = $('#login-password').val()

    axios
        .post('http://localhost:3000/users/login', { email, password })
        .then(({ data }) => {
            saveLogin(data)
            console.log('successfully logged in')
            Swal.fire({
                type: 'success',
                title: 'Login success',
                text: 'Welcome to Fancy Todo!',
                timer: 1500
            })
            // hideLogin()
            $('#loginModal').modal('hide')
            hideLogin();
            initialLoad()
        })
        .catch(err => {
            console.log(err)
            swalError(err.response.data.message)
        })
}

function saveLogin(data) {
    // console.log('signed-in')
    // console.log(data)
    localStorage.setItem('fancy_user', JSON.stringify(data.user))
    localStorage.setItem('fancy_token', data.token)
}

function handleClickLogout() {
    Swal.fire({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
    }).then((result) => {
        if (result.value) {
            let auth2 = gapi.auth2.getAuthInstance()
            auth2.signOut().then(function () {
                console.log('signed-out')
                localStorage.removeItem('fancy_user')
                localStorage.removeItem('fancy_token')

                Swal.fire(
                    'Logged out!',
                    'See you again.',
                    'success'
                )

                showLogin()
            })
        }
    })
}

function handleSubmitRegister(e) {
    // console.log('handling submit')
    e.preventDefault()

    let name = $('#register-name').val()
    let email = $('#register-email').val()
    let password = $('#register-password').val()

    axios
        .post('http://localhost:3000/users/register', {
            name,
            email,
            password
        })
        .then(({ data }) => {
            // console.log(data)
            // console.log('register success')
            Swal.fire({
                type: 'success',
                title: 'Register success',
                text: 'You can now log in to Fancy Todo!',
                timer: 1500
            })
            $('#registerModal').modal('hide')
        })
        .catch(err => {
            // console.log(err.response)
            swalError(err.response.data.error)
        })
}

function handleGoogleSignin(googleUser) {
    let token = googleUser.getAuthResponse().id_token

    axios
    .post('http://localhost:3000/users/google-login', { token })
    .then(({ data }) => {
        saveLogin(data)
        Swal.fire({
            type: 'success',
            title: 'Login success',
            text: 'Welcome to Fancy Todo!',
            timer: 1500
        })
        $('#loginModal').modal('hide')
        hideLogin()
        initialLoad()
    })
    .catch(err => {
        console.log(err)
    })
}