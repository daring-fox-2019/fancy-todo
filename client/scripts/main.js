const serverUrl = 'http://localhost:3000'


//----------------------------------------
// SIMPLE TODO
//---------------------------------------

function createSimpleTodo(e) {
    e.preventDefault()
    const name = $('#todo-name').val()
    const description = $('#todo-description').val()
    const dueDate = $('#todo-duedate').val()

    const create_todo_obj = {name, description, dueDate}
    // console.log(localStorage.fancy_token)
    axios
    .post(serverUrl + '/todos', create_todo_obj, {headers: {token: localStorage.fancy_token}})
    .then(({ data }) => {
        // console.log(data)
        console.log('success creating new Todo')
        getMyTodo()
        swalSuccess('success creating new Todo!')
        $('#todoModal').modal('hide')
    })
    .catch(err => {
        console.log(err)
    })
}

function getMyTodo() {
    showSimpleTodoWrapper()
    hideProjectWrapper()
    hideTodoDetailWrapper()

    axios
    .get(serverUrl+'/todos', {headers: {token: localStorage.fancy_token}})
    .then(({ data }) => {
        // console.log(data)
        
        emptySimpleTodo()
        for(let i = 0; i < data.length; i++) {
            console.log(progressDueDate(data[i].createdAt, data[i].dueDate))
        $('#simple-todo-container').append(`
            <div class="row d-flex justify-content-between py-2">
            <div class="todo-left">
                <div class="container-fuid px-3">
                    <div class="row align-items-center">
                        <i class="fas fa-feather-alt mr-4"></i>
                        <div class="text"> ${data[i].name} </div>
                    </div>
                </div>
            </div>
            <div class="todo-right">
                <div class="container-fluid px-3">
                    <div class="row align-items-center">
                        <div class="progress-bar-container mr-4">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="0"
                                    style="${progressDueDate(data[i])};" aria-valuemin="0" aria-valuemax="100"
                                    id="progress-bar-${data[i]._id}"></div>
                                <!-- $('#progress-bar-${data[i]._id}').css('width', progressDueDate(data[i].createdAt, data[i].dueDate)) -->
                            </div>
                        </div>
                        <div class="text-date mr-3">
                            ${formatDate(data[i].dueDate)}
                        </div>
                        <!-- <a href="#"><i class="fas fa-info-circle mr-1"></i></a>
                            <a href="#"><i class="fas fa-info-circle mr-1"></i></a> -->
                        <a href="#" onclick="showTodoDetail('${data[i]._id}')"><i class="fas fa-ellipsis-h mr-2"></i></a>
                        <a href="#" onclick="doneTodo('${data[i]._id}')" id="done-simple-${data[i]._id}"><i class="fas fa-check mx-2"></i></a>
                        <a href="#" onclick="undoneTodo('${data[i]._id}')" id="undone-simple-${data[i]._id}" style="width: 32px;"><i class="fas fa-times mx-2"></i></a>
                        <a href="#" onclick="deleteTodo('${data[i]._id}')"><i class="fas fa-trash mx-2"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <!-- divider -->
        <hr style="width:100%;">
            `)
            if(data[i].status === true) $(`#done-simple-${data[i]._id}`).hide()
            else $(`#undone-simple-${data[i]._id}`).hide()
        }
    })
    .catch(err => {
        console.log(err)
    })
}

// ---------------------------------
// PROJECT
// ---------------------------------

function createProject(e) {
    e.preventDefault()

    const name = $('#project-name').val()
    const description = $('#project-description').val()

    const create_project = {name, description}
    // console.log(create_project)

    

    axios
    .post(serverUrl+'/projects', create_project, {headers: {token: localStorage.fancy_token}})
    .then(({ data }) => {
        console.log('project created')
        // console.log(data)
        getAllUserProject()
        emptyCreateProjectForm()
        swalSuccess('Success adding new project')
    })
    .catch( err => {
        console.log(err)
    })
}

function getAllUserProject() {
    axios
    .get(serverUrl+'/projects', {headers: {token: localStorage.fancy_token}})
    .then(({ data }) => {
        console.log('data all user project dapat')
        console.log(data)
        emptyProjectList()
  
        for(let i = 0; i < data.length; i++) {
            $('#project-list').append(`
                <div class="container-fluid px-0 border">
                <a href="#" onclick="showProjectDetail('${data[i]._id}')"><div class="pl-2" style="font-size:14px"> <i class="fas fa-genderless"></i> ${data[i].name} </div></a>
                </div>
            `)
        }
    })
    .catch(err => {
        console.log(err)
    })
}

function appendMember(obj) {
    $('#project-detail-members').append(`
    <div id="project-detail-members" class="pr-1">
        <span class="badge badge-pill badge-primary px-1"> ${obj.name} <a href="#" onclick="deleteMember('${obj._id}')" style="color: white;"><i class="fas fa-times-circle"></i></a></span>
    </div>
    `)
}

function appendOwner(obj) {
    $('#project-detail-members').append(`
        <div id="project-detail-members" class="pr-1">
            <span class="badge badge-pill badge-warning px-1">Owner: ${obj.name} <a href="# style="color: white;"></i></a></span>
        </div>
        `)
}

function showProjectDetail(id) {
    hideSimpleTodoWrapper()
    showProjectWrapper()
    hideTodoDetailWrapper()
    

    axios
    .get(serverUrl+'/projects/' + id, {headers: {token: localStorage.fancy_token}})
    .then(({ data }) => {
        console.log(data)
        $('#project-detail-title').text(data.name)
        $('#project-todo-id').val(data._id)
        emptyProjectTodo()

        //append members
        let members = data.members
        $('#project-detail-members').empty()
        
        appendOwner(members[0])
        for(let i = 1; i < members.length; i++) {
            appendMember(members[i])
        }

        let todos = data.todos
        //append todo project
        if (todos.length === 0) {$('#project-todo-container').append(`<p class="py-2">No Project Todos yet, please create one -></p><img src="../assets/create_one.svg" alt="project" style="max-width:600px; max-height: 40vh;">`)}
        for(let i = 0; i < todos.length; i++) {

            $('#project-todo-container').append(`
            <div class="row d-flex justify-content-between py-2">
            <div class="todo-left">
                <div class="container-fuid px-3">
                    <div class="row align-items-center">
                        <i class="fas fa-feather-alt mr-1"></i>
                        <div class="text"> ${todos[i].name} </div>
                    </div>
                </div>
            </div>
            <div class="todo-right">
                <div class="container-fluid px-3">
                    <div class="row align-items-center">
                        <div class="progress-bar-container mr-4">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="0"
                                    style="${progressDueDate(todos[i])};" aria-valuemin="0" aria-valuemax="100"
                                    id="progress-bar-${todos[i]._id}" ></div>
                            </div>
                        </div>
                        <div class="text-date mr-4">
                            ${formatDate(todos[i].dueDate)}
                        </div>

                        <a href="#" onclick="showTodoDetail('${todos[i]._id}')"><i class="fas fa-ellipsis-h mr-2"></i></a>
                        <a href="#" onclick="doneTodo('${todos[i]._id}')" id="done-project-${todos[i]._id}"><i class="fas fa-check mx-2"></i></a>
                        <a href="#" onclick="undoneTodo('${todos[i]._id}')" id="undone-project-${todos[i]._id}" style="width: 32px;"><i class="fas fa-times mx-2"></i></a>
                        <a href="#" onclick="deleteTodoProject('${todos[i]._id}')"><i class="fas fa-trash mx-2"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <!-- divider -->
        <hr style="width:100%;">
            `)
            if(todos[i].status === true) $(`#done-project-${todos[i]._id}`).hide()
            else $(`#undone-project-${todos[i]._id}`).hide()
        }
    })
    .catch(err => {
        console.log(err)
    })
}

function checkMember() {
    const email = $('#project-member-email').val()
    obj_params = {email}
    console.log(obj_params)

    if($('#project-member-email').val() == '') {
        console.log('please enter email')
    } else {
        axios
        .get(serverUrl+'/users', {headers: {token:localStorage.fancy_token}, params: obj_params})
        .then(({ data }) => {
            console.log(data)
            console.log('email foundddddd')

            if($('#project-member-email').val() != '') {
                $('#project-add-member-button').prop('disabled', false)
                $('#project-member-id').val(data[0]._id)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    
}

function addMember(e) {
    e.preventDefault()
    const project_id = $('#project-todo-id').val()
    const member_id = $('#project-member-id').val()
    console.log(member_id)
    console.log(project_id)

    obj_add_member = {addMember: member_id}

    axios
    .patch(serverUrl+'/projects/'+project_id, obj_add_member, {headers: {token:localStorage.fancy_token}})
    .then(({ data }) => {
        console.log(data)
        showProjectDetail(data._id)
    })


    $('#project-member-id').val('')
    $('#project-add-member-button').prop('disabled', true)
}

function deleteMember(member_id) {
    const project_id = $('#project-todo-id').val()
    const obj_delete_member = {deleteMember: member_id}
    console.log(obj_delete_member)

    // console.log(serverUrl+'/projects/'+project_id)
    axios
    .patch(serverUrl+'/projects/'+project_id, obj_delete_member, {headers: {token:localStorage.fancy_token}})
    .then(({ data }) => {
        console.log(data)
        showProjectDetail(data._id)
    })
    .catch(err => {
        console.log(err)
    })

}

function createProjectTodo(e) { //gotopatch in server
    e.preventDefault()
    const project_id = $('#project-todo-id').val()
    const project = $('#project-todo-id').val()

    const name = $('#project-todo-name').val()
    const description = $('#project-todo-description').val()
    const dueDate = $('#project-todo-duedate').val()

    const addTodo = true //key for add Todo
    const inProject = true;
    const project_todo_obj = {name, description, dueDate, inProject, addTodo, project}
    // console.log(project_todo_obj)
    console.log('masuk function')

    axios
    .patch(serverUrl+'/projects/' + project_id, project_todo_obj, {headers: {token: localStorage.fancy_token}})
    .then(({ data }) => {
        console.log('success adding project todo')
        console.log(data)

        emptyCreateTodoProjectForm()
        showProjectDetail(project_id)
        swalSuccess(`Success adding new project todo!`)
    })
    .catch(err => {
        console.log(err)
    })
}

function deleteTodoProject(id) {
    console.log(id)
    const project_id = $('#project-todo-id').val()

    axios
    .delete(serverUrl+'/todos/' + id, {headers:{token:localStorage.fancy_token}})
    .then(({ data }) => {
        console.log(data)
        console.log('----------------------------')
        showProjectDetail(project_id)
        if(data.inProject) {
            axios.patch(serverUrl+'/projects/' + project_id, {deleteTodo: data._id}, {headers: {token:localStorage.fancy_token}})
            .then(({ data }) => {
                console.log('sucess removing todo from projects db')
            })
            .catch(err => {
                console.log('err')
            })
        }
        
    })
    .catch(err => {
        console.log(err)
    })
}

function deleteTodo(id) {
    axios
    .delete(serverUrl+'/todos/' + id, {headers:{token:localStorage.fancy_token}})
    .then(({ data }) => {
        getMyTodo()
    })
    .catch(err => {
        console.log(err)
    })
}

// -------
// BOTH 
// -------

function showTodoDetail(id) {
    // console.log(id)
    // console.log(serverUrl+'/todos/'+id)

    

    axios
    .get(serverUrl+'/todos/'+id, {headers:{token:localStorage.fancy_token}})
    .then(({ data }) => {
        console.log(data)
        showTodoDetailWrapper()
        $('#todo-explanation-title').text(`${data.name}`)
        $('#todo-explanation-status').text(`status: ${data.status}`)
        
        $('#todo-explanation-status').empty()
        if(data.status == true) {
            
            $('#todo-explanation-status').append(`Status: <span class="badge badge-pill badge-success">Done</span>`)
        } else $('#todo-explanation-status').append(`Status: <span class="badge badge-pill badge-danger">Not Done</span>`)

        $('#todo-explanation-description').text(`Description: ${data.description}`)
        $('#todo-explanation-date').text(`Due date: ${formatDate(data.dueDate)},
        Created: ${formatDate(data.createdAt)}`)
    })
    .catch(err => {
        console.log(err)
    })
}

function doneTodo(id) {
    console.log(id)
    obj_change_status = {status: true}
    axios
    .patch(serverUrl+'/todos/' + id, obj_change_status, {headers: {token:localStorage.fancy_token}})
    .then(({ data }) => {
        console.log(data)
        showTodoDetail(id)
        getMyTodo()
    })
    .catch(err => {
        console.log(err)
    })
}

function doneTodoProject(id) {
    console.log(id)
    obj_change_status = {status: true}
    axios
    .patch(serverUrl+'/todos/' + id, obj_change_status, {headers: {token:localStorage.fancy_token}})
    .then(({ data }) => {
        console.log(data)
        showTodoDetail(id)
        showProjectDetail($('#project-todo-id').val())
    })
    .catch(err => {
        console.log(err)
    })
}

function undoneTodo(id) {
    console.log(id)

    obj_change_status = {status: false}
    axios
    .patch(serverUrl+'/todos/' + id, obj_change_status, {headers: {token:localStorage.fancy_token}})
    .then(({ data }) => {
        console.log(data)
        showTodoDetail(id)
        getMyTodo()
    })
    .catch(err => {
        console.log(err)
    })
}

function undoneTodoProject(id) {
    console.log(id)

    obj_change_status = {status: false}
    axios
    .patch(serverUrl+'/todos/' + id, obj_change_status, {headers: {token:localStorage.fancy_token}})
    .then(({ data }) => {
        console.log(data)
        showTodoDetail(id)
        showProjectDetail($('#project-todo-id').val())
    })
    .catch(err => {
        console.log(err)
    })
}


function deleteThisProject() {
    const project_id = $('#project-todo-id').val()
    console.log(project_id)

    axios
    .delete(serverUrl+'/projects/' + project_id, {headers: {token:localStorage.fancy_token}})
    .then(({ data }) => {
        console.log(data)
        getAllUserProject()
    })
    .catch(err => {
        console.log(err)
    })
}