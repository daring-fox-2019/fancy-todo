const BASE_URL = "http://localhost:3000";

function beforeLogin() {
  localStorage.clear();
  sessionStorage.clear();

  $("#form-login").submit(login);
  $("#form-register").submit(register);

  $("#table-todos").text("");
  $("#welcome-alert-message").text("");

  $("#after-login").hide();
  $("#before-login").show();

  $("#welcome-alert").show();
  $("body").css("background-image", "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('./resources/img/homepage-background.jpg')");

  $("#project-name").text("");
  $("#project-creator").text("");
  $("#member-list-container").hide();
}

function afterLogin() {
  $("#form-login").modal("hide").unbind("submit");
  $("#form-register").modal("hide").unbind("submit");
  
  $("#after-login").show();
  $("#before-login").hide();

  $("#welcome-alert").hide();
  $("body").css("background-image", "none");

  generateQuote();
  showTodos();
  showProjects();
  showMembers();
  getUserList();
}

$(document).ready(function () {
  console.log("ready!");

  if (localStorage.token === undefined) {
    beforeLogin();
  } else {
    afterLogin();
  }

  $("#form-signout").submit(logout);
  $("#add-todo-due-date").datepicker();

  // ==================================
  // ADD TODO, PROJECT, MEMBER
  // ==================================
  $("#add-todo-button").click(function () {
    $("#form-add-todo").css("display", "block");
    $("#add-todo-button").css("display", "none");
  });
  $("#add-todo-button-cancel").click(function () {
    $("#form-add-todo").css("display", "none");
    $("#add-todo-button").css("display", "block");
  });
  $("#form-add-todo").submit(addTodo);

  $("#add-project-button").click(function () {
    $("#form-add-project").css("display", "block");
    $("#add-project-button").css("display", "none");
  });
  $("#add-project-button-cancel").click(function () {
    $("#form-add-project").css("display", "none");
    $("#add-project-button").css("display", "block");
  });
  $("#form-add-project").submit(addProject);

  $("#add-member-button").click(function () {
    $("#form-add-member").css("display", "block");
    $("#add-member-button").css("display", "none");
  });
  $("#add-member-button-cancel").click(function () {
    $("#form-add-member").css("display", "none");
    $("#add-member-button").css("display", "block");
  });
  $("#form-add-member").submit(addMember);

});
