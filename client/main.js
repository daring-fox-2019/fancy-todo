const baseURL = `http://localhost:3000`
const color = ["#462048", "#383B42", "#F7AA86", "#2E2931"]
let dataUser;

if (localStorage.getItem('token')) {
    // fetchMyPendingInvitations()
    hasToken()

} else {
    // fetchMyPendingInvitations()
    noToken()
}

function hasToken(params) {
    $('#kelompok_navbar').show()
    $('#perjudulan').hide()
    $('#login-form').hide()
    $('#register-form').hide()
    $('#tombol-signout').show()
    $('#tombol-login').hide()
    // $('#dashboard').show()
    $('#mobtombol-login').hide()
    $('#mobtombol-register').hide()
    $('#mobtombol-todo').show()
    $('#mobtombol-project').show()

    $('#tombomobtombol-todotodo').show()
    $('#tombol-addtodo-kiri').hide()
    $('#tombol-project').show()
    $('#mobtombol-signout').show()

}

function noToken(params) {
    $('#tombol-todo').hide()
    $('#tombol-dashboard').hide()
    $('#tombol-project').hide()
    $('#todo-list').hide()
    $('#dashboard').hide()
    $('#kelompok_navbar').show()
    $('#perjudulan').show()
    $('#login-form').hide()
    $('#register-form').hide()
    $('#tombol-signout').hide()
    $('#tombol-login').show()
    $('#mobtombol-register').show()
    $('#mobtombol-login').show()
    $('#mobtombol-todo').hide()
    $('#mobtombol-project').hide()
    $('#mobtombol-signout').hide()

}


// USER-RELATED AND SHOWCASES METHODS
function register() {
    event.preventDefault()

    let firstName = $('#firstName').val()
    let lastName = $('#lastName').val()
    let email = $('#email').val()
    let password = $('#password').val()
    console.log('DATA REGISTER MASUK GAK', firstName, lastName, email, password);

    event.preventDefault()
    $.ajax({
        url: `${baseURL}/users/register`,
        type: 'POST',
        data: {
            firstName,
            lastName,
            email,
            password
        }
    })
    .done(function (response) {
        showLogin()
        Swal.fire(
            'Registered!',
            'You may login and manage your project!',
            'success'
        )
    })
    .fail(function (err, textStatus) {
        Swal.fire(
            'Register fail',
            'Please check your credentials',
            'error'
        )
    })
}

function login() {
    event.preventDefault()
    let email = $('#emaillogin').val()
    let password = $('#passwordlogin').val()
    console.log(email, password, 'MAU LOGIN YA');

    event.preventDefault()
    $.ajax({
        url: `${baseURL}/users/signin/local`,
        type: 'POST',
        data: {
            email,
            password
        }
    })
    .done(function (response) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('userId', response._id)
        localStorage.setItem('firstName', response.firstName)

        Swal.fire(
            'You are logged in',
            'You may manage your project',
            'success'
        )
        hasToken()
        $('#tombol-login').hide()
        $('#dashboard').show()
        $('#login-form').hide()
        $('#perjudulan').hide()
        $('#register-form').hide()
        $('#tombol-signout').show()
        $('#tombol-todo').show()
        $('#tombol-project').show()
    
        fetchMyPendingInvitations()
        fetchTodo()

    })
    .fail(function (err, textStatus) {
        console.log(err.response);
        Swal.fire(
            'Login fail',
            'Please check your credentials',
            'error'
        )
    })
}

function onSignIn(googleUser) {
    event.preventDefault()

    console.log('MAU LOGIN GOGOLE');

    const profile = googleUser.getBasicProfile();
    const id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        url: `${baseURL}/users/signin/google`,
        type: 'POST',
        data: {
            id_token
        }
    })
    .done(function (response) {
        console.log(response, 'apa isinya?');
        if (!localStorage.getItem('token')) {
            Swal.fire(
                'You are logged in',
                'You may manage your project',
                'success'
            )

        }
        // console.log(response)
        localStorage.setItem('token', response.token)
        localStorage.setItem('userId', response.id)
        localStorage.setItem('firstName', response.firstName)

    hasToken()
    $('#dashboard').show()
    // $('#todo-list').show()
    $('#login-form').hide()
    $('#perjudulan').hide()
    $('#register-form').hide()
    $('#tombol-signout').show()
    $('#tombol-login').hide()
    $('#tombol-todo').show()
    $('#tombol-project').show()

    fetchMyPendingInvitations()
    fetchTodo()

    })
    .fail(function (err, textStatus) {
        console.log(err.responseJSON)
        Swal.fire(
            'Login fail',
            'Please check your credentials',
            'error'
        )
        console.log(`request failed ${textStatus}`)
    })
}

function signOut() {
    event.preventDefault()

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.clear()
        noToken()
        $('#tombol-todo').hide()
        $('#tombol-dashboard').hide()
        $('#tombol-project').hide()    
        $('#kelompok_navbar').show()
        $('#perjudulan').show()
        $('#tombol-signout').hide()
        $('#tombol-login').show()
        $('#tombol-dashboard').hide()
        $('#dashboard').hide()

        Swal.fire(
            'Hope to see you soon <3',
            'Do what you need to do!',
            'success'
        )
    });
}

function fetchAllUsers() {

    event.preventDefault()
    $.ajax({
            url: `${baseURL}/users`,
            type: 'GET',
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done((response) => {
            dataUser = {}
            let arr = []
            response.forEach(user => {
                dataUser[user.email] = {id : user._id}
            })
            
            $('input.autocomplete').autocomplete({
                data: dataUser,
            });
        })
        .fail(function (err, textStatus) {
            console.log(err);

            Swal.fire(
                'Something is wrong ',
                'Please reload the page',
                'error'
            )
        })

}

function showProject() {
    fetchProject()
    $('#todo-list-none').hide()
    $('#dashboard').show()
    $('#project-list').show()
    $('#kelompok_navbar').show()
    $('#perjudulan').hide()
    $('#register-form').hide()
    $('#login-form').hide()
    $('#tombol-signout').show()
    $('#todo-list').hide()

}

function showLogin() {
    event.preventDefault()
    $('#project-list').hide()
    $('#kelompok_navbar').show()
    $('#login-form').show()
    $('#perjudulan').hide()
    $('#register-form').hide()
    $('#tombol-signout').hide()
}

function showLanding() {
    event.preventDefault()
    $('#dashboard').hide()
    $('#project-list').hide()
    $('#todo-list').hide()
    $('#kelompok_navbar').show()
    $('#login-form').hide()
    $('#perjudulan').show()
    $('#register-form').hide()

}

function showDashboard() {
    event.preventDefault()

    $('#kelompok_navbar').show()
    $('#dashboard').show()
    $('#perjudulan').hide()
}

function showRegister() {
    event.preventDefault()
    if (localStorage.getItem('token')) {
        M.toast({html : `Hi ${localStorage.getItem('firstName')}! You cannot register. You are already logged in`})
    } else {
        $('#project-list').hide()
        $('#kelompok_navbar').show()
        $('#perjudulan').hide()
        $('#register-form').show()
        $('#tombol-login').show()
        $('#tombol-signout').hide()
        $('#tombol-dashboard').hide()
    }
}



function randomColor() {
    return Math.floor(Math.random() * (3 - 0 + 1)) + 0;
}

function showModal(id) {
    fetchAllUsers()
    // let autocompleteFirstNameForUser = $("#task-type").val()
    // let autocompleteIdForUser = $("#task-type").val()[$("#task-type").val()]

console.log(id, 'masuk gak show modal');
        $('#addTodoForThisProject').html(`<div class="modal-content">
            <h6>Add New Todo For This Project</h6>
            <div class="row">
                <form class="col s12">
                    <div class="row">
                        <div class="input-field col s12">
                            <i class="material-icons prefix">clear_all</i>
                            <input id="todo-project-task-name" type="text" class="validate">
                            <label for="icon_prefix">Task Name</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <i class="material-icons prefix">chat_bubble_outline</i>
                            <input id="todo-project-task-desc" type="text" class="validate">
                            <label for="icon_prefix">Description</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <i class="material-icons prefix">add_alert</i>
                            <input id="todo-project-task-dueDate" type="datetime-local">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12">
                          <div class="row">
                            <div class="input-field col s12">
                              <i class="material-icons prefix">textsms</i>
                              <input type="text" id="autocomplete-input" class="autocomplete">
                              <label for="autocomplete-input">Search Todo Asignee</label>
                            </div>
                          </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <a onclick="addTodoForThisProject('${id}')" class="modal-close waves-effect waves-green btn-flat">OK</a>
            </div>
    </div>`)
}

function showModalInviteMember(id) {
    fetchAllUsers()
    $('#inviteMember').html(`<br><div class="modal-content">
    <h6>Invite Member To Your Project</h6>
    <div class="row">
        <form class="col s12">
            <div class="row">
                <div class="col s12">
                  <div class="row">
                    <div class="input-field col s12">
                      <i class="material-icons prefix">textsms</i>
                      <input type="text" id="autocomplete-input" class="autocomplete">
                      <label for="autocomplete-input">Search Member To Invite</label>
                    </div>
                  </div>
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <a onclick="inviteMemberToThisProject('${id}')" class="modal-close waves-effect waves-green btn-flat">OK</a>
    </div>
</div>`)
}

function showModalEditProject(id) {
    fetchOneProject(id)
    $('#editProjectModal').html(`<div class="modal-content">
        <h6>Edit Project</h6>
        <div class="row">
            <form class="col s12">
                <div class="row">
                    <div class="input-field col s12">
                        <i class="material-icons prefix">clear_all</i>
                        <input id="nameprojectedit" value="" type="text" class="validate">
                        <label class="active" for="icon_prefix"></label>
                    </div>
                </div>
        </div>
        </form>
    </div>
    <button onclick="postEditProject('${id}')" id="add-project-button" class="modal-footer"><a
            class="modal-close waves-effect waves-green btn-flat">OK</a>
    </button>
</div>`)
}

//  USER AND SHOWCASE REALATED METHODS ENDS HERE



// TODO-RELATED METHODS STARTS HERE

function fetchTodo() {
    $('#dashboard').show()
    $('#perjudulan').hide()
    $('#todo-list').show()
    $('#project-list').hide()
    $('#tombol-addtodo-kiri').show()
    let clr = '#462048'

    event.preventDefault()
    $.ajax({
            url: `${baseURL}/todos`,
            type: 'GET',
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done((response) => {

            $("#todo-list").html("");
            if (response.length == 0) {
                $('#todo-list-none').show()
            } else {
                $('#todo-list-none').hide()
                response.forEach(todo => {
                    $('#todo-list-none').hide()
                    if (!todo.status) clr = `#2E2931`
                    // console.log(todo._id, 'ini id dari all')
                    $('#todo-list').append(`<div style="border-radius: 20px; background-color:${clr}" class="card z-depth-0">
                  <div class="card-content white-text">
                    <span class="card-title">${todo.name}</span>
                    <p>Detail : ${todo.description}.</p>
              
                    <p>Due : ${todo.dueDate.split('T')[0]}</p>
                    
                  </div>
                  <div style="border-radius: 20px;" class="card-action">
                  <a href="#editTodo" onclick="getEditForm('${todo._id}')" class="modal-trigger" id="${todo._id}">Edit</a>
                    ${todo.status ?
                      `<a id="${todo._id}" onclick="changeToUncheck(this)">Uncheck</a>` :
                      `<a id="${todo._id}" onclick="changeToCheck(this)">Check</a>`
                    }
                    <a onclick="deleteTodo('${todo._id}')">Delete</a>
                  </div>`)
                })
            }

            $('#todo-list').show()
        })
        .fail(function (err, textStatus) {
            console.log(err);

            Swal.fire(
                'Something is wrong ',
                'Please reload the page',
                'error'
            )
        })
}

function getEditForm(id) {
    event.preventDefault()

    $.ajax({
            url: `${baseURL}/todos/${id}`,
            type: 'GET',
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done((response) => {
            console.log('dapet nih by id', response);

            $('#edit-task-name').val(response.name)
            $('#edit-task-desc').val(response.description)
            $('#edit-task-type').val(response.type)
            $('#edit-task-dueDate').val(new Date(response.dueDate).toISOString().slice(0, 16))
            $('#edit-button').html(`<div id ="edit-button" class="modal-footer"><a onclick="postEditForm('${id}')"  class="modal-close waves-effect waves-green btn-flat">OK</a></div>`)

        })
        .fail(function (err, textStatus) {
            console.log(err);

            Swal.fire(
                'Something is wrong ',
                'Please reload the page',
                'error'
            )
        })
}

function postEditForm(id) {

    let name = $('#edit-task-name').val()
    let description = $('#edit-task-desc').val()
    let dueDate = $('#edit-task-dueDate').val()
    $.ajax({
            url: `${baseURL}/todos/${id}`,
            type: 'PATCH',
            headers: {
                token: localStorage.getItem('token')
            },
            data: {
                name,
                description,
                dueDate
            },
        })
        .done((response) => { 
            if (response.type == 'personal') {
                fetchTodo()
            } else {
                fetchProject()
            }
            M.toast({  html: 'You edited a task' })
        })
        .fail(function (err, textStatus) {  console.log(err);
            Swal.fire(
                'Something is wrong ',
                'Please reload the page',
                'error'
            )
        })

}

function addTodo() {
    event.preventDefault()
    let apalah = $('#apalah').val()
    let name = $('#task-name').val()
    let description = $('#task-desc').val()
    let dueDate = $("#task-dueDate").val()
    let type = $("#task-type").val()
    console.log(apalah, name, description, dueDate, type);

    $.ajax({
        url: `${baseURL}/todos/`,
        type: 'POST',
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            name,
            description,
            dueDate,
            type,
        }
    })
    .done((response) => {
        M.toast({ html: 'New personal todo has been created.' })
        $('#todo-list-none').hide()
        fetchTodo()
    })
    .fail(function (err, textStatus) {
        console.log(err);

        Swal.fire(
            'Adding Todo Fail ',
            'All Field Must Be Filled!',
            'error'
        )
    })
}


function changeToUncheck(code) {
    event.preventDefault()
    // console.log(code, 'MAU UNCEK')
  
    $.ajax({
      url: `${baseURL}/todos/${code.getAttribute('id')}`,
      type: 'PATCH',
      headers: {
        token: localStorage.getItem('token')
      },
      data : {status : false}
    })
    .done(todo => {
        if (todo.type == 'personal') {
            fetchTodo()
        } else {
            fetchProject()
        }
      M.toast({ html: 'You cancel your finished task' })
  
    })
    .fail(function (err, textStatus) {
      swal({
        text: 'Something is wrong',
        icon: "warning",
        button: "Understood",
      });
    })
  }
  
  function changeToCheck(code) {
    event.preventDefault()
    // console.log(code, 'MAU NGECEK')
  
    $.ajax({
      url: `${baseURL}/todos/${code.getAttribute('id')}`,
      type: 'PATCH',
      headers: {
        token: localStorage.getItem('token')
      },
      data : {status : true}
    })
    .done(todo => {
        if (todo.type == 'personal') {
            fetchTodo()
        } else {
            fetchProject()
        }
      M.toast({ html: 'Well done you finished a task' })
    })
    .fail(function (err, textStatus) {
      swal({
        text: 'Something is wrong',
        icon: "warning",
        button: "Understood",
      });
    })
  }


function deleteTodo(id) {
    $.ajax({
        url: `${baseURL}/todos/${id}`,
        type: 'DELETE',
        headers: {
            token: localStorage.getItem('token'),
        }
    })
    .done(response => {
        M.toast({
            html: 'You deleted a task'
        })
        fetchTodo()
    })
    .fail(function (err, textStatus) {
        swal({
            text: 'Something is wrong',
            icon: "warning",
            button: "Understood",
        });
    })
}

// TODO-RELATED METHODS ENDS HERE

// PROJECT-RELATED METHODS STARTS HERE

function addProject(params) {
    console.log('MASUK BANG');

    event.preventDefault()
    let name = $('#nameproject').val()

    $.ajax({
            url: `${baseURL}/projects/`,
            type: 'POST',
            headers: {
                token: localStorage.getItem('token'),
            },
            data: {
                name
            }
        })
        .done(function (response) {
            console.log(response, 'KEBUAT GAK YA?');
            fetchProject()
        })
        .fail(function (err, textStatus) {
            console.log(err);
            let errors = err.responseJSON.errors.name.message
            swal({
                text: `${errors}`,
                icon: "warning",
                button: "Understood",
            });

        })
}

function deleteProject(id) {
    console.log(id, 'dapat gak ya ni id nya??');

    event.preventDefault()
    $.ajax({
            url: `${baseURL}/projects/${id}`,
            type: 'DELETE',
            headers: {
                token: localStorage.getItem('token'),
            }
        })
        .done(function (response) {
            M.toast({html : `Successfully deleted project '${response.name}'` })

            // console.log(response, 'haahaha');
            fetchProject()

        })
        .fail(function (err, textStatus) {
            M.toast({html : `${err.responseJSON.msg}` })
            
        })
}

function inviteMemberToThisProject(id) {
    console.log('berhasil masuk sini~', id);
    let email = $("#autocomplete-input").val()

    $.ajax({
        url: `${baseURL}/projects/invite/${id}`,
        type: 'PATCH',
        headers: {
            token: localStorage.getItem('token'),
        },
        data : {
            email
        }
    })
    .done(function (response) {
        swal({
            text: 'Member has been invited. Please wait for confirmation',
            icon: "success",
            button: "Understood",
        });
        fetchProject()
    })

    .fail(function (err, textStatus) {

        swal({
            text: err.responseJSON.msg,
            icon: "warning",
            button: "Understood",
        });
    })
}

function deleteMemberForThisProject(memberId, projectId, memberName) {
    $.ajax({
        url: `${baseURL}/projects/${projectId}/${memberId}`,
        type: 'DELETE',
        headers: {
            token: localStorage.getItem('token'),
        }
    })
    .done(function(response) {
        M.toast({html : `Deleted ${memberName} from this project. User will be notified.`})
        fetchProject()

    })
    .fail(function (err, textStatus) {
        console.log(err);
        M.toast({html : `${err.responseJSON.msg}`})
    })    
}

function postEditProject(id) {
    let name = $('#nameprojectedit').val()
    $.ajax({
        url: `${baseURL}/projects/${id}`,
        type: 'PATCH',
        headers: {
            token: localStorage.getItem('token'),
        },
        data : {
            name
        }
    })
    .done(function(response) {
        M.toast({html : `Updated project name to ${response.name}.`})
        fetchProject()

    })
    .fail(function (err, textStatus) {
        console.log(err);
        M.toast({html : `${err.responseJSON.msg}`})
    }) 
}

function addTodoForThisProject(id) {
    let name = $("#todo-project-task-name").val()
    let description = $("#todo-project-task-desc").val()
    let dueDate = $("#todo-project-task-dueDate").val()
    let email = $("#autocomplete-input").val()
    let projectId = id
    // console.log(name, description, dueDate, email ,'//', projectId, 'HALO??');
    
    $.ajax({
        url: `${baseURL}/projects/todo/${id}`,
        type: 'POST',
        headers: {
            token: localStorage.getItem('token'),
        },
        data : {
            name, description, dueDate, email, projectId
        }
    })
    .done(function(response) {
        M.toast({html : `Great! You added a new todo!`})
        fetchProject()
    })
    .fail(function (err, textStatus) {
        console.log(err);
        M.toast({html : `${err.responseJSON.msg}`})
    })
}

function deleteTodoInThisProject(projectId, todoId) {
    console.log(todoId, '==========')
    $.ajax({
        url: `${baseURL}/projects/todo/${projectId}/${todoId}`,
        type: 'DELETE',
        headers: {
            token: localStorage.getItem('token'),
        }
    })
    .done(function(response) {
        M.toast({html : `Deleted '${response.name}' from this project.`})
        fetchProject()
    })
    .fail(function (err, textStatus) {
        console.log(err);
        M.toast({html : `${err.responseJSON.msg}`})
    })
}


function fetchMyPendingInvitations() {
     $.ajax({
         url : `${baseURL}/projects/member/pending`,
         type : 'GET',
         headers: {
            token: localStorage.getItem('token'),
        }
     })
     .done(function(response) {
         if (response.length == 0) {
             $('#check-array-pulsate').html(`<button  onclick="fetchMyPendingInvitations()" href="#checkInvitations" style="border-radius: 20px;width:200px; background-color:midnightblue"
             class="btn waves-effect white-text waves-light btn-flat modal-trigger">Check Invitations
         </button>`)
         } else {
            $('#check-array-pulsate').html(`<button  onclick="fetchMyPendingInvitations()" href="#checkInvitations" style="border-radius: 20px; width:200px;background-color:midnightblue"
            class="btn waves-effect white-text waves-light btn-flat modal-trigger heartbeat">Check Invitations
        </button>`)
             // jumlah invitation adalah length dari array response
             // daftar-pending
     
             let data = `<table class = "responsive-table">
             <tr>
             <th>No.</th>
             <th>Project Name</th>
             <th>Actions</th>
             </tr>`
     
             response.forEach((el, idx) => {
                 data += `<tr><td>${idx+1}</td>
                 <td>${el.name}</td>
                 <td>
                 <button data-target="inviteMember" onclick="acceptInvitation('${el._id}')" style="background-color:darkolivegreen; border-radius:20px" class="btn-small z-depth-0 modal-trigger">Accept</button> <b>|</b> <button data-target="inviteMember" onclick="declineInvitation('${el._id}')" style="background-color:darkolivegreen; border-radius:20px" class="btn-small z-depth-0 modal-trigger">Decline</button>
                 </td>
                 `
             })
             data += `</tr> </table>`
     
             $('#daftar-pending').html(data)
         }
     })
     .fail(function (err, textStatus) {
        console.log(err);
        swal({
            text: 'Something is wrong',
            icon: "warning",
            button: "Understood",
        });
    })
}

function acceptInvitation(id) {
    $.ajax({
        url : `${baseURL}/projects/accept/${id}`,
        type : 'PATCH',
        headers: {
           token: localStorage.getItem('token'),
       }
    })
    .done(function(response) {
        M.toast({
            html: `Welcoming you to project ${response.name}`
        })
        fetchMyPendingInvitations()
        showProject()
    })
    .fail(function (err, textStatus) {
        console.log(err.responseJSON);
        
        swal({
            text: 'Something is wrong',
            icon: "warning",
            button: "Understood",
        });
    })
}

function declineInvitation(id) {
    $.ajax({
        url : `${baseURL}/projects/decline/${id}`,
        type : 'PATCH',
        headers: {
           token: localStorage.getItem('token'),
       }
    })
    .done(function(response) {
        M.toast({
            html: `Declining ${response.name}. You won't get anymore notification from this project.`
        })
        fetchMyPendingInvitations()
    })
    .fail(function (err, textStatus) {
        console.log(err.responseJSON);

        swal({
            text: 'Something is wrong',
            icon: "warning",
            button: "Understood",
        });
    })
}

function fetchOneProject(id) {
    // console.log(id, '////');

    event.preventDefault()
    $.ajax({
        url: `${baseURL}/projects/${id}`,
        type: 'GET',
        headers: {
            token: localStorage.getItem('token'),
        }
    })
    .done(function (response) {
        console.log(response);
        
        $('#nameprojectedit').val(response.name)

        // Looping nge isi message board //
        $('.chat-with').html(`Board for ${response.name}`)
        $('.chat-num-messages').html(`already ${response.messageList.length} messages`)

        let memberUl = `<ul>`
        let chatUl = ` <ul>`
        response.messageList.forEach(msg => {
                chatUl += `<li>
                <div class="message-data align-left">
                Pin from : <span class="message-data-name">${msg.userId.firstName}</span> on <span class="message-data-time">${moment(msg.date).format('MMMM Do YYYY, h:mm:ss a')}</span> &nbsp; &nbsp;
                </div>
                <div class="message my-message float-left">
                ${msg.message}
                </div>
            </li>`
        
    })
    
            

        response.members.forEach((member, idx) => {
            memberUl += `<li class="clearfix">
            <div class="about-person">
            <div class="person-chat-name">
            <i class="material-icons tiny black-white">face</i>
               ${member.firstName}
            </div>
            </div>
        </li>`
        })

        memberUl +=`</ul>`
        chatUl += `</ul>`


        
        $('.chat-history').append(chatUl)
        $('.people-list').append(memberUl)
  
       
       
    })
    .fail(function(err, textStatus) {
        swal({
            text: 'Something is wrong',
            icon: "warning",
            button: "Understood",
        });
    })
}

function fetchProject() {
    $('#tombol-addtodo-kiri').hide()

    event.preventDefault()
    $.ajax({
        url: `${baseURL}/projects`,
        type: 'GET',
        headers: {
            token: localStorage.getItem('token'),
        }
    })
    .done(function (response) {
        
        console.log(response, 'BEDA GA??');
        
        //tabel-project

        let data = `<table class = "responsive-table">
    <tr>
    <th>No</th>
    <th>Teams</th>
    <th>Name</th>
    <th>Todo List</th>
    <th>Actions</th>
    </tr>
    `
    // ${todo.userId.firstName}
    // let firstNameTemp = null
        response.forEach((el, idx) => {
            
            console.log(response, 'dapet apa???')
            data += `<tr><td><h4>${idx+1}<h4></td><td>`
            
            if (el.members.length == 0) {
                data += `<p>You've got zero help on this project. Add now!</p>`
            } else {
                el.members.forEach((member, idx) => {
                    firstNameTemp = member.firstName
                    if (member._id == el.createdBy._id) {
                        data += `<i><span style="color:#462048">${member.firstName} (Owner)</span></i><br>`
                    } else {
                        data += `<span>${member.firstName}</span> <i onclick="deleteMemberForThisProject('${member._id}', '${el._id}', '${member.firstName}')" class="mousechange tiny blue-grey-text text-darken-4 material-icons">highlight_off</i> <br>`
                    }
                })
                data += `<br><button data-target="inviteMember" onclick="showModalInviteMember('${el._id}')" style="background-color:#F7AA86; border-radius:20px" class="btn-small z-depth-0 modal-trigger">Invite Friends!</button></td>`

            }
            data += `</td><td>${el.name}</td><td>`
            if (el.todoList.length == 0) {
                data += `<p>This project has no assginee. Let's add your team now!</p>`
            } else {
                el.todoList.forEach((todo, idx) => {
  
                    if (todo.status == true) {
                        data += `${todo.name}  <i href="#editTodo" onclick="getEditForm('${todo._id}')" class="modal-trigger mousechange tiny blue-grey-text text-darken-4 material-icons" id="${todo._id}">mode_edit</i><i onclick="changeToUncheck(this)" class="modal-trigger mousechange tiny blue-grey-text text-darken-4 material-icons" id="${todo._id}">check_circle</i> | Assigned to : ${todo.userId.firstName} <i onclick="deleteTodoInThisProject('${el._id}', '${todo._id}')" class="mousechange tiny blue-grey-text text-darken-4 material-icons">delete</i> <br>`
                    } else {
                        data += `${todo.name}  <i href="#editTodo" onclick="getEditForm('${todo._id}')" class="modal-trigger mousechange tiny blue-grey-text text-darken-4 material-icons" id="${todo._id}">mode_edit</i><i onclick="changeToCheck(this)" class="modal-trigger mousechange tiny blue-grey-text text-darken-4 material-icons" id="${todo._id}">clear</i> | Assigned to : ${todo.userId.firstName} <i onclick="deleteTodoInThisProject('${el._id}', '${todo._id}')" class="mousechange tiny blue-grey-text text-darken-4 material-icons">delete</i> <br>`
                    }
                })
            }
            
            data += `<br><button data-target="addTodoForThisProject" onclick="showModal('${el._id}')" style="background-color:#F7AA86; border-radius:20px" class="btn-small z-depth-0 modal-trigger">Add Todo For This Project</button></td>`
            data += `<td><button data-target="editProjectModal" onclick="showModalEditProject('${el._id}')" style="width:130px; margin-top:4px; background-color:midnightblue; border-radius:20px" class="modal-trigger btn-small mb-6 z-depth-0">Edit</button> <b><br></b>
            <button  onclick="deleteProject('${el._id}')" style="width:130px; margin-top:4px;  background-color:midnightblue; border-radius:20px" class ="z-depth-0 btn-small">Delete</button><br>
            <button  data-target="messageBoxModal" onclick="showMessageBoard('${el._id}')" style="margin-top:4px;  width:130px; background-color:midnightblue; border-radius:20px" class="modal-trigger btn-small z-depth-0">Pin Message</button> </td>`

        })

        data += `</tr> </table>`

        $('#tabel-project').html(data)
    })
    .fail(function (err, textStatus) {

        swal({
            text: 'Something is wrong',
            icon: "warning",
            button: "Understood",
        });
    })

}

// PROJECT-RELATED METHODS ENDS HERE



$(document).ready(function () {
    $('.sidenav').sidenav();
    $('select').formSelect();
    $("#demo01").animatedModal();
    $("#demo02").animatedModal();

    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.collapsible');
        var instances = M.Collapsible.init(elems, {
            accordion: false
        });
    });

    $(".dropdown-trigger").dropdown();
    const slider = document.querySelectorAll('.slider')

    M.Slider.init(slider, {
        indicators: false,
        height: 500
    })
})


            //     chatUl += `<li class="clearfix">
            //     <div class="message-data align-left">
            //         <span class="message-data-time">${moment(msg.date).format('MMMM Do YYYY, h:mm:ss a')} </span> &nbsp; &nbsp;
            //         <span class="message-data-name">${msg.userId.firstName}</span> <i
            //             class="material-icons tiny black-white">lens</i>
            //     </div>
            //     <div class="message other-message float-right">
            //         ${msg.message}
            //     </div>
            // </li>`

            // } else {
            //     chatUl+= `<li>
            //     <div class="message-data align-left">
            //         <span class="message-data-time">10:15 AM, Today</span> &nbsp; &nbsp;
            //         <span class="message-data-name">Davita</span> <i
            //             class="material-icons tiny black-white">lens</i>
            //     </div>
            //     <div class="message other-message float-right">
            //             a
            //     </div>
            // </li>`
            //     chatUl += ` <li>
            //     <div class="message-data align-right">
            //         <span class="message-data-time">${moment(msg.date).format('MMMM Do YYYY, h:mm:ss a')}</span> &nbsp; &nbsp;
            //         <span class="message-data-name">${msg.userId.firstName}</span> <i
            //             class="material-icons tiny black-white">lens</i>
            //     </div>
            //     <div class="message my-message float-right">
            //         ${msg.message}

            //     </div>
            // </li>`
            // }
        