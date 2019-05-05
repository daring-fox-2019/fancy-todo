function initialLoad() {
    getAllUserProject()
    getMyTodo()
    hideProjectWrapper()
}




//--------------
// EMTPY FORM
//--------------

function emptyProjectTodo() {
    $('#project-todo-container').empty()
}

function emptyFormCreateTodoProject() {
    $('#project-todo-name').val('')
    $('#project-todo-description').val('')
    $('#project-todo-duedate').val('')
}

function emptySimpleTodo() {
    $('#simple-todo-container').empty()
}

function emptyProjectList() {
    $('#project-list').empty()
}

function emptyCreateProjectForm() {
    $('#project-name').val('')
    $('#project-description').val('')
    $('#createProjectModal').modal('hide')
}

function emptyCreateTodoProjectForm() {
    $('#project-todo-name').val()
    $('#project-todo-description').val()
    $('#project-todo-duedate').val()
    $('#projectModal').modal('hide')
}

// ----------------------------
// SWAL
//-----------------------------

function swalSuccess(message) {
    Swal.fire({
        // position: 'top-end',
        type: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })
}

function swalError(message) {
    Swal.fire({
        // position: 'top-end',
        type: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })
}

// ----------------------------
// HIDE & SHOW
//-----------------------------

function showLogin() {
    $('.login-overlay').show();
    $('#fancy-todo').hide()
}

function hideLogin() {
    $('.login-overlay').hide();
    $('#fancy-todo').show()
}

function hideProjectWrapper() {
    $('#project-wrapper').hide()
}

function showProjectWrapper() {
    $('#project-wrapper').show()
}

function hideSimpleTodoWrapper() {
    $('#simple-todo-wrapper').hide()
}

function showSimpleTodoWrapper() {
    $('#simple-todo-wrapper').show()
}

function hideTodoDetailWrapper() {
    $('#todo-detail-wrapper').hide()
}

function showTodoDetailWrapper() {
    $('#todo-detail-wrapper').show()
}


// todo detail
// $('#todo-explanation-title')
// $('#todo-explanation-status')
// $('#todo-explanation-descrion')
// $('#todo-explanation-date')


//check member
// $('#form-add-member)
// $('#project-member-email')

//reset