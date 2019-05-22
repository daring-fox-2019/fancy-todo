const baseURL = 'http://localhost:3000'
M.AutoInit();
let token = null

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, { hoverEnabled: true });
});

$('#icon_prefix').keyup(function (event) {
    // Number 13 is the "Enter" key on the keyboard
    console.log('hi')

    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        $('#add_todo').click()
        // addTodo()
    }
});

function addTodo() {
    let title = $('#icon_prefix').val()
    $.ajax({
        url: `${baseURL}/todo`,
        type: 'POST',
        headers: {
            token: token
        },
        data: {
            title: title
        }
    })
        .done(({ data }) => {
            console.log('addtodo')
            console.log(data)
            console.log(data.status, 'dari addtodo status')
            $("#your-list").append( //sort by created date the latest
                `
                <div id=${data._id}  class="collection-item col s11">${data.title}</div>
                
                <label>
                    <input type="checkbox" />
                    <span></span>
                </label>
                `
            )
            $('#icon_prefix').val('')
        })
        .fail(function (jqXHR, textStatus) {
            console.log('request failed', texStatus)
        })
}

function getTodo(id) {
    $.ajax({
        url: `${baseURL}/todo/${id}`,
        type: 'GET',
        headers: {
            token: token
        }
    })
        .done(({ data }) => {
            let check = ''
            if(data.due_date){
                var date = data.due_date.slice(0,10)
            }else{
                var date = null
            }
            if (data.status === true) {
                check = 'checked="checked"'
            }
            $('#todo-details').html(
                `<span class="card-title">${data.title}</span>
         <div class="divider"></div>
        <form action="#" style='color:#9e9e9e'>
            <p>
                <label>
                    <input type="checkbox" class="filled-in" ${check}/>
                    <span>Done</span>
                </label>
            </p>
            <br>
            <div>Due date:</div> <input id= "due_date" value="${date}" type="date" class="datepicker">
            <br>
            <div>Reminder:</div>   
            <br>
            <div class="switch">
            <label class ="reminder2">
                Off
                <input type="checkbox" class ="reminder">
                <span class="lever" ></span>
                On
            </label>
            </div>
            <br>
            <button id=BTN${data._id} class="update-todo btn waves-effect waves-light" type="submit" name="action" style="margin-left:70%">Submit
            <i class="material-icons right">update
            </i>
        </button>    
        </form>`)
        $('.update-todo').click(function () {
            event.preventDefault();
            // console.log('updateTodo');
            let id = this.id.slice(3)
            updateTodo(id)
        })
            console.log(data)
        })
        .fail(function (jqXHR, textStatus) {
            console.log('request failed', textStatus)
        })
}

function populate() {
    console.log('hello dari index.js, function populate')
    $.ajax({
        url: `${baseURL}/todo`,
        type: 'GET',
        headers: {
            token: token
        }
    })
        .done(({ data }) => {
            let checked = ''
            for (let i = 0; i < data.length; i++) {
                console.log(data[i].status)
                if (data[i].status) {
                    checked = 'checked="checked"'
                } else {
                    checked = ''
                }
                console.log(checked)
                $("#your-list").append( //sort by created date the latest
                    `
                        <div id=${data[i]._id}  class="collection-item col s11">${data[i].title}</div>
                        
                        <label>
                            <input type="checkbox" ${checked} />
                            <span></span>
                        </label>
                        `
                )
            }

            console.log(data)
        })
        .fail(function (jqXHR, textStatus) {
            console.log('request failed', textStatus)
        })
}

function updateTodo(id) {
    let status = 0
    if ($('.filled-in').is(":checked")) {
        status = 1
    } else {
        status = 0
    }
    let due_date = $('#due_date').val()
    console.log(due_date)
    console.log(typeof due_date)
    let reminder = null
    if ($('.reminder').is(":checked")) {
        if (due_date) {
            due_date = new Date(due_date)
            reminder = new Date()
            reminder.setDate(due_date.getDate() - 1)
        }
    }
    $.ajax({
        url: `${baseURL}/todo/${id}`,
        type: 'PATCH',
        data: {
            due_date: due_date,
            reminder: reminder,
            status: status
        },
        headers: {
            token: token
        }
    })
        .done(({ data }) => {
            $('#your-list').empty()
            populate()
            console.log(data)

        })
        .fail(function (jqXHR, textStatus) {
            console.log('request failed', textStatus)
        })
}
function showSignIn() {
    event.preventDefault()
    $('#landing-page').hide()
    $('#signup-page').hide()
    $('#signin-page').show()
    $('#main-page').hide()
}
function showSignUp() {
    event.preventDefault()
    $('#landing-page').hide()
    $('#signup-page').show()
    $('#signin-page').hide()
    $('#main-page').hide()
}
function signedIn() {
    event.preventDefault()
    $('#landing-page').hide()
    $('#signup-page').hide()
    $('#signin-page').hide()
    $('#main-page').show()
}
function signOut() {
    event.preventDefault()
    $('#landing-page').show()
    $('#signup-page').hide()
    $('#signin-page').hide()
    $('#main-page').hide()
}
function signIn() {
    username = $('#usernameSignIn').val()
    password = $('#passwordSignIn').val()
    console.log(username, "usernameSignIn")
    console.log(password,"password")
    $.ajax({
        url: `${baseURL}/signin`,
        type: 'POST',
        data: {
            username: username,
            password: password,
        }
    })
        .done((response)=> {
            console.log('hello, berhasil signin')
            console.log(response.data)
            console.log(response.token)
            localStorage.setItem('token', response.token)
            signedIn()
        })
        .fail(function (jqXHR, textStatus) {
            console.log('request failed', textStatus)
        })
}

$(document).ready(function () {
    if (localStorage.getItem('token')) {
        token = localStorage.getItem('token')
    }
    populate()
    $('root-element').on('click', $('.collection-item'), function () {
        console.log('tes')
    })

    $('#add_todo').click(function () {
        addTodo()
    })

    $("#hovrbttn").focusout(function () {
        $('#hovrbttn').attr('style', 'color:#bf360c')
    });


    $('#your-list').on('click', '.collection-item', function (e) {
        getTodo(this.id)
    });

    
    $('#signinpage').click(function () {
        showSignIn()
    })

    $('#signuppage').click(function () {
        showSignUp()
    })
    $('#signin').click(function () {
        signIn()
    })

})