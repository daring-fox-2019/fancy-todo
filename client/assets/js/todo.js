function todoDone(todoId) {
    console.log('todoDone')
    $.ajax({
        url: `http://localhost:3000/todo/${todoId}`,
        headers: {
            token: localStorage.token
        },
        data:{
            status: 1
        },
        method: "PATCH"
    })
        .done(response => {
            let day = response.finished_at.split("T")[0]
            let time = response.finished_at.split("T")[1].split('.')[0]
            let format = `${day} ${time}`
            let date = moment(format, "YYYY-MM-DD hh:mm").format("LLLL")
            $(`#menu-${response._id}>i`).remove()
            $(`#menu-${response._id}`).append(`<i class="fas fa-check-double"></i>`)
            $(`#menu-${response._id}`).prop("onclick", null)
            $(`#status-container-${response._id}`).append(`<p>Finished at: ${date}</p>`)
            Swal.fire(
                'Good job!',
                `You have done ${response.title}!`,
                'success'
            )
            $(`#status-${response._id}`).text('Done')
        })
        .fail((jqXHR, textStatus) => {
            console.log("request failed", textStatus)
        })
}
function getWelcomeMessage(){
    let hour = new Date().getHours()
    let time = ''
    if(hour < 12)time = "morning"
    else if (hour < 6) time = "afternoon"
    else if (hour <= 24) time = "evening"
    let localDate = new Date().toLocaleDateString()
    let momentDate = moment(localDate, "d/m/YYYY").format("LL")
    let localTime = new Date().toLocaleTimeString()
    let momentTime = moment(localTime, "HH:mm:ss").format("hh:mm a")
    $.ajax({
        url: `http://localhost:3000/user?id=${localStorage.token}`,
        method: "GET",
        headers: {
            token: localStorage.token
        }
    })
    .done(response=>{
        response = response[0]
        $("#welcome").empty()
        $('#welcome').append(`<h3>Good ${time},</h3>
        <h5>${response.name}</h5>
        <div class="row">
            <div class="col s6">
                <h5>${momentDate}</h5>
            </div>
            <div class="col s6">
                <h5>${momentTime}</h5>
            </div>
        </div>`)
    
    })
    .fail((jqXHR, textStatus) => {
        console.log("errorrr nicchhh")
        console.log("request failed", textStatus)
    })
}
function getQuote(){
    getWelcomeMessage()
    $.ajax({
        url: `https://quotes.rest/qod`,
        method: "GET"
    })
    .done(({contents})=>{
        $("#quote").empty()
        $("#quote").append(`<h5>Quote of the Day!</h5>
        <h6>${contents.quotes[0].quote}</h6>
        <span>By ${contents.quotes[0].author}</span>`)
    })
    .fail((jqXHR, textStatus) => {
        console.log("errorrr nicchhh")
        console.log("request failed", textStatus)
    })
}
function fetchTodo() {
    let lat = ''
    let lon = ''
    navigator.geolocation.getCurrentPosition(function (location) {
        lat = location.coords.latitude
        console.log(lat)
        lon = location.coords.longitude
        console.log(lon)
        console.log(location.coords.accuracy)
        $.ajax({
            url: `http://localhost:3000/weather/${lat}/${lon}`,
            method: "GET"
        })
            .done(response => {
                $("#weather").empty()
                $("#weather").append(
                    `
                                <div class="card horizontal transparent" style="border-radius:10px; width: 31em">
                          <div class="card-image">
                            <div class="row" style="margin-top: 24px;margin-left: 36px;">
                                <canvas id="${response.currently.icon}" width="100" height="100">
                                </canvas>
                            </div>
                          </div>
                          <div class="card-stacked">
                            <div class="card-content">
                            <h5>${response.timezone}</h5>
                              <h6>${response.currently.summary}</h6>
                              <h6>${Math.floor((response.currently.apparentTemperature-32)*5/9)}°C</h6>
                            </div>
                          </div>
                        </div>
                                `
                )
                let icons = new Skycons({
                    color: "teal"
                  }),
                    list = [
                      "clear-day", "clear-night", "partly-cloudy-day",
                      "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
                      "fog"
                    ],
                    i;
                  for (i = list.length; i--;)
                    icons.set(list[i], list[i]);
                  icons.play();

            })
            .fail((jqXHR, textStatus) => {
                console.log("errorrr nicchhh")
                console.log("request failed", textStatus)
            })
    })
    $.ajax({
        url: "http://localhost:3000/todo",
        method: "GET",
        headers: {
            token: localStorage.token
        }
    })
        .done(response => {
            response.forEach(element => {
                console.log(element)
                let desc = 'No Description'
                if (element.description) desc = element.description
                //moment feature
                let day = element.created_at.split("T")[0]
                let time = element.created_at.split("T")[1].split('.')[0]
                let format = `${day} ${time}`
                let date = moment(format, "YYYY-MM-DD hh:mm").format('LLLL')
                let status = 'Undone'
                let image = '<i class="fas fa-check"></i>'
                let finished = ''
                let onclick = `onclick="todoDone('${element._id}')"`
                let due_date = moment(`${element.due_date}`, "MMMM d, YYYY")
                if (element.status === 1) {
                    status = "Done"
                    image = `<i class="fas fa-check-double"></i>`
                    let finishedDay = element.finished_at.split("T")[0]
                    let finishedTime = element.finished_at.split("T")[1].split(".")[0]
                    let finishedFormat = `${finishedDay} ${finishedTime}`
                    finished = moment(finishedFormat, "YYYY-MM-DD hh:mm").format("LLLL")
                    finished = `<p>Finished at: ${finished}</p>`
                    onclick = `onclick='')`
                }
                if (element.desc) desc = element.desc
                $("#todo-list").append(`<li class="collection-item id="list-${element._id}">
            <i class="fas fa-pencil-alt"></i>
            <h4 class="title" style="margin-top:0px">${element.title}</h4>
            <h6>${desc}</h6>
            <div id="status-container-${element._id}">
                ${finished}
                <p id=status-${element._id}>${status}</p>
            </div>
            <div class="row">
                <div class="col s6">
                <a id="menu-${element._id}" class="waves-effect waves-light btn-large btn-floating" ${onclick}">${image}</a>
                <a id="delete-${element._id}" class="waves-effect waves-light btn-large btn-floating" style="margin-left:7px; background-color: red; margin-right:7px;" onclick="deleteTodo('${element._id}')"><i class="fas fa-trash-alt"></i></a>
                <a id="edit-${element._id}" class="waves-effect waves-light btn-large btn-floating modal-trigger" href="#edit-form-${element._id}" style="background-color: grey"><i class="far fa-edit"></i></a>
                </div>
                <div class="col s6" id="dates">
                    <div class="row">
                        <p>Created At: ${date}</p>
                        <p>Due Date: ${due_date._i}</p>
                    </div>
                </div>
            </div>
            </li>`)
                // $('#edit-forms>div').remove()
                $('#edit-forms').append(`
                <div id="edit-form-${element._id}" class="modal" style="border-radius: 20px;">
                    <div class="modal-content">
                    <form class="col s12">
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="title-edit-${element._id}" type="text" class="validate" value="${element.title}">
                                <label for="title-edit-${element._id}"></label>
                            </div>
                            <div class="input-field col s12">
                                <textarea id="description-edit-${element._id}" class="materialize-textarea" data-length="100">${element.description}</textarea>
                                <label for="description-edit-${element._id}"></label>
                                <span class="helper-text">Optional</span>
                            </div>
                            <div class="input-field col s6">
                                <input type="text" class="datepicker" placeholder="When is it due?" id="due_date-edit-${element._id}" value="${element.due_date}">
                            </div>
                        </div>
                        <div class="row center-align">
                            <button class="modal-close waves-effect waves-teal btn-flat" onclick="updateTodo('${element._id}')">Done</button>
                        </div>
                </form>
            </div>
                    </div>
                </div>
                `)
            });
            $('.modal').modal();
            $('input#input_text, textarea#description').characterCounter();
            $('.datepicker').datepicker();
        })
        .fail((jqXHR, textStatus) => {
            console.log("errorrr nicchhh")
            console.log("request failed", textStatus)
        })
        getQuote()

}
function updateTodo(todoId){
    console.log(todoId)
    event.preventDefault()
    $.ajax({
        url : `http://localhost:3000/todo/${todoId}`,
        method: "PATCH",
        headers:{
            token : localStorage.token
        },
        data:{
            title : $(`#title-edit-${todoId}`).val(),
            description: $(`#description-edit-${todoId}`).val(),
            due_date: $(`#due_date-edit-${todoId}`).val()
        }
    })
    .done(response=>{
        Swal.fire(
            'Todo Updated!',
            `${response.title} has been updated`,
            'success'
          )
        fetchTodo()

    })
    .fail((jqXHR, textStatus) => {
        console.log("errorrr nicchhh")
        console.log("request failed", textStatus)
        Swal.fire({
            type: 'error',
            title: "Invalid Date",
            text: 'Date must be today or later than today!'
          })
    })
}
function createTodo() {
    event.preventDefault()
    console.log('masuk create todo')
    $("#todo-form").hide()
    console.log($("#description").val())
    $.ajax({
        url: `http://localhost:3000/todo`,
        method: "POST",
        headers: {
            token: localStorage.token
        },
        data: {
            title: $("#title").val(),
            description: $("#description").val(),
            due_date: $("#due_date").val()
        }
    })
        .done(response => {
            console.log(response)
            let day = response.created_at.split("T")[0]
            let time = response.created_at.split("T")[1].split('.')[0]
            let format = `${day} ${time}`
            let date = moment(format, "YYYY-MM-DD hh:mm").format("LLLL")
            let due_date = moment(`${response.due_date}`, "MMMM d, YYYY")
            console.log("INI DUE DATE ABIS BIKIN")
            console.log(due_date)
            let description = "No Description"
            console.log(response.description)
            if (response.description) {
                description = response.description
            }
            $("#todo-list").prepend(`<li class="collection-item" id="list-${response._id}">
        <i class="fas fa-pencil-alt"></i>
        <h4 class="title" style="margin-top:0px">${response.title}</h4>
        <h6>${description}</h6>
        <div id="status-container-${response._id}">
            <p id=status-${response._id}>Undone</p>
        </div>
        <div class="row">
                <div class="col s6">
                <a id="menu-${response._id}" class="waves-effect waves-light btn-large btn-floating" onclick="todoDone('${response._id}')"><i class="fas fa-check"></i></a>
                <a id="delete-${response._id}" class="waves-effect waves-light btn-large btn-floating" style="margin-left:7px; background-color: red; margin-right:7px;" onclick="deleteTodo('${response._id}')"><i class="fas fa-trash-alt"></i></a>
                <a id="edit-${response._id}" class="waves-effect waves-light btn-large btn-floating modal-trigger" href="#edit-form-${response._id}" style="background-color: grey"><i class="far fa-edit"></i></a>
                </div>
                <div class="col s6" id="dates">
                    <div class="row">
                        <p>Created At: ${date}</p>
                        <p>Due Date: ${due_date._i}</p>
                    </div>
                </div>
            </div>
        </li>`)
        $('#edit-forms').append(`
                <div id="edit-form-${response._id}" class="modal" style="border-radius: 20px;">
                    <div class="modal-content">
                    <form class="col s12">
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="title-edit-${response._id}" type="text" class="validate" value="${response.title}" placeholder="Title">
                                <label for="title-edit-${response._id}"></label>
                            </div>
                            <div class="input-field col s12">
                                <textarea id="description-edit-${response._id}" class="materialize-textarea" data-length="100" placeholder="Description">${response.description}</textarea>
                                <label for="description-edit-${response._id}"></label>
                                <span class="helper-text">Optional</span>
                            </div>
                            <div class="input-field col s6">
                                <input type="text" class="datepicker" placeholder="When is it due?" id="due_date-edit-${response._id}" value="${response.due_date}">
                            </div>
                        </div>
                        <div class="row center-align">
                            <button class="modal-close waves-effect waves-teal btn-flat" onclick="updateTodo('${response._id}')">Done</button>
                        </div>
                </form>
            </div>
                    </div>
                </div>
                `)
                $("#title").val("")
                $("#description").val('')
                $("#due_date").val("")
                Swal.fire(
                    'New Todo!',
                    `${response.title} has been added to the list..`,
                    'success'
                  )

        })
        .fail((jqXHR, textStatus) => {
            console.log("errorrr nicchhh")
            console.log("request failed", textStatus)
            Swal.fire({
                type: 'error',
                title: "Invalid Date",
                text: 'Date must be today or later than today!'
              })
        })
}

function deleteTodo(todoId) {
    event.preventDefault()
    $.ajax({
        url: `http://localhost:3000/todo/${todoId}`,
        headers: {
            token: localStorage.token
        },
        method: "DELETE"
    })
        .done(response => {
            Swal.fire({
                title: `${response.title}`,
                type: 'info',
                text: `${response.title} has been deleted!`
            })
            $("#todo-list>li").remove()
            fetchTodo()
        })
        .fail((jqXHR, textStatus) => {
            console.log("errorrr nicchhh")
            console.log("request failed", textStatus)
        })
}



