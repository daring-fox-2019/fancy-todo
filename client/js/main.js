var serverURL = 'http://localhost:3000'
var currentUser = {
    _id: null,
    email: '',
    name: '',
}

var todo = {}, todo_id = null
var projectList = [], todoList = []
var currentProject = {}, project = {}
var users = []

var loginState = function(value) {
    if(value) {
        $('#dashboard').show()
        showProjectsHome()
        $('#landing').hide()
        $('#registerForm').hide()
        $('#project-detail-page').hide()
    }
    else {
        $('#registerForm').hide()
        $('#landing').show()
        $('#dashboard').hide()
        $('#project-detail-page').hide()
    }
}

function dateFormat(date) {
    return moment(new Date(date)).format('YYYY-MM-DD');
}

function showRegister() {
    $('#registerForm').show()
    $('#landing').hide()
    $('#dashboard').hide()
    $('#project-detail-page').hide()
}
function showLanding() {
    $('#registerForm').hide()
    $('#landing').show()
    $('#dashboard').hide()
    $('#project-detail-page').hide()
}

function showProjectsHome() {
    $('#content-page').show()
    $('#project-detail-page').hide()
    $('#content-title').html('Projects');
    fetchProjects();
}

function showProjectDetailPage() {
    $('#content-page').hide()
    $('#project-detail-page').show()
}

function generateProjectsList() {
    $('#content-list').html('')
    if(projectList && projectList.length > 0) {
        projectList.forEach( project => {
            let template = 
            `<div class="collection-item">
                <div class="project-item-content">
                    <a href="#" class="item-title" data-id="${project._id}" onclick="showProjectDetail(this)"><span>${project.name}</span></a>
                    <span class="grey-text item-description">${project.description}</span>
                    <a href="#" style="font-size: 0.8em;" data-id="${project._id}" onclick="showProjectDetail(this)">>More Details</a>
                </div>
                <div>
                <a href="#" class="btn blue darken-2 modal-trigger" data-id="${project._id}" data-target="editProjectModal" onclick="editProject(this)"><i class="material-icons">edit</i></a>
                <a href="#" class="btn" style="background: red;" data-id="${project._id}" onclick="deleteProject(this)"><i class="material-icons">delete</i></a>
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

function showProjectDetail(elem) {
    let project_id;

    if(!elem.dataset) {
        project_id = elem
    }
    else {
        project_id = elem.dataset.id
    }

    $.ajax({
        method: 'GET',
        url: serverURL + '/projects/' + project_id,
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        currentProject = data[0]
        $('#project-detail-page').html('')
        let todosTemplate ='', membersTemplate =''

        currentProject.todos.forEach(todo => {
            let statusClass, status = todo.status.toUpperCase();

            switch(status) {
                case 'IN PROGRESS':
                    statusClass = 'orange-text'
                    break;
                case 'COMPLETED':
                    statusClass = 'green-text'
                    break;
                case 'OPEN':
                default:
                    statusClass = 'red-text'
                    break;
            }

            todosTemplate += 
            `<div class='flex-column'>
                <h4>${todo.title}</h4>
                <div class="project-item-content">
                    <div class="description">${todo.description}</div>
                    <span class="grey-text">Status: <em class="`+ statusClass +`">${todo.status.toUpperCase()}</em></span>
                    <span class="grey-text">Due Date: ${dateFormat(todo.dueDate)}</span>
                </div>
                <div>
                    <a href="#"><i class="material-icons modal-trigger" data-projectid="${currentProject._id}" data-todoid="${todo._id}" data-target="editTodoModal" onclick="editTodo(this)">edit</i></a>
                    <a href="#" style="color: red;"><i class="material-icons" data-projectid="${currentProject._id}" data-todoid="${todo._id}" onclick="deleteTodo(this)">delete</i></a>
                </div>
            </div>
            `
        })

        currentProject.members.forEach(member => {
            membersTemplate += 
            `<div style="display: flex; justify-content: space-between;">
                <div class='flex-column'>
                    <span class="small-text teal-text" >${member.name} (${member.email})</span>
                </div>
                <div class='flex-column'>
                    <a href="#" style="color: red;" data-id="${member._id}" onclick="removeMember(this)"><i class="material-icons">delete_forever</i></a>
                </div>
            </div>
            `
        })

        let template = 
        `<h3 class="nomarginpadding project-detail-title">${currentProject.name}</h3>
        <div>
            <div class='row'>
                <div class='col flex-column s12 m4 l4'>
                    <div style="min-height: 70px;">${currentProject.description}</div>
                    <div class="grey-text" style="font-size: 0.8em;">created by ${currentProject.owner.name}</div>
                    <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                        <span>Members</span>
                        <a class="waves-effect waves-light btn modal-trigger" 
                            data-target="addMemberModal" onclick="initMembersAutoComplete()">Add Member</a>
                    </div>
                    <div class="member-list">
                    <hr>`+ 
                    membersTemplate 
                    + `</div>
                </div>
                <div class='flex-column s12 m8 l8 left-border'>
                    <div class="sectionTitle tooltipped" data-position="right" data-tooltip="Todo under this project">Todos</div>
                ` +
                    todosTemplate
                + `</div>
            </div>
        </div>
        `
        $('#project-detail-page').html(template)
        
        showProjectDetailPage()
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

function clearProjectForm() {
    $('#project-name').value = '';
    $('#project-description').value = '';
}

function createProject() {
    console.log(currentUser);
    $.ajax({
        method: 'POST',
        url: serverURL + '/projects',
        data: {
            name: $('#project-name').val(),
            description: $('#project-description').val(),
            owner: currentUser._id,
        },
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        fetchProjects();
        swal("Success", 'Project created successfully!', "success");
        clearProjectForm();
    })
    .catch(function(err) {
        clearProjectForm()
        swal("Error", err.responseText, "error");
    })
}

function deleteProject(element) {
    let project_id = element.dataset.id

    $.ajax({
        method: 'DELETE',
        url: serverURL + '/projects/' + project_id,
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        fetchProjects();
        swal("Success", 'Project deleted successfully!', "success");
        showProjectsHome();
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

function editProject(elem) {
    let project_id = elem.dataset.id

    $.ajax({
        method: 'GET',
        url: serverURL + '/projects/' + project_id,
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        project = data[0]

        //populate edit todo form
        $('#editproject-name').val(project.name),
        $('#editproject-description').val(project.description)
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

function submitEditProject() {
    let project_id = project._id
    project = {
        name: $('#editproject-name').val(),
        description: $('#editproject-description').val()
    }

    $.ajax({
        method: 'PATCH',
        url: serverURL + '/projects/' + project_id,
        data: project,
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        var editProjectModal = M.Modal.getInstance($('#editProjectModal'));
        editProjectModal.close();

        showProjectsHome();
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

// AutoComplete when Adding Members
function initMembersAutoComplete() {
    users = {}, newObj = {}
    console.log('autocomplete');
    $.ajax({
        method: 'GET',
        url: serverURL + '/users',
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        let kvp = {}
        users = data

        let acUsers = {}
        data.forEach(x => {
            kvp[`${x.name} (${x.email})`] = x._id
            acUsers = {...acUsers, ...kvp}
        })

        $('input.autocomplete').autocomplete({
            data: acUsers,
        });
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })

}

function addMember() {
    let userid, found
    let key = $('#autocomplete-input').val();
    let email = $('#autocomplete-input').val().split('(')[1]
    email = email.substring(0, email.indexOf(')'))

    found = users.find(x => x.email == email)
    userid = found._id

    if(userid)
    {
        $.ajax({
            method: 'POST',
            url: serverURL + '/projects/' + currentProject._id + '/addMember',
            data: {
                id: userid
            },
            headers: {
                token: localStorage.getItem('todo_token')
            }
        })
        .done(function(data) {
            swal("Success", 'User has been added to project', "success");
            var addMemberModal = M.Modal.getInstance($('#addMemberModal'));
            addMemberModal.close();

            $('#project-detail-page').hide()
            showProjectDetail(currentProject._id)
        })
        .catch(function(err) {
            swal("Error", err.responseText, "error");
        })
    }
    else {
        swal("Error", 'Invalid User', "error");
    }
}

function removeMember(elem) {
    $.ajax({
        method: 'POST',
        url: serverURL + '/projects/' + currentProject._id + '/removeMember',
        data: {
            id: elem.dataset.id
        },
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        swal("Success", 'User has been removed from project', "success");
        showProjectDetail(currentProject._id)
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

/******************* 
 * TODO area 
 * 
 * ******************/
function showTodosHome() {
    currentProject = null;
    $('#content-page').show()
    $('#project-detail-page').hide()
    $('#content-title').html('Todos');
    fetchTodos();
    generateTodosList();
}

function generateTodosList() {
    console.log(todoList);
    if(todoList && todoList.length > 0) {
        $('#content-list').html('')
        todoList.forEach( todo => {
            let statusClass, status =todo.status.toUpperCase()
            switch(status) {
                case 'IN PROGRESS':
                    statusClass = 'orange-text'
                    break;
                case 'COMPLETED':
                    statusClass = 'green-text'
                    break;
                case 'OPEN':
                default:
                    statusClass = 'red-text'
                    break;
            }

            let template = 
            `<div class="collection-item">
                <div class="project-item-content">
                    <a href="#" class="item-title" data-todoid="${todo._id}"><span>${todo.title}</span></a>
                    <span class="grey-text item-description">${todo.description}</span>
                    <span class="item-description `+ statusClass +`">${todo.status.toUpperCase()}</span>
                    <span class="grey-text due-date">Due Date: &nbsp;${dateFormat(todo.dueDate)}</span>
                </div>
                <div>
                <a href="#" class="btn blue darken-2 modal-trigger" data-todoid="${todo._id}" data-target="editTodoModal"  onclick="editTodo(this)"><i class="material-icons">edit</i></a>
                <a href="#" class="btn" style="background: red;" data-todoid="${todo._id}" onclick="deleteTodo(this)"><i class="material-icons">delete</i></a>
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

function createTodo() {
    let date = $('#todo-duedate')

    todo = {
        title: $('#todo-title').val(),
        description: $('#todo-description').val(),
        dueDate: $('#todo-duedate').val(),
        status: $('#todo-status').val()
    }

    let endpoint
    if(currentProject && currentProject._id) {
        endpoint = `/projects/${currentProject._id}/todos`
    }
    else {
        endpoint = `/todos`
    }

    $.ajax({
        method: 'POST',
        url: serverURL + endpoint,
        data: todo,
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        swal("Success", 'Todo created', "success");
        if(currentProject) {
            showProjectDetail(currentProject._id)
        }
        else {
            showTodosHome()
        }
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

function deleteTodo(elem) {
    let project_id = elem.dataset.projectid
    let todo_id = elem.dataset.todoid
    let endpoint

    if(project_id) {
        endpoint = '/projects/'+project_id+'/todos/' + todo_id
    }
    else {
        endpoint = '/todos/'+ todo_id
    }

    $.ajax({
        method: 'DELETE',
        url: serverURL + endpoint,
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        swal("Success", 'Todo deleted successfully', "success");
        if(currentProject) {
            showProjectDetail(currentProject._id)
        }
        else {
            showTodosHome()
        }
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

function editTodo(elem) {
    todo_id = elem.dataset.todoid

    $.ajax({
        method: 'GET',
        url: serverURL + '/todos/' + todo_id,
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        todo = data[0]
        delete todo._id
        let selectStatus = $('#edittodo-status')
        let selectedIndex = 0

        switch(todo.status.toUpperCase()) {
            case 'COMPLETED':
                selectedIndex = 3
                break;
            case 'IN PROGRESS':
                selectedIndex = 2
                break;
            case 'OPEN':
            default:
                selectedIndex = 1
                break;
        }

        //populate edit todo form
        $('#edittodo-title').val(todo.title),
        $('#edittodo-description').val(todo.description)
        $('#edittodo-duedate').val(dateFormat(todo.dueDate))
        selectStatus.selectedIndex = selectedIndex
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
}

function submitEditTodo() {
    let endpoint, project_id = currentProject._id
    endpoint = '/todos/'+ todo_id

    todo = {
        title: $('#edittodo-title').val(),
        description: $('#edittodo-description').val(),
        dueDate: $('#edittodo-duedate').val(),
        status: $('#edittodo-status').val()
    }
    
    $.ajax({
        method: 'PATCH',
        url: serverURL + endpoint,
        data: todo,
        headers: {
            token: localStorage.getItem('todo_token')
        }
    })
    .done(function(data) {
        swal("Success", 'Todo updated successfully', "success");
        if(currentProject) {
            showProjectDetail(currentProject._id)
        }
        else {
            showTodosHome()
        }
    })
    .catch(function(err) {
        swal("Error", err.responseText, "error");
    })
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
    $('.tooltipped').tooltip();
    $('.datepicker').datepicker({format: 'yyyy-mm-dd', autoClose: true});
    $('select').formSelect();

    $("select[required]").css({
        display: "inline",
        height: 0,
        padding: 0,
        width: 0
      });
      
    //check if there is valid token, if it is, show dashboard
    projectList = []
    todoList = []
    isLogin()
})

$('#registerBtn').click(function() {
    showRegister();
})

$('#loginBtn').click(function() {
    login();
})

/*******************
 * LOGIN area
 *******************/

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

    if(!localStorage.getItem('todo_token')) {
        $.ajax({
            method: 'POST',
            url: serverURL + '/auth/google',
            data: {
                token: id_token,
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
            swal("Error", err.message, "error");
        })
    }
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

