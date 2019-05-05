function login(e) {
  e.preventDefault();

  const data = {
    username: $("#username").val(),
    password: $("#password").val()
  };

  $.post(`${BASE_URL}/api/login`, data)
    .done(response => {
      console.log(response);
      localStorage.token = response.token;

      $("#table-todos").text("");
      $("#username").val("");
      $("#password").val("");
      
      afterLogin();
      $("#welcome-alert-message").text(response.message);
      $("#welcome-alert").show();
    })

    .fail((jqXHR, textStatus) => {
      console.log(textStatus);

      swal({
        title: "Wrong username/password",
        icon: "error",
      });
    });
}

function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.

  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    type: "POST",
    url: `${BASE_URL}/api/google-login`,
    headers: {
      token: id_token,
    }
  })

    .done(response => {
      console.log(response);
      localStorage.token = response.token;

      $("#table-todos").text("");
      showTodos();
      $("#welcome-alert-message").text(response.message);
      $("#before-login").hide();
      $("#form-login").modal("hide");
      $("#after-login").show();
    })

    .fail((jqXHR, textStatus) => {
      console.log(textStatus);
    });
}

function logout() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });

  beforeLogin();
}

function register(e) {
  e.preventDefault();

  const data = {
    username: $("#username-register").val(),
    password: $("#password-register").val()
  };

  $.post(`${BASE_URL}/api/register`, data)
    .done(response => {
      console.log(response);

      localStorage.token = response.token;

      $("#username-register").val("");
      $("#password-register").val("");

      afterLogin();
      $("#welcome-alert-message").text("Welcome to Fancy Todo!");
      $("#welcome-alert").show();

      swal({
        title: "You have successfully registered",
        icon: "success",
      });
    })
    .fail((jqXHR, textStatus) => {
      console.log(textStatus);

      swal({
        title: "That username is taken. Try another.",
        icon: "error",
      });
    });
}

function getUserList() {
  console.log("getUserList");

  $.ajax({
    method: "GET",
    url: `${BASE_URL}/api/users`,
    headers: {
      token: localStorage.token,
    }
  })
    .done((response) => {
      console.log(response);

      const availableUsers = [];

      response.forEach((user) => {
        availableUsers.push(user.username);
      });

      $("#add-member-name").autocomplete({
        source: availableUsers
      });
    })
}