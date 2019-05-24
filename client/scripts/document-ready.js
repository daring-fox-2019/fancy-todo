$(document).ready(function() {
    $('#form-todo').submit(createSimpleTodo)
    $('#form-create-project').submit(createProject)
    $('#form-create-todo-project').submit(createProjectTodo)
    $('#form-add-member').submit(addMember)

    getAllUserProject()
    getMyTodo()
})