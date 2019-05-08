$(document).ready(function () {
    $('.signout').hide()
    $('.register-form').hide()
    $('.myTodos').hide()
    $('#agenda').hide()
    $('.addTodo').hide()
    $('.editTodo').hide()
    $('.myProjects').hide()
    $('.addProject').hide()
    $('.editProject').hide()
    if (localStorage.jwtoken) {
        showMyTodos()
        $('.signout').show()
        $('.loginstd').hide()
        $('.register-btn').hide()
        $('.register-form').hide()
        $('.g-signin2').hide()
        $('#agenda').show()
    }
})


// const url = "http://localhost:4500"
const url = process.env.SERVER_URL

function logIn() {
    $.ajax({
            method: "POST",
            url: url + "/login",
            data: {
                email: $('#loginemail').val(),
                password: $('#loginpassword').val()
            }
        })
        .done(function (jwtoken) {
            console.log('you have successfully logged in ')
            localStorage.setItem('jwtoken', jwtoken)
            $('#loginemail').val(null)
            $('#loginpassword').val(null)
            $('.g-signin2').hide()
            $('.loginstd').hide()
            $('.register-btn').hide()
            $('.signout').show()
            $('#agenda').show()
            showMyTodos()
            Swal.fire({
                type: 'success',
                title: 'Success',
                text: 'You have successfully logged in!'
            })
            // my
        })
        .fail(function (err) {
            console.log(`Error ni : ${JSON.stringify(err)}`)
            Swal.fire({
                type: 'error',
                title: 'Error',
                text: 'Please check your input!'
            })
        })
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    let id_token = googleUser.getAuthResponse().id_token
    $.ajax({
            method: "POST",
            url: url + "/login",
            headers: {
                profile: profile,
                id_token: id_token
            }
        })
        .done(function (jwtoken) {
            localStorage.setItem('jwtoken', jwtoken)
            $('.signout').show()
            $('.g-signin2').hide()
            $('.loginstd').hide()
            $('.register-btn').hide()
            $('.register-form').hide()
            $('#agenda').show()

            showMyTodos()

        })
        .fail(function (err) {
            console.log(`Error ni : ${JSON.stringify(err)}`)
        })

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $('.g-signin2').show()
        $('.loginstd').show()
        $('.register-btn').show()
        $('.signout').hide()
        $('.myTodos').hide()
        $('#agenda').hide()
        $('.myTodos').hide()
        $('.addTodo').hide()
        $('.editTodo').hide()
        $('.myProjects').hide()
        $('.addProject').hide()
        $('.editProject').hide()
        $('.myTodos').empty()
        localStorage.clear()
    });
}

function registerbtn() {
    $('.register-form').show()
    $('.register-btn').hide()
}

function register() {
    $('.register-form').hide()
    $('.register-btn').show()
    if ($('#name').val() && $('#email').val()) {
        $.ajax({
                method: "POST",
                url: url + "/register/",
                data: {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    password: $('#password').val()
                }
            })
            .done(function () {
                $('#name').val(null)
                $('#email').val(null)
                $('#password').val(null)
                $('.g-signin2').show()
                $('.loginstd').show()
                $('.register-btn').show()
                $('.signout').hide()
                Swal.fire({
                    type: 'success',
                    title: 'Success',
                    text: 'You have successfully register!'
                })
            })
            .fail(function (err) {
                console.log(`Error ni : ${JSON.stringify(err)}`)
                Swal.fire({
                    type: 'error',
                    title: 'Error',
                    text: 'Error:' + err
                })
            })
    } else {
        Swal.fire({
            type: 'error',
            title: 'Error',
            text: 'Fields must not empty!'
        })
    }
}

function showMyTodos() {
    $.ajax({
            method: "GET",
            url: url + "/todo",
            headers: {
                jwtoken: localStorage.jwtoken
            }
        })
        .done((data) => {
            $('.myTodos').empty()
            let counter = 1
            localStorage.temp = data
            $('.myTodos').append(`
                <h3 style="font-family: 'Tangerine', serif; font-size: 60px"><strong>My Tasks</strong></h3>            
                <br>
            `)
            data.forEach(el => {
                let statz
                if (el.status === 'Done') {
                    statz = `<span style="color:green"><i class="fas fa-calendar-check"></i><strong> Done</strong></span>`
                } else {
                    statz = `<span style="color:red"><i class="fas fa-calendar-times"></i><strong> Not done yet</strong></span>`
                }
                $('.myTodos').append(
                    `
                    <div class="card text-black mb-3" style="background-color:transparent">
                      <h5 class="card-header" >${statz}</h5>
                      <div class="card-body" >
                        <h4 class="card-title"><strong>${el.todo}</strong></h4>
                        <p class="card-text">${el.description}</p>
                        <h6>Start at : ${new Date(el.start.toLocaleString('en-US', {timeZone: 'Asia/Jakarta'})).toLocaleString()}</h6>
                        <h6>End at : ${new Date(el.end.toLocaleString('en-US', {timeZone: 'Asia/Jakarta'})).toLocaleString()}</h6>
                        <h6>Location : ${el.location}</h6>
                        <br>
                        <p style="margin-top:10px"><button class="btn btn-success" onclick="edit('${el._id}')">Update</button>  <button class="btn btn-danger" onclick="deleteToDo('${el._id}')">Delete</button></p>
                      </div>
                    </div><br>
                `
                )
                counter++
            })
            $('.myTodos').append(
                `
                <br><br>
                <button type="button" style="font-size:25px; position:fixed; right:17%; top: 9.5%" class="btn btn-danger" id="close" onclick="closeYa()"><i class="fas fa-times"></i></button>
                `
            )
            $('.addTodo').hide()
            $('.editTodo').hide()
            // $('.myTodos').show()
        })
        .fail((err) => {
            console.log(err.message)
        })
}

function closeYa() {
    $('.myTodos').hide()
    $('.addTodo').hide()
    $('.editTodo').hide()
    $('.addProject').hide()
    $('.myProjects').hide()
    $('.editProject').hide()
}

function openYa() {
    $('.addTodo').hide()
    $('.editTodo').hide()
    $('.myTodos').show()
    $('.editProject').hide()
    $('.myProjects').hide()
    $('.addProject').hide()
}

function addForm() {
    $('.myTodos').hide()
    $('.addTodo').show()
    $('.editTodo').hide()
    $('.editProject').hide()
    $('.addProject').hide()
}

function addToDo() {
    let todo = $('#todoadd').val()
    let start = $('#startadddate').val() + " " + $('#startaddtime').val()
    let end = $('#endadddate').val() + " " + $('#endaddtime').val()
    let location = $('#locationadd').val()
    let description = $('#descriptionadd').val()
    let status = $('#statusadd').val()
    if (todo.length == 0 ||start.length == 0 ||end.length == 0 ||location.length == 0 ||description.length == 0 ){
        Swal.fire(
            'Error!',
            'All fields must not empty!',
            'error'
        )
    } else {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are going to create new todo!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, create it!'
        }).then((result) => {
            if (result.value) {
                if (localStorage.addTodoProjectId) {
                    $.ajax({
                            method: 'POST',
                            url: url + `/project/${localStorage.addTodoProjectId}`,
                            headers: {
                                jwtoken: localStorage.jwtoken
                            },
                            data: {
                                todo,
                                start,
                                end,
                                location,
                                description,
                                status,
                                projectId: localStorage.addTodoProjectId
                            }
                        })
                        .done(function (data) {
                            $('#todoadd').val('')
                            $('#startadddate').val('') + " " + $('#startaddtime').val('')
                            $('#endadddate').val('') + " " + $('#endaddtime').val('')
                            $('#endadd').val('')
                            $('#locationadd').val('')
                            $('#descriptionadd').val('')
                            $('#statusadd').val('')
                            $('.addTodo').hide()
                            localStorage.removeItem('addTodoProjectId')
                            showMyProjects()
                            Swal.fire(
                                'Created!',
                                'New to do has successfully created!',
                                'success'
                            )
                        })
                        .fail(function (err) {
                            console.log(`Error ni : ${JSON.stringify(err)}`)
                        })
                } else {
                    $.ajax({
                            method: 'POST',
                            url: url + '/todo',
                            headers: {
                                jwtoken: localStorage.jwtoken
                            },
                            data: {
                                todo,
                                start,
                                end,
                                location,
                                description,
                                status
                            }
                        })
                        .done(function (data) {
                            $('#todoadd').val('')
                            $('#startadddate').val('') + " " + $('#startaddtime').val('')
                            $('#endadddate').val('') + " " + $('#endaddtime').val('')
                            $('#endadd').val('')
                            $('#locationadd').val('')
                            $('#descriptionadd').val('')
                            $('#statusadd').val('')
                            $('.addTodo').hide()
                            showMyTodos()
                            Swal.fire(
                                'Created!',
                                'New to do has successfully created!',
                                'success'
                            )
                        })
                        .fail(function (err) {
                            console.log(`Error ni : ${JSON.stringify(err)}`)
                        })
    
                }
            }
        })
    }
}

function edit(id) {
    $.ajax({
            method: "GET",
            url: url + `/todo/${id}`,
            headers: {
                jwtoken: localStorage.jwtoken,
            }
        })
        .done(function (data) {
            $('#todoedit').val(data.todo)
            $('#startedit').val(new Date(data.start.toLocaleString('en-US', {
                timeZone: 'Asia/Jakarta'
            })).toLocaleString())
            $('#endedit').val(new Date(data.end.toLocaleString('en-US', {
                timeZone: 'Asia/Jakarta'
            })).toLocaleString())
            $('#locationedit').val(data.location)
            $('#descriptionedit').val(data.description)
            $('#statusedit').val(data.status)
            $(`.myTodos`).hide()
            $(`.editTodo`).show()
            $('.addTodo').hide()
            $(`#todoedit2`).val(id)
        })
        .fail(function (err) {
            console.log(`Error ni : ${JSON.stringify(err)}`)
        })
}

function deleteToDo(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                    method: "DELETE",
                    url: url + `/todo/${id}`,
                    headers: {
                        jwtoken: localStorage.jwtoken,
                    }
                })
                .done(function (data) {
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                    showMyTodos()
                })
                .fail(function (err) {
                    console.log(err)
                })
        }
    })
}

function editToDo() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You are going to update this task!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
    }).then((result) => {
        if (result.value) {
            $(`.editTodo`).hide()
            let id = $('#todoedit2').val()
            let todo = $('#todoedit').val()
            let start = $('#startedit').val()
            let end = $('#endedit').val()
            let edit = $('#endedit').val()
            let location = $('#locationedit').val()
            let description = $('#descriptionedit').val()
            let status = $('#statusedit').val()
            if (localStorage.projectId) {
                $.ajax({
                        method: "PUT",
                        url: url + `/project/${localStorage.projectId}/${localStorage.todoId}`,
                        headers: {
                            jwtoken: localStorage.jwtoken
                        },
                        data: {
                            todo,
                            start,
                            end,
                            edit,
                            location,
                            description,
                            status,
                            projectId: localStorage.projectId,
                            todoid: localStorage.todoId
                        }
                    })
                    .done(function (data) {
                        localStorage.removeItem('projectId')
                        localStorage.removeItem('todoId')
                        showMyProjects()
                        Swal.fire(
                            'Updated!',
                            'Your task has been updated.',
                            'success'
                        )
                    })
                    .fail(function (err) {
                        console.log(`Error ni : ${JSON.stringify(err)}`)
                    })

            } else {
                $.ajax({
                        method: "PUT",
                        url: url + `/todo/${id}`,
                        headers: {
                            jwtoken: localStorage.jwtoken
                        },
                        data: {
                            todo,
                            start,
                            end,
                            edit,
                            location,
                            description,
                            status,
                        }
                    })
                    .done(function (data) {
                        showMyTodos()
                        Swal.fire(
                            'Updated!',
                            'Your task has been updated.',
                            'success'
                        )
                    })
                    .fail(function (err) {
                        console.log(`Error ni : ${JSON.stringify(err)}`)
                    })
            }
        }
    })
}

function addProjectForm() {
    $('.myTodos').hide()
    $('.addTodo').hide()
    $('.editTodo').hide()
    $('.addProject').show()
    $.ajax({
            method: 'GET',
            url: url + '/',
            headers: {
                jwtoken: localStorage.jwtoken
            },
        })
        .done(function (data) {
            $('#projectTitle').val('')
            $('#descriptionProjectAdd').val('')
            $('#listUsers').empty()
            data.forEach(el => {
                $('#listUsers').append(`
                <input class="userChoice" type="checkbox" value="${el._id}">
                ${el.name}<br>
                `)
            })
        })
        .fail(function (err) {
            console.log(`Error ni : ${JSON.stringify(err)}`)
        })
}

function openProject() {
    $('.addTodo').hide()
    $('.editTodo').hide()
    $('.myTodos').hide()
    $('.myProjects').show()
}

function showMyProjects() {
    $.ajax({
            method: "GET",
            url: url + "/project",
            headers: {
                jwtoken: localStorage.jwtoken
            }
        })
        .done((data) => {
            $('.myProjects').empty()
            let counter = 1
            $('.myProjects').append(`
                <h3 style="font-family: 'Tangerine', serif; font-size: 60px"><strong>My Projects</strong></h3>            
                <br>
            `)
            data.forEach(el => {
                let counter2 = 1
                let members = ''
                el.members.forEach(member => {
                    members += `<h6 style="margin-left: 70px">${counter2+'. '+member.name}</h6>`
                    counter2++
                })
                let listTodoProject = ''
                if (el.todos) {
                    el.todos.forEach(todo => {
                        let statz
                        if (todo.status === 'Done') {
                            statz = `<span style="color:green"><i class="fas fa-calendar-check"></i><strong> Done</strong></span>`
                        } else {
                            statz = `<span style="color:red"><i class="fas fa-calendar-times"></i><strong> Not done yet</strong></span>`
                        }
                        listTodoProject +=
                            `
                        <div class="card text-black mb-3" style="background-color:transparent">
                          <h5 class="card-header" >${statz}</h5>
                          <div class="card-body" >
                            <h4 class="card-title"><strong>${todo.todo}</strong></h4>
                            <p class="card-text">${todo.description}</p>
                            <h6>Start at : ${new Date(todo.start.toLocaleString('en-US', {timeZone: 'Asia/Jakarta'})).toLocaleString()}</h6>
                            <h6>End at : ${new Date(todo.end.toLocaleString('en-US', {timeZone: 'Asia/Jakarta'})).toLocaleString()}</h6>
                            <h6>Location : ${todo.location}</h6>
                            <br>
                            <p style="margin-top:10px"><button class="btn btn-success" onclick="editTodoProjectForm('${el._id}','${todo._id}')">Update</button>  <button class="btn btn-danger" onclick="deleteToDoProject('${el._id}','${todo._id}')">Delete</button></p>
                          </div>
                        </div><br>
                    `

                    })
                }
                $('.myProjects').append(
                    `
                <div class="card text-black mb-3" style="background-color:transparent">
                      <h5 class="card-header" >by ${el.owner.name}</h5>
                      <div class="card-body" >
                        <h4 class="card-title"><strong>${el.project}</strong></h4>
                        <p class="card-text">${el.description}</p>
                        <h6>Members : </h6>
                        ${members}
                        <br>
                        <p style="margin-top:10px"><button class="btn btn-success" onclick="addTodoProject('${el._id}')">Assign Task</button>  <button class="btn btn-success" onclick="editProjectForm('${el._id}')">Update</button>  <button class="btn btn-danger" onclick="deleteProject('${el._id}')">Delete</button></p>
                      </div>
                      <div id="accordion${counter}">
                        <div class="card" style="background-color:transparent">
                          <div class="card-header" id="headingOne">
                            <h5 class="mb-0">
                              <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${counter}" aria-expanded="true" aria-controls="collapse${counter}">
                                This Project's Todos
                              </button>
                            </h5>
                          </div>
                          <div id="collapse${counter}" class="collapse "  aria-labelledby="headingOne" data-parent="#accordion${counter}">
                            <div class="card-body" >
                                ${listTodoProject}
                                </div>
                              </div>
                            </div>
                    </div><br>
                        `)
                counter++
            })

            $('.myProjects').append(
                `
            <br><br>
            <button type="button" style="font-size:25px; position:fixed; right:17%; top: 9.5%" class="btn btn-danger" id="close" onclick="closeYa()"><i class="fas fa-times"></i></button>
            `
            )
            $('.addTodo').hide()
            $('.editTodo').hide()
            $('.addProject').hide()
        })
        .fail((err) => {
            console.log(err.message)
        })
}

function addProject() {
    if ($('#projectTitle').val().length = 0 || $('#descriptionProjectAdd').val().length == 0) {
        Swal.fire({
            type: 'error',
            title: 'Error',
            text: 'Fields must not empty!'
        })
    } else {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are going to create new project!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, create it!'
        }).then((result) => {
            if (result.value) {
                let project = $('#projectTitle').val()
                let description = $('#descriptionProjectAdd').val()
                let dataUser = $('.userChoice')
                let members = []
                for (let i = 0; i < dataUser.length; i++) {
                    if (dataUser[i].checked) {
                        members.push(dataUser[i].value)
                    }
                }
                $.ajax({
                        method: 'POST',
                        url: url + '/project',
                        headers: {
                            jwtoken: localStorage.jwtoken
                        },
                        data: {
                            project,
                            description,
                            members
                        }
                    })
                    .done(function (data) {
                        $('#projectTitle').val('')
                        $('#descriptionProjectAdd').val('')
                        $('#userChoice').val('')
                        Swal.fire({
                            type: 'success',
                            title: 'Success',
                            text: 'You have successfully added new project!'
                        })
                        showMyProjects()
                    })
                    .fail(function (err) {
                        console.log(`Error ni : ${JSON.stringify(err)}`)
                        Swal.fire({
                            type: 'error',
                            title: 'Error',
                            text: err
                        })
                    })
            }
        })
    }
}

function deleteProject(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                    method: "DELETE",
                    url: url + `/project/${id}`,
                    headers: {
                        jwtoken: localStorage.jwtoken,
                    }
                })
                .done(function (data) {
                    Swal.fire({
                        type: 'success',
                        title: 'Deleted!',
                        text: 'You have succesfully delete a project!'
                    })
                    showMyProjects()
                })
                .fail(function (err) {
                    console.log(err)
                    Swal.fire({
                        type: 'error',
                        title: 'Error',
                        text: "You're not authorized!" + " :" + JSON.stringify(err)
                    })
                })
        }
    })
}

function editProjectForm(id) {
    $.ajax({
            method: "GET",
            url: url + `/project/${id}`,
            headers: {
                jwtoken: localStorage.jwtoken,
            }
        })
        .done(function (data) {
            $('#projectTitleEdit').val(data.project)
            $('#descriptionProjectEdit').val(data.description)
            $('#projectEditBut').val(data._id)
            $.ajax({
                    method: 'GET',
                    url: url + '/',
                    headers: {
                        jwtoken: localStorage.jwtoken
                    },
                })
                .done(function (result) {
                    $('#listUsersEdit').empty()
                    result.forEach(el => {
                        let check
                        if (data.members.includes(el._id)) {
                            check = 'checked'
                        } else {
                            check = ''
                        }
                        $('#listUsersEdit').append(`
                    <input class="userChoiceEdit" type="checkbox" value="${el._id}" ${check}>
                    ${el.name}<br>
                    `)
                    })
                    $('.editProject').show()
                })
                .fail(function (err) {
                    console.log(`Error ni : ${JSON.stringify(err)}`)
                    Swal.fire({
                        type: 'error',
                        title: 'Error',
                        text: "You're not authorized!" + " :" + err
                    })
                })

        })
        .fail(function (err) {
            console.log(`Error ni : ${JSON.stringify(err)}`)
            Swal.fire({
                type: 'error',
                title: 'Error',
                text: "You're not authorized!" + " :" + err
            })
        })
}

function editProject() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
    }).then((result) => {
        if (result.value) {
            $(`.editProject`).hide()
            let project = $('#projectTitleEdit').val()
            let description = $('#descriptionProjectEdit').val()
            let dataUser = $('.userChoiceEdit')
            let id = $('#projectEditBut').val()
            let members = []
            for (let i = 0; i < dataUser.length; i++) {
                if (dataUser[i].checked) {
                    members.push(dataUser[i].value)
                }
            }
            $.ajax({
                    method: "PUT",
                    url: url + `/project/${id}`,
                    headers: {
                        jwtoken: localStorage.jwtoken
                    },
                    data: {
                        project,
                        description,
                        members
                    }
                })
                .done(function (data) {
                    $('#projectTitleEdit').val('')
                    $('#descriptionProjectEdit').val('')
                    $('#userChoiceEdit').val('')
                    showMyProjects()
                    Swal.fire({
                        type: 'success',
                        title: 'Success',
                        text: 'You have successfully updated this project!'
                    })
                })
                .fail(function (err) {
                    console.log(`Error ni : ${JSON.stringify(err)}`)
                    Swal.fire({
                        type: 'error',
                        title: 'Error',
                        text: "You're not authorized!" + " :" + JSON.stringify(err)
                    })
                })
        }
    })
}

function addTodoProject(id) {
    localStorage.setItem('addTodoProjectId', id)
    addForm()
}

function deleteToDoProject(projectId, todoId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                    method: "DELETE",
                    url: url + `/project/${projectId}/${todoId}`,
                    data: {
                        projectId,
                        todoId
                    },
                    headers: {
                        jwtoken: localStorage.jwtoken,
                    }
                })
                .done(function (data) {
                    Swal.fire({
                        type: 'success',
                        title: 'Delete Success!',
                        text: 'You have succesfully delete a task!'
                    })
                    showMyProjects()
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                })
                .fail(function (err) {
                    console.log(err)
                    Swal.fire({
                        type: 'error',
                        title: 'Delete Failed!',
                        text: 'You are not authorized!',
                        err
                    })
                })
        }
    })
}

function editTodoProjectForm(projectId, todoId) {
    $.ajax({
            method: "GET",
            url: url + `/todo/${todoId}`,
            headers: {
                jwtoken: localStorage.jwtoken,
            }
        })
        .done(function (data) {
            localStorage.setItem('projectId', projectId)
            localStorage.setItem('todoId', todoId)
            $('#todoedit').val(data.todo)
            $('#startedit').val(new Date(data.start.toLocaleString('en-US', {
                timeZone: 'Asia/Jakarta'
            })).toLocaleString())
            $('#endedit').val(new Date(data.end.toLocaleString('en-US', {
                timeZone: 'Asia/Jakarta'
            })).toLocaleString())
            $('#locationedit').val(data.location)
            $('#descriptionedit').val(data.description)
            $('#statusedit').val(data.status)
            $(`.myTodos`).hide()
            $(`.editTodo`).show()
            $('.addTodo').hide()
        })
        .fail(function (err) {
            console.log(`Error ni : ${JSON.stringify(err)}`)
        })
}