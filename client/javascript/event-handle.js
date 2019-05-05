$(document).ready(function(){
  
  $('.ui.menu')
  .visibility({
    type   : 'fixed'});
    
  getQuote()
  
  setTimeout(function(){
    $('.ui.menu.placeholder').hide()},
    3000)
    
  checkLogin()

  if(localStorage.getItem('token')){
    getUserData()
  }
    
  $("#content-view").transition('show')
  $('#name-field').popup()
  $('#description-field').popup()
  $('#due_date-field').popup()
  $('.ui.dropdown').dropdown();
})

function newTodo(){
  console.log("disini")
  $.ajax( {
    method :'POST',
    url: 'http://localhost:3000/todos',
    headers : {
      id : localStorage.getItem('id'),
      token : localStorage.getItem('token'),
      email : localStorage.getItem('email')
    },
    data : {
      name : $("#name-field").val(),
      description : $("#description-field").val(),
      due_date : $("#due_date-field").val()
    }
    })
  .done(function(response) {
    console.log(response)
      if(response == "success"){
        location.reload()
      } else {
        location.reload()
      }
    })
  .fail(function(jqXHR, textStatus) {
    console.log(jqXHR)
    console.log(textStatus)  
  })
}

// $('#dui-date-form').on('')

function getUserData(){
  $('#user-data').text(`Hello, ${localStorage.getItem('email')}`)
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
    response.forEach((todo, i) => {
      let id = JSON.stringify(todo._id)
      $('#todo-list').append("<h4><a onclick='detailTodo\("+ id +"\)'>"+ todo.name +"<a></h4>")
      if(todo.status == "completed"){
        $('#todo-list').append("Status : <div class='ui mini teal label'>"+ todo.status +"</div><br>")
      } else {
        $('#todo-list').append("Status : <div class='ui mini grey label'>"+ todo.status +"</div><br>")
      }
      let today = new Date
      let due = new Date(todo.due_date.toString())
      let difference = due - today
      let days = Math.round(difference/(1000*60*60*24));
      $('#todo-list').append(`${days} days left to due date<br>Due date : ${todo.due_date.toString().split("T")[0]} <br>`)
      $('#todo-list').append("Action : <label class='ui mini orange label' onclick='markDone\("+ id +")\'>mark as done<label>")
      $('#todo-list').append("<label class='ui mini red label' onclick='deleteTodo\("+ id +")\'>delete this<label>")
    })
    })
  .fail(function(jqXHR, textStatus) {
    console.log(jqXHR)
    console.log(textStatus)  
  })
}

function detailTodo(todoId){
  $.ajax( {
    method :'GET',
    url: `http://localhost:3000/todos/${todoId}`,
    headers : {
      id : localStorage.getItem('id'),
      token : localStorage.getItem('token'),
      email : localStorage.getItem('email')
    }
    })
    .done(response=>{
      $('#detail-title').text("View / Edit Details")
      let id = JSON.stringify(response._id)
      let date = response.due_date.toString().split("T")[0]
      $(".add-form").transition('hide')
      $(".edit-form").transition('show')
      if(response.status == "completed"){
        $('#detail-name').html(`<h5>Title</h5><input type='text' value='${response.name}' name='upd-name' id="upd-name"><br><h5>Status</h5><div class="ui teal label">${response.status}</div>`)
      } else {
        $('#detail-name').html(`<h5>Title</h5><input type='text' value='${response.name}' name='upd-name'><br><h5>Status</h5><div class="ui grey label">${response.status}</div>`)
      }
      $('#detail-description').html(`<br><h5>Description</h5><textarea id="upd-description" type='text'name='upd-description'>${response.description}</textarea>`)
      $('#detail-due_date').html(`<br><h5>Due Date</h5><input type='date' value='${date}' id="upd-due_date" name='upd-due_date'>`)
      $('#detail-action').html("<br>Action : <label class='ui mini orange label' onclick='markDone\("+ id +")\'>mark as done</label><label class='ui mini red label' onclick='deleteTodo\("+ id +")\'>delete this</label><div class='ui divider'></div>")
      $('#detail-action').append("<button class='ui large grey button' onclick='changeToAdd()'>I want to Add new Todos</button>")
      $('#detail-action').append("<button class='ui large teal button' type='submit' onclick='updateMyData\("+ id +")\'>Update Data Above</button>")
    })
    .fail(err=>{
      console.log("error find one", err)
      location.reload()
    })
}

function updateMyData(todoId){
  console.log(todoId)
  let upd = {
      name : $("#upd-name").val(),
      description : $("#upd-description").val(),
      due_date : $("#upd-due_date").val()
  }
  setTimeout(function(){
    $.ajax( {
      method :'PUT',
      url: `http://localhost:3000/todos/${todoId}`,
      headers : {
        id : localStorage.getItem('id'),
        token : localStorage.getItem('token'),
        email : localStorage.getItem('email')
      },
      data : {
        upd
      }
      })
    .done(function(response) {
        if(response == "success"){
          location.reload()
        } else {
          location.reload()
        }
      })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR)
      console.log(textStatus)  
    })
  }, 2000)
    
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
      } else {
        location.reload()
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
    $('#quote-content').html(`${str} <br> - ${JSON.stringify(response.contents.quotes[0].author)}<br>`)
    })
  .fail(function(jqXHR, textStatus) {
    $('#quote-content').text(`"do not give up" - unknown`)
    })
}


function changeToAdd(){
  if(localStorage.getItem('token')) {
    $(".login-false").transition('hide')
    $(".login-true").transition('show')
    $(".edit-form").transition('hide')
    $(".add-form").transition('show')
  } else {
    $(".login-true").transition('hide')
    $(".edit-form").transition('hide')
  }
}


function checkLogin(){
  if(localStorage.getItem('token')) {
    $(".login-false").transition('hide')
    $(".login-true").transition('show')
    $(".edit-form").transition('hide')
  } else {
    $(".login-true").transition('hide')
    $(".edit-form").transition('hide')
    $(".login-false").transition('show')
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
      localStorage.setItem('email', response.email)
      localStorage.setItem('token', response.token)
      checkLogin()
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
        checkLogin()
    }
  });
}