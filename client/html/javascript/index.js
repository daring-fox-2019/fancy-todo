function onSignIn(googleUser){
    // console.log(googleUser);
    // console.log('kesini loh');
    
    let id_token = googleUser.getAuthResponse().id_token
    $.ajax({
        url: 'http://35.240.172.169/users/login/google',
        type: 'post',
        headers: {
            id_token
        }
    })
    .done(function(response){
        // console.log(response);
        localStorage.setItem('token',response.token)
        localStorage.setItem('id',response.id)
        localStorage.setItem('firstName',response.firstName)
        localStorage.setItem('lastName',response.lastName)
        localStorage.setItem('email',response.email)
        // console.log(localStorage)
        loggedIn()
    })
    .fail((jqXHR,status,err)=>{
        console.log(status,err);
        
    })
}

function signOut(){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function(){
        localStorage.removeItem('token')    
    })
    $('#register-form').hide()
    $('#todos-pages').hide()
    $('#signoutButtonNavbar').hide()
    $("#heading").show()
    resetFormLogin()
    $('#login-form').show()
    $("#dateForm").empty()
    $("#userName").empty()
}

function showTodos(){
    
    $.ajax({
        url: `http://35.240.172.169/users/${localStorage.id}`,
        method: 'get',
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        // console.log(response,'========');
        $("#todoList").empty()
        $("#urgentTodos").empty()
        let todoList = response.todoList
        // console.log(todoList);
        todoList.forEach(todo => {
            // console.log(todo.urgency);
            let date = new Date(todo.dueDate)
            let dateFix = ''
            dateFix +=  date.getFullYear()
            if(date.getMonth() < 10){
                dateFix+= "-" + '0' + (date.getMonth() +1)
            }else{
                dateFix+= date.getMonth() + 1
            }
            if(date.getDate() < 10){
                dateFix += '-' + '0' + date.getDate()
            }else{
                dateFix+= '-' + date.getDate()
            }   
            if(todo.urgency == "false" || todo.urgency == false){
                if(todo.status == false){
                    $(`#todoList`).append(
                        `<div id="${todo._id}" class="card col s4 offset-s1 lime darken-4 ">
                        <h5> Unfinished </h5>
                        <p>${todo.title}</p>
                        <p>${todo.description}</p>
                        <P>${dateFix}</p>
                        <div class="card-action">
                        <div class=" col s1">
                        <a id="#editTodo href="#" onclick="editTodo('${todo._id}','${todo.title}','${todo.description}','${dateFix}','${todo.urgency}');" ><i class="small material-icons">edit</i></a>
                        </div>
                        <div class=" col s1 offset-s1">
                        <a id="#deleteTodo href="#" onclick="deleteTodo('${todo._id}');"><i class="small material-icons">delete</i></a>
                        </div>
                        <div class=" col s1 offset-s1">
                        <a id="#todoUrgent href="#" onclick="todoUrgent('${todo._id}');"><i class="small material-icons">priority_high</i></a>
                        </div>
                        <div class=" col s1 offset-s1">
                        <a id="#doneTodo href="#" onclick="doneTodo('${todo._id}');"><i class="small material-icons">assignment_turned_in</i></a>
                        </div>
                        </div>  
                        </div>`
                    )
                }else{
                    $(`#todoList`).append(
                        `<div id="${todo._id}" class="card col s4 offset-s1 blue light-3 ">
                        <h5> Done </h5>
                        <p>${todo.title}</p>
                        <p>${todo.description}</p>
                        <P>${dateFix}</p>
                        <div class="card-action">
                        <div class=" col s1 offset-s4">
                        <a id="#deleteTodo href="#" onclick="deleteTodo('${todo._id}');"><i class="small material-icons">delete</i></a>
                        </div>
                        </div>  
                        </div>`
                    )
                }
            }
            else{
                $(`#urgentTodos`).append(
                    `<div id="${todo._id}" class="card col s10 offset-s1 red darken-1 ">
                    <h5> URGENT </h5>                    
                    <p>${todo.title}</p>
                    <p>${todo.description}</p>
                    <P>${dateFix}</p>
                    <div class="card-action">
                    <div class="card-action">
                    <div class=" col s1">
                    <a id="#editTodo href="#" onclick="editTodo('${todo._id}','${todo.title}','${todo.description}','${dateFix}','${todo.urgency}');" ><i class="small material-icons">edit</i></a>
                    </div>
                    <div class=" col s1 offset-s1">
                    <a id="#deleteTodo href="#" onclick="deleteTodo('${todo._id}');"><i class="small material-icons">delete</i></a>
                    </div>
                    <div class=" col s1 offset-s1">
                    <a id="#todoUrgent href="#" onclick="todoUrgent('${todo._id}');"><i class="small material-icons">priority_high</i></a>
                    </div>
                    <div class=" col s1 offset-s1">
                    <a id="#doneTodo href="#" onclick="doneTodo('${todo._id}');"><i class="small material-icons">assignment_turned_in</i></a>
                    </div>
                    </div>
                    </div>
                    </div>`
                )
            }
        });   
    })
    .fail((jqHXR, status)=>{
        console.log(status);
    })
}

function loggedIn(){
    $("#todoList").empty()
    $("#urgentTodos").empty()
    $("#dateForm").empty()
    $('#heading').hide()
    $("#register-form").hide()
    $('#login-form').hide()
    $('#todos-pages').show()
    today()
    resetFormTodo()
    showTodos()
    $("#todo-edit").hide()
    $("#todo-submit").show()
    $('#signoutButtonNavbar').show()
    $("#userName").show()
    userName()
}

function today(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 

    today = yyyy+'-'+mm+'-'+dd;
    $("#dateForm").append(`<input type="date" id="dueDate" min=${today}>
    <label for="todo"></label>`)
}

function resetFormLogin(){
    $("#email-login").val('')
    $("#password-login").val('')
}

function resetFormTodo(){
    $("#new-todo-title").val('')
    $("#new-todo-description").val('')
    $("#dueDate").val('')
}

function editTodo(id,title,desc,dueDate,urgency){
    event.preventDefault()
    $("#todo-submit").hide()
    $("#todo-edit").show();
    // console.log(dateFix);
    // console.log(id,title,desc,dueDate,urgency);
    $("#new-todo-title").val(title)
    $("#new-todo-description").val(desc)
    $("#dueDate").val(dueDate)
    $("#todo-edit").click(()=>{
        event.preventDefault()
        let titleEdit = $("#new-todo-title").val()
        let descriptionEdit = $("#new-todo-description").val()
        let dueDateEdit = $("#dueDate").val()
        $.ajax({
            url: `http://35.240.172.169/todos/${id}`,
            method: 'put',
            data: {
                title : titleEdit,
                description: descriptionEdit,
                dueDate: dueDateEdit,
                urgency: urgency
            },
            headers : {
                token : localStorage.token
            }
        })
        .done(response =>{
            // console.log(response);
            showTodos()
            loggedIn()
        }) 
        .fail((jqHXR,status,err)=>{
            console.log(status,err);
        })
    })
}

function deleteTodo(id){
    console.log(id);
    event.preventDefault()
    $(`#${id}`).hide()
    $.ajax({
        url: `http://35.240.172.169/todos/${id}`,
        method: 'delete',
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        console.log(response);
        // loggedIn()
    }) 
    .fail((jqHXR,status,err)=>{
        console.log(status,err);  
    }) 
}

function doneTodo(id){
    event.preventDefault()
    $(`#${id}`).hide()

    // console.log(id);
    $.ajax({
        url: `http://35.240.172.169/todos/${id}/done`,
        method: 'patch',
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        // console.log(response);
        loggedIn()
    }) 
    .fail((jqHXR,status,err)=>{
        console.log(status,err);  
    }) 
}

function todoUrgent(id){
    event.preventDefault()
    // console.log(id);
    $.ajax({
        url: `http://35.240.172.169/todos/${id}/urgent`,
        method: 'patch',
        headers : {
            token : localStorage.token
        }
    })
    .done(response =>{
        // console.log(response);
        loggedIn()
    }) 
    .fail((jqHXR,status,err)=>{
        console.log(status,err);  
    }) 
}

function randomQuotes() {
    $.ajax({
      url:'https://quota.glitch.me/random',
      method : 'GET'
    })
    .done(response => {
     //  console.log(response)
      $('#quote').text(response.quoteText)
      $('#author').text(response.quoteAuthor)
    })
  }

  function userName(){
      $("#userName").text(
          `${localStorage.firstName} ${localStorage.lastName}`
      )
  }



$(document).ready(function(){
    
    console.log('ready')
    if(!localStorage.token){
        $("#quote").empty()
        $("#author").empty()
        $("#heading").show()
        $('#register-form').hide()
        $('#todos-pages').hide()
        $('#signoutButtonNavbar').hide()
        $('#login-form').show()
        randomQuotes()
    }else{
    loggedIn()
    }
    

    //login user

    $('#Login').click(function(){
        $("input").prop('required',true);
        event.preventDefault()
        let email = $('#email-login').val()
        let password = $('#password-login').val()
        // console.log(email,password),'------------';
        $.ajax({
            url: 'http://35.240.172.169/users/login',
            method: 'post',
            data: {
                email,
                password
            }
        })
        .done(response =>{
            // console.log(response)
            localStorage.setItem('token',response.token)
            localStorage.setItem('id',response.id)
            localStorage.setItem('firstName',response.firstName)
            localStorage.setItem('lastName',response.lastName)
            localStorage.setItem('email',response.email)    
            loggedIn()
        })
        .fail((jqHXR,status) =>{
            console.log(status);   
        })   
    })
    
    
    //register new user

    $('#register').click(function(){
        event.preventDefault()
        let firstName = $('#firstName').val()
        let lastName = $('#lastName').val()
        let email = $('#email').val()
        let password = $('#password').val()
        console.log(firstName,lastName,email,password)
        if(firstName === '' || lastName === ''|| email === '' || password === ''  ){
            console.log('form cannot be empty');
        }else{
            $.ajax({
                url: 'http://35.240.172.169/users/register',
                method: 'post',
                data:{
                    firstName,
                    lastName,
                    email,
                    password
                },
                headers: {
                    "Access-Control-Allow-Origin" : '*'
                }
            })
            .done(response =>{
                $("#heading").hide()
                $('#register-form').hide()
                $('#todos-pages').hide()
                $('#login-form').show()
                // console.log(response);
            })
            .fail((jqHXR, status) =>{
                console.log(err,status);
            })
        }
    })

    //submit new todo
    
    $('#todo-submit').click(()=>{
        event.preventDefault()
        let todoTitle = $("#new-todo-title").val()
        let todoDesc = $("#new-todo-description").val()
        let dueDate = $("#dueDate").val()
        console.log(todoTitle,todoDesc,dueDate,'zzzzzzzzz');
        resetFormTodo()
        // console.log(todoTitle,todoDesc,localStorage);
        if(todoTitle === '' || todoDesc === '' || dueDate === ''){
            console.log('form cannot be empty')
        }else{
            $.ajax({
                url:'http://35.240.172.169/todos',
                method: 'post',
                data : {
                    title : todoTitle,
                    description : todoDesc,
                    dueDate : dueDate,
                    UserId: localStorage.id
                },
                headers: {
                    token : localStorage.token
                }
            })
            .done(function(response){
                // console.log(response,'ppppp');
                $.ajax({
                    url:`http://35.240.172.169/users/${response._id}`,
                    method: 'get',
                    headers: {
                        token : localStorage.token
                    }
                })
                .done(function(response){
                    console.log(response,'xxxxxxxxx');
                    showTodos(response.todoList)  
                })
                .fail((jqHXR,status,err)=>{
                    console.log(status,err);
                })
            })
            .fail(function(jqHXR,status,err){
                console.log(status,err);
            })
        }
    })

    //sign up button on click

    $('#signup').click(()=>{
        $("#login-form").hide()
        $("#heading").show()
        $("#register-form").show()
        randomQuotes()
    })


})

