var serverURL = 'http://localhost:3000'

function statusChangeCallback(response) {
    debugger
    let cbResponse = response
    let email, name
    FB.api('/me', {fields: 'name, email'}, function(response) {
        name = response.name
        email = response.email

        if (cbResponse.status === 'connected') {
            // Logged into your app and Facebook.
            if(!localStorage.getItem('todo_token')) {
                $.ajax({
                    method: 'POST',
                    url: serverURL + '/auth/fb',
                    data: {
                        name: name,
                        email: email
                    }
                })
                .done(function(data) {
                    setUserData(data);
                    swal("Welcome, "+currentUser.name, "You have logged in succesfully!", "success");
                    
                    localStorage.setItem('todo_token', data.token);
                    localStorage.setItem('todo_id', data._id);
                    localStorage.setItem('todo_email', data.email);
                    localStorage.setItem('todo_name', data.name);
                    localStorage.setItem('todo_role', data.role);
            
                    M.Modal.getInstance($('#loginModal')).close();
                    isLogin();
                })
                .catch(function(err) {
                    swal("Error", err.responseText, "error");
                })
            }
        } else {
          // The person is not logged into your app or we are unable to tell.
          swal("Error", 'Please try again...', "error");
        }
    });
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
