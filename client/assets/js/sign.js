function onSignIn(googleUser) {
  const { id_token } = googleUser.getAuthResponse();

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/login',
    data: {
      id_token,
      type: 'google',
    },
  })
    .done((response) => {
      console.log(response);
    })
    .fail((jqXHR, textStatus) => {
      console.log(textStatus);
    });
};


function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut()
    .then( () => {
      console.log('User signed out.');
      localStorage.clear();
    });
}