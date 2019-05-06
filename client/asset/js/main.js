//var url = "http://todo-server.komangmahendra.me";
var url = "http://localhost:4000";

var token = localStorage.getItem('token')

function toHome(){
    $('#home').fadeIn(1000)
    $('#project').hide()
    getAllTaskUser()
}

function deleteTask(id, project_id){
    axios.delete(`${url}/todos/${id}`, {headers : {token}})
    .then(({data}) => {
        $('#container-task-user').empty()
        $("#task-id").val('')

        getAllTaskUser()
        if(project_id){
            getAllTodoProject(project_id)
        }
    })
    .catch( err => {
        console.log(err)
        Swal.fire({
            type: "error",
            title: `${err.response.data.message}`,
            showConfirmButton: false,
        });
    })
}
function toProject(){
    $('#home').hide()
    $('#project').fadeIn(1000)
    getAllUserProject()
}

function showDetail(title, description, status, date, createdAt, createdby){
    $('#detail-title').empty()
    $('#detail-description').empty()
    $('#detail-date').empty()
    $('#detail-status').empty()
    $('#detail-createdat').empty()
    $('#detail-createdby').empty()

 
    $('#detail-title').append(`<span style="color:#49beb7"><h4>${title}</h4></span>`)
    $('#detail-description').append(`description : <span><b>${description}</b></span>`)
    $('#detail-date').append(`due date : <span><b>${moment(date).format("MMM Do YY")}</b></span>`)
    $('#detail-status').append( status == 'done' ? 'status : <span style="color:green"><b>done</b></span>' : 'status :  <span style="color:red"><b>undone</b></span>')
    $('#detail-createdat').append(`created at : <span><b><i>${moment(createdAt).format("MMM Do YY")}</i></b></span>`)
    $('#detail-createdby').append(`created by : <span><b><i>${createdby}</i></b></span>`)
}

function fillEdit(task, description, id, date, project_id){
    $("#task-title").val(task)
    $("#task-description").val(description)
    $("#datepicker").val(moment(date).format("MMM Do YY"))
    $("#task-id").val(id)
    console.log(project_id,'!!!!!!!!!!!!!!!!!!!!!!!!!!')
    $("#task-project-id").val(project_id)
}

function changeStatus(id, status, project_id){
    if(status == 'new'){
        status = 'done'
    } else {
        status = 'new'
    }
    axios.patch(`${url}/todos/${id}`, {status}, {headers : {token}})
    .then(({data}) => {
        $('#container-task-user').empty()
        getAllTaskUser()
        if(project_id){
            getAllTodoProject(project_id)
        }
    })
    .catch( err => {
        console.log(err)
        Swal.fire({
            type: "error",
            title: `${err.response.data.message}`,
            showConfirmButton: false,
        });
    })
}
function getAllTaskUser(){
    axios.get( `${url}/todos`, {headers : {token}})
    .then(({data}) => {
        
        $('#container-task-user').empty()
        for(let i=0; i< data.length;i++){
            if(! data[i].project_id){
                $('#container-task-user').prepend(
                    ` 
                    <div class="row container">
            <div class="col-1"> <button class="btn btn-outline-success btn-sm" onclick="changeStatus('${String(data[i]._id)}', '${data[i].status}')">${ data[i].status == 'new' ? `<i class="fas fa-minus"></i>` : '<i class="fas fa-check"></i>' }</button></div>
                            <div class="col-9"> 
            ${data[i].status == 'new' ? `<p style="font-size:18px">${data[i].task}</p>` : `<p style="font-size:18px"><strike>${data[i].task}</strike></p>` }
                        </div>
                        <div class="col-2 row py-1">  
                            <button class="btn btn-outline-dark btn-sm col" data-toggle="modal" data-target="#detail-modal" onclick="showDetail('${data[i].task}','${data[i].description}','${data[i].status}','${data[i].due_date}','${data[i].createdAt}','${data[i].user_id.email}')"> <i class="fas fa-info"></i> </button>
                            <button class="btn btn-outline-dark btn-sm ml-1 col"  data-toggle="modal" data-target="#addTaskModal" onclick="fillEdit('${data[i].task}','${data[i].description}', '${data[i]._id}', '${data[i].due_date}')"> <i class="fas fa-cog"></i> </button>
                            <button class="btn btn-outline-dark btn-sm ml-1 col"  onclick="deleteTask('${data[i]._id}')"> <i class="fas fa-trash"></i> </button>
                        </div>
                    </div>
                    `
                )
            }
         
        }
    })
    .catch(err => {
        console.log(err)
    })
}
function editTask(){
    const task = $("#task-title").val()
    const description =  $("#task-description").val()
    let due_date =  $("#datepicker").val()
    const id = $("#task-id").val()
    const project_id = $('#task-project-id').val()
    due_date = moment(due_date).toDate();

    if(new Date(due_date) < new Date()){
        Swal.fire({
            type: "error",
            title: `check date input`,
            showConfirmButton: false,
        });
    } else {
        axios.patch( `${url}/todos/${id}`, { task, description, due_date}, {headers : {token}})
        .then(({data}) => {
            $('#hide-modal-add').click()
            $("#task-title").val('')
            $("#task-description").val('')
            $("#datepicker").val('')
            
            $("#task-id").val('')
            Swal.fire({
                type: "success",
                title: "Edit Task Successfully",
                showConfirmButton: false,
            });
            getAllTaskUser()
            if(project_id){
                console.log('hahahahahahahahahaha')
                getAllTodoProject(project_id)
            }
        })
        .catch(err => {
            console.log(err)
            Swal.fire({
                type: "error",
                title: `${err.response.data.message}`,
                showConfirmButton: false,
            });
        })
    }
}
function addTask(){
    projectId = $('#project-id').val()
    let id = $("#task-id").val()
    if(id){
        editTask()
    } else {
        let task = $("#task-title").val()
        let description = $("#task-description").val()
        let due_date = $("#datepicker").val()

        if(new Date(due_date) < new Date()){
            Swal.fire({
                type: "error",
                title: "Check date input",
                showConfirmButton: false
            });
        } else {
            axios.post( `${url}/todos`, { task, description, project_id:projectId, due_date}, {headers : {token}})
            .then(({data}) => {
                $('#hide-modal-add').click()
                $("#task-title").val('')
                $("#task-description").val('')
                $("#datepicker").val('')
                Swal.fire({
                    type: "success",
                    title: "Add Task Successfully",
                    showConfirmButton: false
                });
                getAllTaskUser()
                if(projectId){
                    getAllTodoProject(projectId)
                }
            })
            .catch(err => {
                console.log(err)
                Swal.fire({
                    type: "error",
                    title: `${err.response.data.message}`,
                    showConfirmButton: false,
                });
            })
        }
    }
}
function changeForm(val){
    if(val){
        $("#login").hide();
        $("#register").fadeIn(1000);
    } else {
        $("#login").fadeIn(1000);
        $("#register").hide();
    }
    
}

$('#datepicker-google-start').datepicker();
$('#datepicker-google-end').datepicker();
$('#datepicker').datepicker();

$(document).ready(function() {
    $("form").submit(function(e) {
        e.preventDefault();
    });
    
    moment().format();

    if (localStorage.getItem("token")) {
        $("#login").hide();
        $("#register").hide();
        $("#home").fadeIn(1000);
        $('footer').fadeIn()
        $('#project').hide()
        getAllTaskUser()
        initClient()
    } else {
        $("#home").hide();
        $('footer').hide()
        $('#register').hide()
        $('#project').hide()
    }

    $('#button-google-calendar').click(function() {
        $('html, body').animate({
          scrollTop: $("#container-google-calendar").offset().top
        }, 500)
    })
})