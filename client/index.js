function formatDate(date) {
    let d = new Date(date)
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function formatStatus(str) {
    if(str === "notdone") {
        return "In progress"
    } else {
        return "Complete"
    }
}

function loginlogout() {
    event.preventDefault()
    $("#login-form").toggle()
}

function showregister() {
    event.preventDefault()
    $("#register-form").toggle()
}

function buttons(id) {
    return `<a class="crudbutton" href="complete" onclick="completetodo('done','${id}')">Complete</a>&nbsp;&nbsp;<a class="crudbutton" href="delete" onclick="deletetodo('${id}')">Delete</a>`
}

function register(event) {
    event.preventDefault()

    const output = $("#register-data").serializeArray()

    $.ajax({
        url: "http://localhost:3000/user",
        method: "POST",
        data: output
    })
    .done(() => {
        console.log("Registered successfully")
    })
    .fail((jqXHR, textStatus) => {
        console.log("Failed", textStatus)
    })
}

function login(event) {
    event.preventDefault()

    const output = $("#login-data").serializeArray()

    $.ajax({
        url: "http://localhost:3000/user/login",
        method: "POST",
        data: output
    })
    .done((obj) => {
        if(obj.loggedIn) {
            console.log(obj.token)
        }
        else {
            console.log("Invalid username/password")
        }
    })
    .fail((jqXHR, textStatus) => {
        console.log("Failed", textStatus)
    })
}

function showAll(status, deletetodos) {
    let route = "http://localhost:3000/todo"
    if(status) {
        route += `/${status}`
    }

    if(deletetodos) {
        $(".todo").remove();
    }

    $.ajax({
        url: route,
        method: "GET",
    })
    .done(response => {
        for(let todo of response) {
            console.log(todo)
            let id = todo._id

            $("#todolist").append(`<div id="${id}" class="todo">Task name: ${todo.name}<br>Status: ${formatStatus(todo.status)}<br>Description: ${todo.description}<br>Due Date: ${formatDate(todo.dueDate)}<br><br>${buttons(id)}</div>`)
        }
    })
    .fail((jqXHR, textStatus) => {
        console.log(textStatus)
    })
}

function createTodo(event) {
    event.preventDefault()
    
    const output = $("#newtodo-form").serializeArray()

    $.ajax({
        url: "http://localhost:3000/todo",
        method: "POST",
        data: output

    })
    .done((todo) => {
        let id = todo._id
            
        $("#todolist").append(`<div id="${id}" class="todo">Task name: ${todo.name}<br>Status: ${formatStatus(todo.status)}<br>Description: ${todo.description}<br>Due Date: ${formatDate(todo.dueDate)}<br><br>${buttons(id)}</div>`)
    })
    .fail((jqXHR, textStatus) => {
        console.log("Failed", textStatus)
    })
}

function completetodo(done, id) {
    event.preventDefault()

    $.ajax({
        url: `http://localhost:3000/todo/${id}`,
        method: "PUT",
        data: {status: done}

    })
    .done((updated) => {
        console.log(updated)
        let str = $(`#${id}`).html()
        let changed = str.replace("In progress", "Complete")
        $(`#${id}`).html(changed)
    })
    .fail((jqXHR, textStatus) => {
        console.log("Failed", textStatus)
    })
}

function deletetodo(id) {
    event.preventDefault()

    $.ajax({
        url: `http://localhost:3000/todo/${id}`,
        method: "DELETE"
    })
    .done((deleted) => {
        console.log(deleted)
        $(`#${id}`).remove()
    })
    .fail((jqXHR, textStatus) => {
        console.log("Failed", textStatus)
    })
}

$(document).ready(function () {

    $("#register-data").submit(event => {
        register(event);
        $("#register-form").toggle()
    })

    $("#login-data").submit(event => {
        login(event);
        $("#login-form").toggle()
    })

    $("#create").on("click", event => {
        event.preventDefault()
        $("#create-form").toggle()
    })

    showAll()

    $("#newtodo-form").submit(event => {
        createTodo(event);
        $("#create-form").toggle()
    })
})