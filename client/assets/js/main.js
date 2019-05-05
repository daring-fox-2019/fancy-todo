const baseURL = "http://localhost:3000";
const googleUser = {};
let editId = "";
let projectId = "";

$(document).ready(function() {

  // Materialize
  $(".tabs").tabs();

  $(".datepicker").datepicker({
    format: "mm-dd-yyyy"
  });

  $(".modal").modal();
  // end
  startApp();

  checkLogin();

  if (
    $("#todo-tab")
      .children()
      .attr("class") === "active"
  ) {
    $("todo-tab")
    .children()
    .attr("class")
    $("#todo-project-form").hide();
    $("#project-page").hide();
  }

  $("#go-register").click(function() {
    goRegister();
  });

  $("#go-login").click(function() {
    goLogin();
  });

  $("#register-button").click(function(event) {
    userRegister(event);
  });

  $("#login-button").click(function(event) {
    userLogin(event);
  });

  $("#signout").click(function() {
    signOut();
  });

  $("#todo-tab").click(function() {
    goTodo();
  });

  $("#project-tab").click(function() {
    goProject();
  });

  $("#add-todo-button").click(function() {
    createTodo();
  });

  $("#add-project-button").click(function() {
    createProject();
  });

  $("#add-todo-project-button").click(function() {
    createProjectTodo();
  })
});

$(document).on("click", ".done-todo", function() {
  event.preventDefault();

  const id = $(this).attr("name");

  $.ajax({
    method: "PUT",
    url: `${baseURL}/todos/${id}`,
    data: {
      status: true
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  }).done(response => {
    // $(this).closest('tr').children('.todo-name').css('text-decoration', 'line-through');
    getHome();
  });
});

$(document).on("click", ".done-project-todo", function() {
  event.preventDefault();

  const id = $(this).attr("name");

  $.ajax({
    method: "PUT",
    url: `${baseURL}/users/project/${projectId}/todo/${id}`,
    data: {
      status: true
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  }).done(response => {
    // $(this).closest('tr').children('.todo-name').css('text-decoration', 'line-through');
    getHome();
  });
})

$(document).on("click", ".edit-todo", function() {
  editId = $(this).attr("name");
  console.log(editId);
});

$(document).on("click", "#todo-edit-button", function() {
  event.preventDefault();
  console.log("heh");
  // const id = $(this).attr('name');
  console.log(editId);

  const name = $("input[name=todo-edit-name]").val();
  const description = $("input[name=todo-edit-desc").val();
  const date = $("input[name=todo-edit-date]").val();
  const status = $("[name=todo-edit-status]")[0].checked;

  $.ajax({
    method: "PUT",
    url: `${baseURL}/todos/${editId}`,
    data: {
      name,
      description,
      date,
      status
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  })
    .done(response => {
      getHome();
    })
    .fail((jqXHR, text) => {
      console.log(text, jqXHR);
    });
});

$(document).on("click", ".delete-todo", function() {
  const id = $(this).attr("name");

  $.ajax({
    method: "DELETE",
    url: `${baseURL}/todos/${id}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  })
    .done(response => {
      console.log(response);
      $(this)
        .closest("tr")
        .remove();
        alertify.success("Deleted")
    })
    .fail((jqXHR, text) => {
      console.log(text, jqXHR);
    });
});

$(document).on("click", ".delete-todo-project", function() {
  const id = $(this).attr("name");

  $.ajax({
    method: 'DELETE',
    url: `${baseURL}/users/project/${projectId}/todo/${id}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })
    .done((response ) => {
      $(this)
      .closest("tr")
      .remove();
      alertify.success("Deleted")
    })
    .fail((jqXHR, text) => {
      console.log(text);
    })
});

$(document).on("click", ".delete-project", function() {
  const id = $(this).attr("name");

  $.ajax({
    method: 'DELETE',
    url: `${baseURL}/projects/${id}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })
    .done((response) => {
      console.log(response);
      $(this).closest('.card').remove();
      alertify.success("Deleted")
    })
    .fail((jqXHR, text) => {
      console.log(text, jqXHR);
    });
});

$(document).on("click", ".add-member", function() {
  
  event.preventDefault();

  const id = $(this).attr("name");
  projectId = id;

  console.log(id);
});

$(document).on("click", "#add-member-button", function() {
  const email = $('input[name=project-member-email]').val();

  $.ajax({
    method: 'PATCH',
    url: `${baseURL}/users/project/${projectId}/member`,
    data: {
      email,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })  
    .done((response) => {
      alertify.success('Added')
      getHome();
    })
    .fail((jqXHR, text) => {
      console.log(text, jqXHR);
    });
});

$(document).on("click", ".view-project", function() {
  $("#project-list").hide();
  $("#project-page").show();
  const id = $(this).attr("name");
  $.ajax({
    method: 'GET',
    url: `${baseURL}/users/project/${id}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })
    .done((response) => {
      $("#member-list").empty();
      const project = {...response.project};
      projectId = project._id;
      project.members.forEach((member) => {
        $("#member-list").append(`
        <span style="margin: 0 3px;">${member.username}</span>
        `)
      })
      displayTodo(project.todos);
    })
    .fail((jqXHR, text) => {
      console.log(text);
    })
});

function goRegister() {
  $("#login").hide();
  $("#register").show();
}

function goLogin() {
  $("#register").hide();
  $("#login").show();
}

function goProject() {
  $("#todo-form").hide();
  $("#todo-project-form").show();
  $("#project-list").show();
  $("#project-page").hide();
}

function goTodo() {
  $("#todo-project-form").hide();
  $("#todo-form").show();
  $("#project-page").hide();
}

function userRegister(event) {
  event.preventDefault();
  const username = $("input[name=username-register]").val();
  const email = $("input[name=email-register]").val();
  const password = $("input[name=password-register").val();

  $.ajax({
    method: "POST",
    url: `${baseURL}/register`,
    data: {
      username,
      email,
      password
    }
  })
    .done(response => {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("userId", response.userId);
      checkLogin();
      getHome();
    })
    .fail((jqXHR, text) => {
      console.log(text);
    });
}

function userLogin(event) {
  event.preventDefault();

  const email = $("input[name=email-login").val();
  const password = $("input[name=password-login]").val();

  $.ajax({
    method: "POST",
    url: `${baseURL}/login`,
    data: {
      email,
      password,
      type: "regular"
    }
  })
    .done(response => {
      console.log(response);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("userId", response.userId);
      checkLogin();
      alertify.success('Welcome')
      getHome();
    })
    .fail((jqXHR, text) => {
      console.log(text);
    });
}

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
}

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
          alertify.success('Welcome')
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
}

function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    console.log("User signed out.");
    localStorage.clear();
    $("#entry").show();
    checkLogin();
    alertify.success('Bye')
  });
}

function checkLogin() {
  if (!localStorage.getItem("accessToken")) {
    $("#main-container").hide();
    $("#register").hide();
    $("#signout").hide();
    $("#username").hide();
    $("#login").show();
  } else {
    $("#main-container").show();
    $("#signout").show();
    $("#username").show();
    $("#entry").hide();
    getHome();
  }
}

/* ===================================== MAIN SECTION =====================================  */

/* Todos */

function getHome() {
  $.ajax({
    method: "GET",
    url: `${baseURL}/home`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  })
    .done(response => {
      const user = { ...response.user };
      $("#username").text(`${user.username}`);
      console.log(user);
      displayTodo(user.todos);
      displayProject(user.projects);
    })
    .fail((jqXHR, text) => {
      console.log(text);
    });
}

function createTodo() {
  event.preventDefault();

  const name = $("input[name=todo-name]").val();
  const description = $("input[name=todo-desc").val();
  const date = $("input[name=todo-date]").val();
  console.log(date);

  $.ajax({
    method: "POST",
    url: `${baseURL}/todos`,
    data: {
      name,
      description,
      date
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  })
    .done(response => {
      const { todo } = response;

      // displayTodo([todo])

      $("#todo-table").append(`
      <tr>
      <td>${String(todo._id).slice(-3)}</td>
      <td>${todo.name}</td>
      <td>${todo.description}</td>
      <td>${moment(todo.date).format("ll")}</td>
      <td>${todo.status ? "Done" : "Undone"}</td>
      <td> 
          <button name="${
            todo._id
          }" class=" done-todo btn-small btn-flat"><i class="material-icons">
          done</i></button>
          <button name="${
            todo._id
          }" data-target="edit-todo-modal" class="modal-trigger edit-todo btn-small btn-flat"><i class="material-icons">
          edit</i></button>
          <button name="${
            todo._id
          }" class=" delete-todo btn-small btn-flat"><i class="material-icons">
          delete_forever</i></button>
        </td>
   </tr>
      `);
    })
    .fail((jqXHR, text) => {
      console.log(text, jqXHR);
    });
}

function displayTodo(todos) {
  let template = [];

  if (
    $("#todo-tab")
      .children()
      .attr("class") === "active"
  ) {
    $("#todo-table").empty();
  } else {
    $("#project-todo-table").empty();
  }
  
  $("#todo-table").empty();
  todos.forEach(todo => {
    template.push(`
      <tr>
        <td>${String(todo._id).slice(-3)}</td>
        <td>${todo.status ? `<del>${todo.name}</del>` : todo.name}</td>
        <td>${todo.description}</td>
        <td>${
          todo.status
            ? `<del>${moment(todo.date).format("ll")}</del>`
            : todo.name
        }</td>
        <td>${todo.status ? "Done" : "Undone"}</td>
        <td> 
          <button name="${
            todo._id
          }" class="  ${ $("#todo-tab")
          .children()
          .attr("class") === "active" ? 'done-todo' : 'done-project-todo'} btn-small btn-flat"><i class="material-icons">
          done</i></button>
          <button name="${
            todo._id
          }" data-target="edit-todo-modal" class="modal-trigger edit-todo btn-small btn-flat"><i class="material-icons">
          edit</i></button>
          <button name="${
            todo._id
          }" class=" ${ $("#todo-tab")
          .children()
          .attr("class") === "active" ? 'delete-todo' : 'delete-todo-project'} btn-small btn-flat"><i class="material-icons">
          delete_forever</i></button>
        </td>
      </tr>
    `);
  });

  if (
    $("#todo-tab")
      .children()
      .attr("class") === "active"
  ) {
    $("#todo-table").html(template.join(""));
  } else {
    $("#project-todo-table").html(template.join(""));
  }
 
}

/* End */

/* Projects */
function createProject() {
  event.preventDefault();

  const name = $("input[name=project-name]").val();
  const description = $("input[name=project-desc]").val();

  $.ajax({
    method: "POST",
    url: `${baseURL}/projects`,
    data: {
      name,
      description
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  })
    .done(response => {
      $('#project-list').append(`
      <div class="col" style="min-width:100%;">
      <div class="card  grey darken-4">
      <div class="card-content white-text">
        <span class="card-title left">Project: ${response.project.name}</span>
        <span name=${response.project._id} data-target="add-member-modal" class="modal-trigger add-member right">${response.project.ownerId === localStorage.getItem('userId') ? 'Add Member' : ''}</span>
        <div class="clearfix"></div>
        <p>Project Description: ${response.project.description}</p>
        <p>Members: ${response.project.members.length}</p>
    </div>
          <div class="card-action">
            <a name="${response.project._id}" class="view-project btn-small btn-flat grey darken-4 white-text left" >Go to Project</a>
            <a name="${response.project._id}" class="delete-project btn-small btn-flat grey darken-4 waves-effect waves-red white-text right">Delete project</a>
            <div class="clearfix"></div>
            </div>
          </div>
        </div>
      `)
    })
    .fail((jqXHR, text) => {
      console.log(text);
    });
};

function displayProject(projects) {
  let template = [];
  $("#project-list").empty();

  projects.forEach(project => {
    console.log(project)
    template.push(`
    <div class="col" style="min-width:100%;">
          <div class="card  grey darken-4">
            <div class="card-content white-text">
              <span class="card-title left">Project: ${project.name}</span>
              <span name=${project._id} data-target="add-member-modal" class="modal-trigger add-member right">${project.ownerId === localStorage.getItem('userId') ? 'Add Member' : ''}</span>
              <div class="clearfix"></div>
              <p>Project Description: ${project.description}</p>
              <p>Members: ${project.members.length}</p>
          </div>
          <div class="card-action">
            <a name="${project._id}" class="view-project btn-small btn-flat grey darken-4 white-text left" >Go to Project</a>
            <a name="${project._id}" class="delete-project btn-small btn-flat grey darken-4 waves-effect waves-red white-text right">${project.ownerId === localStorage.getItem('userId') ? 'Delete Project' : ''}</a>
            <div class="clearfix"></div>
            </div>
          </div>
        </div>
    `);
  });
  $('#project-list').append(template.join(''));
};

function createProjectTodo() {
  event.preventDefault();

  const name = $("input[name=todo-project-name]").val();
  const description = $("input[name=todo-project-desc").val();
  const date = $("input[name=todo-project-date]").val();

  $.ajax({
    method: "POST",
    url: `${baseURL}/users/project/${projectId}/todo`,
    data: {
      name,
      description,
      date
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
  })
    .done(response => {
      const { todo } = response;

      $("#project-todo-table").append(`
      <tr>
      <td>${String(todo._id).slice(-3)}</td>
      <td>${todo.name}</td>
      <td>${todo.description}</td>
      <td>${moment(todo.date).format("ll")}</td>
      <td>${todo.status ? "Done" : "Undone"}</td>
      <td> 
          <button name="${
            todo._id
          }" class=" done-project-todo btn-small btn-flat"><i class="material-icons">
          done</i></button>
          <button name="${
            todo._id
          }" data-target="edit-todo-modal" class="modal-trigger edit-todo btn-small btn-flat"><i class="material-icons">
          edit</i></button>
          <button name="${
            todo._id
          }" class=" delete-todo-project btn-small btn-flat"><i class="material-icons">
          delete_forever</i></button>
        </td>
   </tr>
`)
    })
    .fail((jqXHR, text) => {
      console.log(text, jqXHR);
    });
}

/* End */
