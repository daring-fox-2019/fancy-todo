const url = 'http://localhost:3000/';

$('#project-list-page').hide();

if (localStorage.getItem('accesstoken')) {
    $('#sign-in-form').hide();
    $('#mytodos').show();
    $('nav').show();
    $('#project-page').hide();
} else {
    $('#sign-in-form').show();
    $('#mytodos').hide();
    $('nav').hide();
    $('#project-page').hide();
}

$(document).ready(function () {
    if (localStorage.getItem('accesstoken')) {
        fetchMyTodos();
        fetchMyProjects();
    }

    $('#view-project-list').on('click', () => {
        $('#project-list-page').show();
        $('#mytodos').hide();
        $('#view-project-list').addClass('active')
        $('#project-page').hide();
    })

    $('#view-mytodos').on('click', () => {
        $('#project-list-page').hide();
        $('#mytodos').show();
        $('#view-project-list').removeClass('active')
        $('#project-page').hide();
    })

    $('#sign-up-form').hide();

    $('#sign-up-show').on('click', () => {
        $('#sign-in-form').fadeToggle(() => {
            $('#sign-up-form').fadeIn();
        })
    })

    $('#sign-in-show').on('click', () => {
        $('#sign-up-form').fadeToggle(() => {
            $('#sign-in-form').fadeIn();
        })
    })

    $('.check').on('click', event => {
        $(event.target).toggleClass('green')
        $(event.target).toggleClass('grey')

    })

    $('.menu .item').tab()

    $('#add-todo-button').on('click', () => {
        const today = new Date

        resetNewTodoForm()

        $('.ui.tiny.modal.todo').modal('show')
        $('#date_calendar').calendar({
            type: 'date',
            minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        });
    })

    $('#add-project-button').on('click', () => {
        resetNewTodoForm()
        $('#new-project-name').val('');
        $('.ui.tiny.modal.project').modal('show')
    })

    $('#view-members-button').on('click', () => {
        $('.ui.tiny.modal.members').modal('show')
    })

    $('#add-member-button').on('click', () => {
        $('.ui.tiny.modal.addmember').modal('show')
    })

});

function resetNewTodoForm() {
    $('#new-todo-name').val('');
    $('#new-todo-desc').val('');
    $('#date_calendar').calendar('clear')
}

function resetLoginForm() {
    $('#email-login').val('');
    $('#password-login').val('');
}

function register() {
    event.preventDefault();

    const name = $('#name-register').val();
    const email = $('#email-register').val();
    const password = $('#password-register').val();

    $
        .ajax({
            url: url + `users/register`,
            method: 'POST',
            data: {
                name, email, password
            }
        })
        .done(response => {
            $('#sign-up-form').fadeToggle(() => {
                $('#sign-in-form').fadeIn();
            })
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function login() {
    event.preventDefault();

    const email = $('#email-login').val();
    const password = $('#password-login').val();

    $
        .ajax({
            url: url + `users/login`,
            method: 'post',
            data: {
                email, password
            }
        })
        .done(response => {
            localStorage.setItem('accesstoken', response.accesstoken);

            postLogin();
            resetLoginForm();
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function onSignIn(googleUser) {
    event.preventDefault()
    const id_token = googleUser.getAuthResponse().id_token;

    $
        .ajax({
            url: url + 'users/google-login',
            method: 'post',
            data: {
                accesstoken: id_token
            }
        })
        .done((response) => {
            localStorage.setItem('accesstoken', response.accesstoken)

            postLogin();
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })

}

function logout() {
    const auth2 = gapi.auth2.getAuthInstance();
    if (auth2) {
        auth2
            .signOut()
            .then(function () {
                localStorage.clear()

                prelogin();
            })
            .catch(err => {
                localStorage.clear()
                console.log(err)
            })
    } else {
        localStorage.clear()
    }
}

function fetchMyTodos() {
    $('#mytodos-incomplete').empty();
    $('#mytodos-complete').empty();
    $('#mytodos-all').empty();
    $('#project-list').empty();

    $
        .ajax({
            url: url + 'todos/',
            method: 'GET',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            }
        })
        .done(todos => {
            console.log(todos)
            const options = { weekday: 'short', month: 'long', day: 'numeric' };

            let rawPro = ``;
            let rawAll = ``;
            let rawCom = ``;
            let rawIn = ``;

            todos.forEach(todo => {
                if (todo.status) {
                    rawCom += `
                    <div class="four wide column">
                    <div class="ui link card animated flipInX">
                    <div class="content">
                    <i class="right floated check large green icon" onclick="updateTodo('${todo._id}', ${!todo.status})"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodo('${todo._id}')">
                            <i class="trash icon"></i>
                        </span>

                        <span class="right floated clock outline">
                        <i class="clock_outline icon"></i>
                        Due date: ${new Date(todo.due_date).toLocaleDateString('en', options)}
                        </span>
                        </div>
                        </div>
                    </div>
                    `
                } else {
                    rawIn += `
                    <div class="four wide column">
                    <div class="ui link card animated flipInX">
                    <div class="content">
                    <i class="right floated check large grey icon" onclick="updateTodo('${todo._id}', ${!todo.status})"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodo('${todo._id}')">
                            <i class="trash icon"></i>
                        </span>

                        <span class="right floated clock outline">
                        <i class="clock_outline icon"></i>
                        Due date: ${new Date(todo.due_date).toLocaleDateString('en', options)}
                        </span>
                        </div>
                    </div>
                    </div>
                    `
                }
                rawAll += `
                <div class="four wide column">
                    <div class="ui link card animated flipInX">
                    <div class="content">
                    <i class="right floated check large ${todo.status ? "green" : "grey"} icon" onclick="updateTodo('${todo._id}', ${!todo.status})"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodo('${todo._id}')">
                            <i class="trash icon"></i>
                        </span>

                        <span class="right floated clock outline">
                        <i class="clock_outline icon"></i>
                        Due date: ${new Date(todo.due_date).toLocaleDateString('en', options)}
                        </span>
                        </div>
                    </div>
                </div>
                `
            })

            $('#mytodos-all').append(rawAll)
            $('#mytodos-incomplete').append(rawIn)
            $('#mytodos-complete').append(rawCom)
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function addTodo() {

    const name = $('#new-todo-name').val()
    const description = $('#new-todo-desc').val() || null
    const due_date = $('#new-todo-due-date').val() || null

    console.log(name, description, due_date)
    $
        .ajax({
            url: url + 'todos/',
            method: 'POST',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data: {
                name, description, due_date
            }
        })
        .done(response => {
            fetchMyTodos();
            fetchMyProjects();

        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function updateTodo(id, status) {
    event.preventDefault();

    $
        .ajax({
            url: url + `todos/${id}`,
            method: 'PATCH',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data: {
                status: status
            }
        })
        .done(response => {
            fetchMyTodos();
            fetchMyProjects();

        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function deleteTodo(id) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $
                    .ajax({
                        url: url + `todos/${id}`,
                        method: 'delete',
                        headers: {
                            accesstoken: localStorage.getItem('accesstoken')
                        }
                    })
                    .done(response => {
                        fetchMyTodos();
                        fetchMyProjects();

                        swal("Todo deleted!", {
                            icon: "success",
                        });
                    })
                    .fail((jqXHR, textstatus) => {
                        swal(jqXHR.responseJSON.message)
                    })
            }
        });
}

function prelogin() {
    $('#mytodos').hide();
    $('#project-list-page').hide();
    $('#project-page').hide();
    $('#sign-in-form').fadeIn();
    $('nav').hide();
}

function postLogin() {
    $('#project-page').hide();
    $('#mytodos').fadeIn();
    $('#sign-in-form').hide();
    $('nav').fadeIn();
}

function showProjectPage() {
    $('#mytodos').hide();
    $('#sign-in-form').hide();
    $('#project-page').fadeIn();
    $('#project-list-page').hide();
    $('#view-project-list').removeClass('active')
}

function fetchMyProjects() {
    $('#project-list').empty();

    $
        .ajax({
            url: url + 'projects/',
            method: 'GET',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            }
        })
        .done(projects => {
            console.log(projects)

            let raw = ``;

            projects.forEach(project => {
                raw += `
                <div class="four wide column">
                <div class="ui card piled segment animated jackInTheBox">
                  <div class="content">
                    <div class="header">
                      ${project.name}
                      <i class="right floated trash small grey icon" onclick="deleteProject('${project._id}')"></i>
                    </div>
                  </div>
                  <div class="content">
                    <h4 class="ui sub header">Detail</h4>
                    <div class="ui feed">
                      <div class="event">
                        <div class="content">
                          <div class="summary"><a>Master: </a>${project.master.name}</div>
                        </div>
                      </div>
                      <div class="event">
                        <div class="content">
                          <div class="summary"><a>Members: </a> ${project.members.length}</div>
                        </div>
                      </div>
                      <div class="event">
                        <div class="content">
                          <div class="summary"><a>Todos: </a>${project.todos.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="extra content">
                    <button class="ui button" onclick="projectPage('${project.id}')">Go to Project</button>
                  </div>
                </div>
              </div>
                `
            })

            $('#project-list').append(raw)
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function addNewProject() {
    event.preventDefault()

    const name = $('#new-project-name').val();

    $
        .ajax({
            url: url + 'projects/',
            method: 'POST',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data: {
                name
            }
        })
        .done(projects => {
            console.log(projects)
            fetchMyProjects();
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function deleteProject(id) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $
                    .ajax({
                        url: url + 'projects/' + id,
                        method: 'DELETE',
                        headers: {
                            accesstoken: localStorage.getItem('accesstoken')
                        }
                    })
                    .done(response => {
                        fetchMyProjects();
                        swal("Project deleted!", {
                            icon: "success",
                        });
                    })
                    .fail((jqXHR, textstatus) => {
                        swal(jqXHR.responseJSON.message)
                    })
            }
        });
}

function projectPage() {
    showProjectPage()
}