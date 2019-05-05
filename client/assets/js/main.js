const baseURL = 'http://localhost:3000';
let editId = '';
const googleUser = {};

$(document).ready(function() {
  // Materialize
  $('.tabs').tabs();
  
  $('.datepicker').datepicker({
    format: 'mm-dd-yyyy',
  });

  $('.modal').modal();
  // end
  startApp();

  checkLogin();  

  $('#go-register').click(function() {
    goRegister();
  });

  $('#go-login').click(function() {
    goLogin();
  })

  $('#register-button').click(function (event) {
    userRegister(event);
  })

  $('#login-button').click(function(event) {
    userLogin(event);
  })

  $("#signout").click(function() {
    signOut();
  });

  $('#add-todo-button').click(function() {
    createTodo();
  })

});

$(document).on('click', ".done-todo", function() {
  event.preventDefault();

  const id = $(this).attr('name');

  $.ajax({
    method: 'PUT',
    url: `${baseURL}/todos/${id}`,
    data: {
      status: true,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })
    .done((response) => {
      // $(this).closest('tr').children('.todo-name').css('text-decoration', 'line-through');
      getHome();
    })

})

$(document).on('click', ".edit-todo", function() {
  editId = $(this).attr('name');
  console.log(editId);
})

$(document).on('click', "#todo-edit-button", function() {
  event.preventDefault();
  console.log('heh');
  // const id = $(this).attr('name');
  console.log(editId);

  const name = $('input[name=todo-edit-name]').val();
  const description = $('input[name=todo-edit-desc').val();
  const date = $('input[name=todo-edit-date]').val();
  const status = $('[name=todo-edit-status]')[0].checked;

  $.ajax({
    method: 'PUT',
    url: `${baseURL}/todos/${editId}`,
    data: {
      name,
      description,
      date,
      status,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })
    .done((response) => {
      getHome();
    })
    .fail((jqXHR, text) => {
      console.log(text, jqXHR);
    })

})

$(document).on('click', ".delete-todo", function() {
  const id = $(this).attr('name');

  $.ajax({
    method: 'DELETE',
    url: `${baseURL}/todos/${id}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })
    .done((response) => {
      console.log(response);
      $(this).closest('tr').remove();
    })
    .fail((jqXHR, text) => {
      console.log(text, jqXHR);
    });
});


function goRegister() {
  $('#login').hide();
  $('#register').show();
};

function goLogin() {
  $('#register').hide();
  $('#login').show();
};

function userRegister(event) {
  event.preventDefault();
  const username = $('input[name=username-register]').val();
  const email = $('input[name=email-register]').val();
  const password = $('input[name=password-register').val();

  $.ajax({
    method: 'POST',
    url: `${baseURL}/register`,
    data: {
      username,
      email,
      password,
    },
  })
    .done((response) => {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('userId', response.userId);
      checkLogin();
      getHome();
    })
    .fail((jqXHR, text) => {
      console.log(text);
    });
};

function userLogin(event) {
  event.preventDefault();

  const email = $('input[name=email-login').val();
  const password = $('input[name=password-login]').val();

  $.ajax({
    method: 'POST',
    url: `${baseURL}/login`,
    data: {
      email,
      password,
      type: 'regular',
    },
  })
    .done((response) => {
      console.log(response);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('userId', response.userId);
      checkLogin();
      getHome();
    })
    .fail((jqXHR, text) => {
      console.log(text);
    })
};

function startApp() {
  gapi.load("auth2", function() {
    auth2 = gapi.auth2.init({
      client_id:
        "1028457723804-5411pjuhcivj92hh4km6nkrgkhk4aaej.apps.googleusercontent.com",
      cookiepolicy: "single_host_origin"
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    attachSignin(document.getElementById("customBtn"));
  });
};

function attachSignin(element) {
  auth2.attachClickHandler(
    element,
    {},
    function(googleUser) {
      const { id_token } = googleUser.getAuthResponse();

      $.ajax({
        method: "POST",
        url: "http://localhost:3000/login",
        data: {
          id_token,
          type: "google"
        }
      })
        .done(response => {
          console.log(response);
          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("userId", response.userId);
          checkLogin();
        })
        .fail((jqXHR, textStatus) => {
          console.log(textStatus);
        });
    },
    function(error) {
      console.log(error);
    }
  );
};

function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut()
    .then( () => {
      console.log('User signed out.');
      localStorage.clear();
      $('#entry').show();
      checkLogin();
    });
};

function checkLogin() {
  if(!localStorage.getItem('accessToken')) {
    $('#main-container').hide();
    $('#register').hide();
    $('#signout').hide();
    $('#username').hide();
    $('#login').show();
  } else {
    $('#main-container').show();
    $('#signout').show();
    $('#username').show();
    $('#entry').hide();
    getHome();
  };
};

/* ===================================== MAIN SECTION =====================================  */

function getHome() {
  $.ajax({
    method: 'GET',
    url: `${baseURL}/home`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    }
  })
    .done((response) => {
      const user = {...response.user};
      $('#username').text(`${user.username}`);
      console.log(user);
      displayTodo(user.todos);
    })
    .fail((jqXHR, text) => {
      console.log(text);
    })

}

function createTodo() {
  event.preventDefault();

  const name = $('input[name=todo-name]').val();
  const description = $('input[name=todo-desc').val();
  const date = $('input[name=todo-date]').val();
  console.log(date);

  $.ajax({
    method: 'POST',
    url: `${baseURL}/todos`,
    data: {
      name,
      description,
      date,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })
    .done((response) => {
      const { todo } = response;

      // displayTodo([todo])

      $('#todo-table').append(`
      <tr>
      <td>${String(todo._id).slice(-3)}</td>
      <td>${todo.name}</td>
      <td>${todo.description}</td>
      <td>${moment(todo.date).format('ll')}</td>
      <td>${todo.status ? 'Done' : 'Undone'}</td>
      <td> 
          <button name="${todo._id}" class=" done-todo btn-small btn-flat"><i class="material-icons">
          done</i></button>
          <button name="${todo._id}" data-target="edit-todo-modal" class="modal-trigger edit-todo btn-small btn-flat"><i class="material-icons">
          edit</i></button>
          <button name="${todo._id}" class=" delete-todo btn-small btn-flat"><i class="material-icons">
          delete_forever</i></button>
        </td>
   </tr>
      `)
    })
    .fail((jqXHR, text) => {
      console.log(text, jqXHR);
    });
}

function displayTodo(todos) {
  let template = [];
  $('#todo-table').empty();
  todos.forEach((todo) => {
    template.push(`
      <tr>
        <td>${String(todo._id).slice(-3)}</td>
        <td>${todo.status ? `<del>${todo.name}</del>` : todo.name }</td>
        <td>${todo.description}</td>
        <td>${todo.status ? `<del>${moment(todo.date).format('ll')}</del>` : todo.name }</td>
        <td>${todo.status ? 'Done' : 'Undone'}</td>
        <td> 
          <button name="${todo._id}" class=" done-todo btn-small btn-flat"><i class="material-icons">
          done</i></button>
          <button name="${todo._id}" data-target="edit-todo-modal" class="modal-trigger edit-todo btn-small btn-flat"><i class="material-icons">
          edit</i></button>
          <button name="${todo._id}" class=" delete-todo btn-small btn-flat"><i class="material-icons">
          delete_forever</i></button>
        </td>
      </tr>
    `);
  });
  $('#todo-table').html(template.join(''));
}
