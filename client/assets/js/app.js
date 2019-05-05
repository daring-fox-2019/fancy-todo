function login(email, password) {
    $.ajax({
        url: `http://localhost:3000/api/users/signin`,
        method: `POST`,
        data: {
            email,
            password
        }
    })
    .done(function(response) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('name', response.name)
        localStorage.setItem('id', response.id)

        renderLoggedInPage()
    })
    .fail(function(jqXHR, textStatus) {
        console.log(textStatus);
    })
}

function register(email,name,password) {
    $.ajax({
        url: `http://localhost:3000/api/users/signup`,
        method: `POST`,
        data: {
            email,
            name,
            password
        }
    })
    .done(function(response) {
        $("#register__page").hide()
        $("#login__page").show()
    })
    .fail(function(jqXHR, textStatus) {
        console.log(textStatus);
    })
}

function fetchTodo() {
    $.ajax({
        url: `http://localhost:3000/api/todos`,
        method: `GET`,
        headers: {
            token: localStorage.token,
            id: localStorage.id
        }
    })
    .done(function(response) {
        $("#member__card-container > div").remove()

        response.forEach(todo => {
            $("#member__card-container").append(
                `
                <div class="card">
                    <div class="card-content">
                        <div>
                            <h6 data-name="${todo.name}">${todo.name}</h6>
                            <p data-description="${todo.description}">${todo.description}</p>
                        </div>
                        <div>
                            <div data-id="${todo._id}" data-toggle="modal" data-target="#editTodoModal" onclick="editTodo('${todo._id}', '${todo.name}', '${todo.description}', ${todo.status}, '${todo.due_date}')">Edit</div>
                            <div data-id="${todo._id}" onclick="deleteTodo('${todo._id}')">Delete</div>
                        </div>
                    </div>
                </div>
                `
            )
        });
    })
    .fail(function(jqXHR, textStatus) {
        console.log(textStatus);
    })
}

function clearTodoInputForm() {
    $("#todo__name").val('')
    $("#todo__description").val('')
    $("#todo__due_date").val('')
}

function clearEditTodoInputForm() {
    $("#edit-todo__name").val('')
    $("#edit-todo__description").val('')
    $("#edit-todo__due_date").val('')
}

function editTodo(id, name, desc, status, due_date) {
    $("#edit-todo__name").val(name)
    $("#edit-todo__description").val(desc)
    $("#edit-todo__due_date").val(due_date)
    $("#edit-todo__id").val(id)
}

function deleteTodo(todoId) {
    const id = todoId

    $.ajax({
        url: `http://localhost:3000/api/todos/${id}`,
        method: `DELETE`,
        headers: {
            token: localStorage.token
        }
    })
    .done(function(response) {
        if(response) {
            fetchTodo()
        }
    })
    .fail(function(jqXHR, textStatus) {
        console.log(textStatus);
    })
}

function renderLoggedInPage() {
    if(localStorage.token) {
        $("#landing__page").hide()
        $("#login__page").hide()
        $("#register__page").hide()
        $("#member__page").show()
        $("#navbar").show()
        $("#member__welcome").text(`Welcome, ${localStorage.name}`)

        fetchTodo()
    }else {
        $("#landing__page").show()
        $("#login__page").hide()
        $("#register__page").hide()
        $("#member__page").hide()
        $("#navbar").hide()
    }
}

$(document).ready(function() {  
    renderLoggedInPage()

    $("#landing__login-btn").on('click', function() {
        $("#login__page").show()
        $("#landing__page").hide()
    })

    $("#landing__register-btn").on('click', function() {
        $("#login__page").hide()
        $("#landing__page").hide()
        $("#register__page").show()
    })

    $("#init-create").on('click', function() {
        $("#todo___create-btn").show()
        $("#todo___edit-btn").hide()
    })
    
    $("#createTodoForm").submit(function(e) {
        e.preventDefault();
        
        const id = localStorage.id
        const name = $("#todo__name").val()
        const description = $("#todo__description").val()
        const due_date = $("#todo__due_date").val()

        $.ajax({
            url: `http://localhost:3000/api/todos`,
            method: `POST`,
            data: {
                name, description, due_date, id
            },
            headers: {
                token: localStorage
            }
        })
        .done(function(response) {
            $('#createTodoModal').modal('hide');
            clearTodoInputForm();
            fetchTodo()
        })
        .fail(function(jqXHR, textStatus) {
            console.log(textStatus);
        })
    })

    $("#editTodoForm").submit(function(e) {
        e.preventDefault();
        
        const id = $("#edit-todo__id").val()
        const name = $("#edit-todo__name").val()
        const description = $("#edit-todo__description").val()
        const due_date = $("#edit-todo__due_date").val()

        $.ajax({
            url: `http://localhost:3000/api/todos/${id}`,
            method: `PATCH`,
            data: {
                name, description, due_date
            },
            headers: {
                token: localStorage.token
            }
        })
        .done(function(response) {
            console.log(response);
            $('#editTodoModal').modal('hide');
            fetchTodo()
        })
        .fail(function(jqXHR, textStatus) {
            console.log(textStatus);
        })
    })

    $("#searchTodo").submit(function(e) {
        e.preventDefault()

        const searchTodo = $("#todoSearchValue").val()

        $.ajax({
            url: `http://localhost:3000/api/todos/search?name=${searchTodo}`,
            type: `GET`,
            headers: {
                token: localStorage.token
            }
        })
        .done(function(todos) {
            // console.log(response);
            // $('#editTodoModal').modal('hide');
            // fetchTodo()
            $("#member__card-container > div").remove()

            todos.forEach(todo=> {
                $("#member__card-container").append(
                    `
                    <div class="card">
                        <div class="card-content">
                            <div>
                                <h6 data-name="${todo.name}">${todo.name}</h6>
                                <p data-description="${todo.description}">${todo.description}</p>
                            </div>
                            <div>
                                <div data-id="${todo._id}" data-toggle="modal" data-target="#editTodoModal" onclick="editTodo('${todo._id}', '${todo.name}', '${todo.description}', ${todo.status}, '${todo.due_date}')">Edit</div>
                                <div data-id="${todo._id}" onclick="deleteTodo('${todo._id}')">Delete</div>
                            </div>
                        </div>
                    </div>
                    `
                );
            })

        })
        .fail(function(jqXHR, textStatus) {
            console.log(textStatus);
        })
    })

    $("#login__form").submit(function(e) {
        e.preventDefault()

        const email = $("#login__email").val()
        const password = $("#login__password").val()

        login(email, password)
    })

    $("#register__form").submit(function(e) {
        e.preventDefault()

        const email = $("#register__email").val()
        const password = $("#register__password").val()
        const name = $("#register__name").val()

        register(email, name, password)
    })

    $('#navbar__logout-btn').on('click', function() {
        localStorage.removeItem('token')
        renderLoggedInPage()
    })
})