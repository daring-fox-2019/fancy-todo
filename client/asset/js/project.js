function addProject(){
    const name = $('#project-name').val()
    axios.post(`${url}/projects`, { name },{headers: {token}})
    .then(({data}) => {
        getAllUserProject()
        $('#project-name').val('')
        $('#hide-modal-project').click()
        Swal.fire({
            type: "success",
            title: "Add New Project Successfully",
            showConfirmButton: false,
        });
    })
    .catch(err => {
        console.log(err)
    })
}

function fillFormProjectId(project_id, email_admin, name){
    $('#project-id-user-list').val(project_id)

     let emailTags = []
     axios.get(`${url}/users`, {headers : {token}})
     .then(({data}) => {
         data.forEach( el => {
            if(el.email != email_admin){
                emailTags.push(el.email)
            }
         })

         $("#user-name").autocomplete({
            autoFocus: true,
            source: emailTags
          });
     })
     .catch(err => {
         console.log(err)
     })


     axios.get(`${url}/users`, {headers : { project_id, token}})
     .then(({data}) => {
        $('#list-member-project').empty()
        
         data.forEach( el => {
             $('#list-member-project').prepend(`
                <p>${el.name} | ${el.email}${ el.email == email_admin ? '<span style="color:#49beb7"> | <i>Admin</i></span>' : ''}</p>
             `)
         })
         $('#list-member-project').prepend(`<h5 style="color:#49beb7"> List Member :</h5> <hr>`)
     })
     .catch( err => {
         console.log(err)
     })

    
}

function addUserList(){
    const email = $('#user-name').val()
    const project_id =  $('#project-id-user-list').val()

    $('#user-name').val('')
    $('#hide-modal-userlist').click()

    axios.patch(`${url}/users`, {project_id}, {headers : {token, email}})
    .then(({data}) => {
        Swal.fire({
            type: "success",
            title: `Add New Member Success`,
            showConfirmButton: false,
        });
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

function fillDeleteProjectId(project_id){
    $('#delete-project-id').val(project_id)
}

function deleteProject(){
    const project_id = $('#delete-project-id').val()
    axios.delete(`${url}/projects/${project_id}`, {headers : {token}})
    .then(({data}) => {
        $('#content-project-todo').empty()
        $('#hide-modal-deleteproject').click()
        Swal.fire({
            type: "success",
            title: `Delete successfully`,
            showConfirmButton: false,
        });
        getAllUserProject()
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

function getAllUserProject(){
    axios.get(`${url}/users/getone`, {headers: {token}})
    .then(({data}) => {

        $('#container-project-list').empty()
        data.project_list.forEach(element => {
            $('#container-project-list').prepend(
                `
                    <button class="btn btn-outline-success btn-large my-1" style="width:85%" onclick="getAllTodoProject('${element._id}')"> <i class="fas fa-tasks" style="float:left"></i> ${element.name}</button>
                `
            )
        });
        
    })
    .catch( err => {
        console.log(err)
    })
}

function getAllTodoProject(id){
    axios.get(`${url}/projects/${id}`, {headers : {token}})
    .then(({data}) => {

        $('#project-id').val(data._id)

        $('#content-project-todo').empty()
        $('#content-project-todo').append(`
            <div class="container" style="background:white;width:100%;padding-top:80px;margin-top:100px">
                <div class="row container"> 
                <div class="col-8">
                    <h1 style="color:#49beb7"><b>${data.name}</b></h1>
                </div>
                    <div class="col-4 d-flex align-items-center justify-content-end">
                        <button class="btn btn-success float-right btn-sm"  type="button" data-toggle="modal" data-target="#addTaskModal" > <i class="fas fa-plus-square"></i> Add Task</button>
                        <button class="btn btn-success float-right ml-2 btn-sm" type="button"  data-toggle="modal" data-target="#addUserListModal" onclick="fillFormProjectId('${data._id}','${data.user_id.email}','${data.user_id.name}')"> <i class="fas fa-users" style="color:white"></i></i></button>
                        ${data.user_id.email == localStorage.getItem('email') ? `<button class="btn btn-danger float-right ml-2 btn-sm" type="button"  data-toggle="modal" data-target="#deleteProject" onclick="fillDeleteProjectId('${data._id}')"> <i class="fas fa-trash" style="color:white"></i></button>` : ''}
                    </div>  
                </div>
                <hr>
                <div>

                </div>
                
                <div id="container-project-user" class="container">

                </div>
            </div>
        `)
        
        $('#container-project-user').empty()
        data.task.forEach(element => {
          
            $('#container-project-user').append(
                ` 
                <div class="row container">
        <div class="col-1"> <button class="btn btn-outline-success btn-sm" onclick="changeStatus('${element._id}', '${element.status}','${data._id}')">${ element.status == 'new' ? `<i class="fas fa-minus"></i>` : '<i class="fas fa-check"></i>' }</button></div>
                        <div class="col-9"> 
        ${element.status == 'new' ? `<p style="font-size:18px">${element.task}</p>` : `<p style="font-size:18px"><strike>${element.task}</strike></p>` }
                    </div>
    
                    <div class="col-2 row py-1">  
                        <button class="btn btn-outline-dark btn-sm col" data-toggle="modal" data-target="#detail-modal" onclick="showDetail('${element.task}','${element.description}','${element.status}','${element.due_date}','${element.createdAt}','${element.user_id.email}')"> <i class="fas fa-info"></i> </button>
                        <button class="btn btn-outline-dark btn-sm ml-1 col"  data-toggle="modal" data-target="#addTaskModal" onclick="fillEdit('${element.task}','${element.description}', '${element._id}', '${element.due_date}','${element.project_id}')"> <i class="fas fa-cog"></i> </button>
                        <button class="btn btn-outline-dark btn-sm ml-1 col"  onclick="deleteTask('${element._id}','${data._id}')"> <i class="fas fa-trash"></i> </button>
                    </div>
                </div>
                `
            )
        })
        
    })
    .catch( err => {
        console.log(err)
    }) 
}
