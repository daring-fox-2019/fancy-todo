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

        $('#todo-form').modal('show')
        
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
                token: id_token
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
                        <span class="left floated trash" onclick="editTodo('${todo._id}')">
                            <i class="edit icon"></i>
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

                        <span class="left floated trash" onclick="editTodo('${todo._id}')">
                            <i class="edit icon"></i>
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

                        <span class="left floated trash" onclick="editTodo('${todo._id}')">
                            <i class="edit icon"></i>
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

function editTodo(id) {
    $
        .ajax({
            url: url + `todos/${id}`,
            method: 'GET',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            }
        })
        .done(response => {
            $('#todo-form').modal('show')
            console.log(response)
            const today = new Date

            $('#new-todo-name').val(response.name);
            $('#new-todo-desc').val(response.description);
            $('#date_calendar').calendar({
                type: 'date',
                minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            })
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
    fetchMyProjects()
    $('#project-page').hide();
    $('#mytodos').fadeIn();
    $('#sign-in-form').hide();
    $('nav').fadeIn();

    $('#add-todo-button').on('click', () => {
        const today = new Date

        resetNewTodoForm()

        $('#todo-form').modal('show')
        $('#date_calendar').calendar({
            type: 'date',
            minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        });
    })

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
                    <button class="ui button" onclick="projectPage('${project._id}')">Go to Project</button>
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

function projectPage(id) {
    showProjectPage()

    $('#todos-incomplete-project').empty();
    $('#todos-complete-project').empty();
    $('#todos-all-project').empty();
    $('#project-todo-form').empty();
    $('#project-members').empty();
    $('#add-member-form').empty();

    console.log(id, 'projects iddddddd')

    $
        .ajax({
            url: url + `projects/${id}`,
            method: 'GET',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            }
        })
        .done(response => {
            $('#project-name').text(response.name)
            console.log(response)

            const options = { weekday: 'short', month: 'long', day: 'numeric' };

            let rawAll = ``;
            let rawCom = ``;
            let rawIn = ``;

            response.todos.forEach(todo => {
                if (todo.status) {
                    rawCom += `
                    <div class="four wide column">
                    <div class="ui link card animated flipInX">
                    <div class="content">
                    <i class="right floated check large green icon" onclick="updateTodoProject('${todo._id}', ${!todo.status}, '${id}')"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodoProject('${todo._id}', '${id}')">
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
                    <i class="right floated check large grey icon" onclick="updateTodoProject('${todo._id}', ${!todo.status}, '${id}')"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodoProject('${todo._id}', '${id}')">
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
                    <i class="right floated check large ${todo.status ? "green" : "grey"} icon" onclick="updateTodoProject('${todo._id}', ${!todo.status}, '${id}')"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodoProject('${todo._id}', '${id}')">
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

            let rawForm = `
            <div class="ui icon header">Add New Todo</div>
          <div class="content">
            <form class="ui form">
              <div class="field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  id="new-todo-name-project"
                />
              </div>
              <div class="field">
                <label>Description</label>
                <textarea
                  type="text"
                  name="last-name"
                  id="new-todo-desc-project"
                  rows="3"
                ></textarea>
              </div>
              <div class="field">
                <label>Due Date</label>
                <div class="ui calendar" id="project_date_calendar">
                  <div class="ui input left icon">
                    <i class="calendar icon"></i>
                    <input
                      type="text"
                      placeholder="Date"
                      id="new-todo-due-date-project"
                      readonly="readonly"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="actions">
            <div class="ui red cancel button">
              <i class="remove icon"></i>
              Cancel
            </div>
            <div class="ui green ok button" onclick="addTodoProject('${id}')">
              <i class="checkmark icon"></i>
              Create Todo
            </div>
          </div>
            ` 

            let rawMembers = `
            <tr class="center aligned">
                  <td>${response.master.name} (master)</td>
                </tr>
            `

            response.members.forEach(member => {
                rawMembers += `
                <tr class="center aligned">
                  <td>${member.name}</td>
                </tr>
                `
            })

            let rawMemberForm = `
            <div class="ui red cancel button">
              <i class="remove icon"></i>
              Cancel
            </div>
            <div class="ui blue ok button" onclick="addMember('${id}')">
              <i class="checkmark icon"></i>
              Add Member
            </div>
            `

            $('#todos-all-project').append(rawAll)
            $('#todos-incomplete-project').append(rawIn)
            $('#todos-complete-project').append(rawCom)
            $('#project-members').append(rawMembers);
            $('#add-member-form').append(rawMemberForm);
            $('#project-todo-form').append(rawForm);

            $('#add-member-button').on('click', () => {
                $('.ui.tiny.modal.addmember').modal('show')
            })

            $('#add-todo-project-button').on('click', () => {
                const today = new Date
        
                resetNewTodoForm()
        
                $('#project-todo-form').modal('show')
                $('#project_date_calendar').calendar({
                    type: 'date',
                    minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
                });
            })
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function addTodoProject(id) {

    const name = $('#new-todo-name-project').val()
    const description = $('#new-todo-desc-project').val() || null
    const due_date = $('#new-todo-due-date-project').val() || null

    console.log(name, description, due_date)
    $
        .ajax({
            url: url + `projects/${id}/add-todo`,
            method: 'PUT',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data: {
                name, description, due_date
            }
        })
        .done(response => {
            projectPage(id);
            fetchMyProjects();
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function updateTodoProject(todoId, status, projectId) {
    event.preventDefault();

    $
        .ajax({
            url: url + `projects/${projectId}/${todoId}`,
            method: 'PATCH',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data: {
                status: status
            }
        })
        .done(response => {
            projectPage(projectId);
            fetchMyProjects();
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function deleteTodoProject(todoId, projectId) {
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
                        url: url + `projects/${projectId}/${todoId}`,
                        method: 'DELETE',
                        headers: {
                            accesstoken: localStorage.getItem('accesstoken')
                        }
                    })
                    .done(response => {
                        projectPage(projectId);
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

function addMember(projectId) {
    const newMemberEmail = $('#newMember').val();
    console.log(projectId)
    $
        .ajax({
            url: url + `projects/${projectId}/add-member`,
            method: 'PUT',
            data: {
                email: newMemberEmail
            },
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            }
        })
        .done(response => {
            console.log(response)

            projectPage(projectId);
            fetchMyProjects();
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}