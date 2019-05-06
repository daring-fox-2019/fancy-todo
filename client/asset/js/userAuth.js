function register() {
    const name = `${$("#first_name").val()} ${$("#last_name").val()}`;
    const email = $("#email").val();
    const password = $("#password").val();

    axios.post( `${url}/users/register`, { name, email, password })
    .then(({data}) => {
      Swal.fire({
          type: "success",
          title: "Register Successfully"
      });

       $("#first_name").val('') 
       $("#last_name").val('')
       $("#email").val('');
       $("#password").val('');
    })
    .catch( err => {
      console.log(err)
      Swal.fire({
          type: "error",
          title: "Login Failed",
          text: `${err.response.data.message}`
        });
    })
  }


function login() {
  const email = $("#email-login").val();
  const password = $("#password-login").val();
  axios.post(`${url}/users/login` , { email, password })
  .then(({data}) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('email', data.email)
    token = data.token

    $("#login").hide();
    $("#home").show();
    $('footer').show()
    $('#project').hide()
    getAllTaskUser()
  })
  .catch( err => {
    Swal.fire({
        type: "error",
        title: "Login Failed",
        text: `${err.response.data.message}`
      });
  })
}

function logout(){
    localStorage.removeItem('token')
    $('#container-task-user').empty()
    $('#content-project-todo').empty()
    $("#login").show();
    $("#home").hide();
    $('footer').hide()
    $('#project').hide()
    $('#container-google-calendar').empty()

    signOut()
    
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}


