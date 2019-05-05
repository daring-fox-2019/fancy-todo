var serverURL = 'http://localhost:3000'
var currentUser = {
    _id: null,
    email: '',
    name: '',
}

var projectList = [], todoList = []

var loginState = function(value) {
    if(value) {
        $('#dashboard').show()
        $('#landing').hide()
        $('#registerForm').hide()
    }
    else {
        $('#registerForm').hide()
        $('#landing').show()
        $('#dashboard').hide()
    }
}

function dateFormat(date) {
    return moment(new Date(date)).format('YYYY-MM-DD');
}

function showRegister() {
    $('#registerForm').show()
    $('#landing').hide()
    $('#dashboard').hide()
}
function showLanding() {
    $('#registerForm').hide()
    $('#landing').show()
    $('#dashboard').hide()
}

function showProjectsHome() {
    $('#content-title').html('Projects');
    fetchProjects();
}

function generateProjectsList() {
    if(projectList && projectList.length > 0) {
        $('#content-list').html('')
        projectList.forEach( project => {
            let template = 
            `<div class="collection-item">
                <div class="project-item-content">
                    <a href="#" class="item-title" onclick="showProjectDetail()"><span>${project.name}</span></a>
                    <span class="grey-text item-description">${project.description}</span>
                    <a href="#" style="font-size: 0.8em;" onclick="showProjectDetail()">>More Details</a>
                </div>
                <div>
                <a href="#" class="btn blue darken-2" onclick="editProject()"><i class="material-icons">edit</i></a>
                <a href="#" class="btn" style="background: red;" onclick="deleteProject()"><i class="material-icons">delete</i></a>
                </div>
            </div>
            `

            $('#content-list').append(template)
        })
    }
    else {
        $('#content-list').html(`<h6>You currently don't have any project</h6>`)
    }
}

function showTodosHome() {
    $('#content-title').html('Todos');
    fetchTodos();
    generateTodosList();
}

function generateTodosList() {
    if(todoList && todoList.length > 0) {
        $('#content-list').html('')
        todoList.forEach( todo => {
            let template = 
            `<div class="collection-item">
                <div class="project-item-content">
                    <a href="#" class="item-title" onclick="showProjectDetail()"><span>${todo.title}</span></a>
                    <span class="grey-text item-description">${todo.description}</span>
                    <span class="grey-text due-date">Due Date: &nbsp;${dateFormat(todo.dueDate)}</span>
                </div>
                <div>
                <a href="#" class="btn blue darken-2" onclick="editTodo()"><i class="material-icons">edit</i></a>
                <a href="#" class="btn" style="background: red;" onclick="deleteTodo()"><i class="material-icons">delete</i></a>
                </div>
            </div>
            `

            $('#content-list').append(template)
        })
    }
    else {
        $('#content-list').html(`<h6>You currently don't have any todo</h6>`)
    }
}

function logout() {
    console.log('User signed out.');
    localStorage.removeItem('todo_token');
    isLogin()
}

function isLogin() {
    if(localStorage.getItem('todo_token')) {
        //init current user data
        setUserData(
            {
                _id: localStorage.getItem('todo_id'),
                email: localStorage.getItem('todo_email'),
                token: localStorage.getItem('todo_token'),
                name: localStorage.getItem('todo_name'),
            }
        )

        loginState(true)
    }
    else {
        loginState(false)
    }
}

function setUserData(data) {
    currentUser = {
        _id: data._id,
        email: data.email,
        name: data.name
    }

    $('#profileName').html(currentUser.name);
}

function fetchProjects() {
    $.ajax({
        method: 'GET',
        url: serverURL + '/projects',
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        projectList = [...data]
        generateProjectsList();
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

function fetchTodos() {
    $.ajax({
        method: 'GET',
        url: serverURL + '/todos',
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        todoList = [...data]
        generateTodosList();
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

$(document).ready(function(){
    $('.modal').modal();
    $('.fixed-action-btn').floatingActionButton();
    //check if there is valid token, if it is, show dashboard
    projectList = []
    todoList = []
    isLogin()
    showProjectsHome()
})

$('#registerBtn').click(function() {
    showRegister();
})

$('#loginBtn').click(function() {
    login();
})

function register() {
    event.preventDefault();

    $.ajax({
        method: 'POST',
        url: serverURL + '/auth/register',
        data: {
            email: $('#register-email').val().trim(),
            password: $('#register-password').val().trim(),
            name: $('#register-name').val().trim(),
        }
    })
    .done(function(data) {
        swal("Welcome, "+currentUser.name, "You have registered succesfully!", "success");
        showLanding();
    })
    .catch(function(err) {
        swal("Error", err.message, "error");
    })
}

function login() {
    event.preventDefault();

    $.ajax({
        method: 'POST',
        url: serverURL + '/auth/login',
        data: {
            email: $('#login-email').val().trim(),
            password: $('#login-password').val().trim(),
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
        isLogin();
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: 'POST',
        url: serverURL + '/auth/google',
        data: {
            token: localStorage.getItem('todo_token')
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

        isLogin();
    })
    .catch(function(err) {
        swal("Error", err.message, "error");
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        localStorage.removeItem('todo_token');
        localStorage.removeItem('todo_id');
        localStorage.removeItem('todo_email');
        localStorage.removeItem('todo_name');

        isLogin()
    });
}
