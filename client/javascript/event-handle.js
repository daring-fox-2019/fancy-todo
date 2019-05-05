$(document).ready(function(){
  $('.ui.menu')
  .visibility({
    type   : 'fixed'});
    
  getUserData()
    
  getQuote()
  
  checkLogin()

  setTimeout(function(){
    $('.ui.menu.placeholder').hide();
    $("#content-view").transition('show')},
  2000)
    
    $('.ui.dropdown').dropdown();

  })

function getUserData(){
  console.log(localStorage.getItem('id'))
  $.ajax( {
    method :'GET',
    url: 'http://localhost:3000/todos',
    headers : {
      id : localStorage.getItem('id'),
      token : localStorage.getItem('token'),
      email : localStorage.getItem('email')
    }
    })
  .done(function(response) {
    console.log(response)
    response.forEach(todo => {
      let id = JSON.stringify(todo._id)
      console.log(id)
      $('#todo-list').append(`<ol class="ui list">`)
      $('#todo-list').append(`<li><h4>${todo.name} <i class="chevron right icon"></i> <div class="ui mini grey horizontal label">${JSON.stringify(todo.status)}</div></h4>`)
      $('#todo-list').append("Action : <label class='ui mini green label' onclick='markDone\("+ id +")\'>mark as done<label>")
      $('#todo-list').append("<label class='ui mini red label' onclick='deleteTodo\("+ id +")\'>delete this<label>")
      $('#todo-list').append("</li></ul>")
    })
    })
  .fail(function(jqXHR, textStatus) {
    console.log(jqXHR)
    console.log(textStatus)
    location.reload();  
  })
}


function deleteTodo(todoId){
  $.ajax( {
    method :'DELETE',
    url: `http://localhost:3000/todos/${todoId}`,
    headers : {
      id : localStorage.getItem('id'),
      token : localStorage.getItem('token'),
      email : localStorage.getItem('email')
    }
    })
    .done(response=>{
      if(response == "success"){
        location.reload()
      } else {
        location.reload()
        console.log("error delete")
      }
    })
    .fail(err=>{
      console.log("huft delete", err)
      location.reload()
    })
}

function markDone(todoId){
  $.ajax( {
    method :'PUT',
    url: `http://localhost:3000/todos/${todoId}`,
    headers : {
      id : localStorage.getItem('id'),
      token : localStorage.getItem('token'),
      email : localStorage.getItem('email')
    },
    data : {
      status : "completed"
    }
    })
    .done(response=>{
      if(response == "success"){
        location.reload();
      }
    })
    .fail(err=>{
      console.log("huft", err)
      location.reload();
    })
}

function getQuote(){
  $.ajax( {
    method :'GET',
    url: 'http://quotes.rest/qod.json',
    })
  .done(function(response) {
    let str = `${JSON.stringify(response.contents.quotes[0].quote)}`
    $('#quote-content').text(str)
    $('#quite-content').append(`<br> - ${JSON.stringify(response.contents.quotes[0].author)}<br>`)
    })
  .fail(function(jqXHR, textStatus) {
    $('#quote-content').text(`"do not give up" - unknown`)
    })
}

function checkLogin(){
  if(localStorage.getItem('token') != undefined || localStorage.getItem('token')) {
    $(".login-false").transition('hide')
    $(".login-true").transition('hide')
    $(".login-true").transition('fly up')
  } else {
    $(".login-true").transition('hide')
    $(".login-false").transition('hide')
    $(".login-false").transition('fly up')
  }
}

function onSignIn(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token;
  $.ajax({
      url: `http://localhost:3000/users/loginGoogle`,
      method: `POST`,
      headers: {
          token:idToken}
  })
  .done(function(response) {
      localStorage.setItem('id', response.id)
      localStorage.setItem('email', response.user)
      localStorage.setItem('token', response.token)
      $(".login-true").show()
      $(".login-false").hide()
  })
  .fail(function(jqXHR, textStatus) {
      console.log(textStatus);
  })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    if(localStorage.getItem('token')) {
        localStorage.removeItem('token')
        $(".login-true").hide()
        $(".login-false").show()
    }
  });
}