function showTodos() {
  console.log("showTodos");
  $("#table-todos").empty();

  $.ajax({
    method: "GET",
    url: `${BASE_URL}/api/todos/${localStorage.projectId}`,
    headers: {
      token: localStorage.token,
    }
  })
    .done(response => {
      console.log(response);

      for (let i = 0; i < response.length; i++) {
        let newDate = new Date(response[i].dueDate)
          .toLocaleDateString()
          .split("/");
        newDate = dateParser(
          Number(newDate[1]),
          Number(newDate[0]),
          Number(newDate[2])
        );

        const localeDateString = new Date(response[i].dueDate).toLocaleDateString();
        const tableData = `
          <tr id=${response[i]._id}">
            <td style="text-align: center;">${i + 1}</td>
            <td>${response[i].name}</td>
            <td style="word-break: break-word;">${response[i].description}</a></td>
            <td style="text-align: center;">${newDate}</td>
            <td style="text-align: center;"><a href="#" onclick="changeStatus('${response[i].status}', '${response[i]._id}', ${i + 1})" id="changeStatus${i + 1}">❌</td>
            <td style="text-align: center;"><a href="#" onclick="formUpdateTodo('${response[i].name}', '${response[i].description}', '${localeDateString}', '${response[i]._id}', '${response[i].status}')">📝</a></td>
            <td style="text-align: center;"><a href="#" onclick=deleteTodo('${response[i]._id}')>🗑️</a></td>
          </tr>
        `;

        const tableDataDone = `
          <tr id=${response[i]._id}>
            <td style="text-align: center;">${i + 1}</td>
            <td style="text-decoration: line-through; color: rgb(120, 120, 120);">${response[i].name}</td>
            <td style="word-break: break-word; text-decoration: line-through; color: rgb(120, 120, 120);">${response[i].description}</a></td>
            <td style="text-align: center; text-decoration: line-through; color: rgb(120, 120, 120);">${newDate}</td>
            <td style="text-align: center;"><a href="#" onclick="changeStatus('${response[i].status}', '${response[i]._id}', ${i + 1})" id="changeStatus${i + 1}">✔️</td>
            <td style="text-align: center;"><a href="#" onclick="formUpdateTodo('${response[i].name}', '${response[i].description}', '${localeDateString}', '${response[i]._id}', '${response[i].status}')">📝</a></td>
            <td style="text-align: center;"><a href="#" onclick=deleteTodo('${response[i]._id}')>🗑️</a></td>
          </tr>
        `;

        if (response[i].status === "Completed") {
          $("#table-todos").append(tableDataDone);
        } else {
          $("#table-todos").append(tableData);
        }
      }
    })

    .fail((jqXHR, textStatus) => {
      console.log(textStatus);
    });
}

function addTodo(e) {
  e.preventDefault();

  console.log("addTodo");

  let dueDate = $("#add-todo-due-date").val();

  console.log(dueDate);
  if (!dueDate) {
    dueDate = "10/10/2200";
  }

  const data = {
    name: $("#add-todo-name").val(),
    description: $("#add-todo-description").val(),
    dueDate,
    projectId: localStorage.projectId
  };

  $.ajax({
    method: "POST",
    url: `${BASE_URL}/api/todos`,
    data: data,
    headers: {
      token: localStorage.token,
    }
  })
    .done(response => {
      $("#add-todo-name").val("");
      $("#add-todo-description").val("");
      $("#add-todo-due-date").val("");
      $("#table-todos").text("");
      showTodos();
    })

    .fail((jqXHR, textStatus) => {
      console.log(textStatus);

      $("#add-todo-due-date").val("");

      swal({
        title: "Invalid input. Try again",
        icon: "error",
      });
    });
}

function formUpdateTodo(name, description, dueDate, id, status) {
  localStorage.currentTodoId = id;
  localStorage.currentTaskStatus = status;

  $("#update-todo-name").val(name);
  $("#update-todo-description").val(description);
  $("#update-todo-due-date").val(dueDate);
  $("#form-update-todo").modal("show");
  $("#form-update-todo").submit(updateTodo);
}

function updateTodo(e) {
  e.preventDefault();

  console.log("updateTodo");

  $("#form-update-todo").modal("hide").unbind("submit");

  const updatedTodo = {
    name: $("#update-todo-name").val(),
    description: $("#update-todo-description").val(),
    status: localStorage.currentTaskStatus,
    dueDate: $("#update-todo-due-date").val(),
  }

  console.log(updatedTodo);

  $.ajax({
    method: "PUT",
    url: `${BASE_URL}/api/todos/${localStorage.projectId}/${localStorage.currentTodoId}`,
    data: updatedTodo,
    headers: {
      token: localStorage.token,
    },
  })
    .done(response => {
      console.log(response);
      $("#form-update-todo").modal("hide");
      $("#table-todos").text("");
      showTodos();
    })

    .fail((jqXHR, textStatus) => {
      console.log(textStatus);

      swal({
        title: err.responseJSON.message,
        icon: "error",
      });
    })
}

function deleteTodo(todoId) {
  console.log(todoId);
  console.log("deleteTodo");

  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this task",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      if (willDelete) {
        $.ajax({
          method: "DELETE",
          url: `${BASE_URL}/api/todos/${localStorage.projectId}/${todoId}`,
          headers: {
            token: localStorage.token,
          },
        })
          .done(response => {
            $("#table-todos").text("");
            showTodos();
          })
          
          .fail((jqXHR, textStatus) => {
            console.log(textStatus);

            swal({
              title: err.responseJSON.message,
              icon: "error",
            });
          })

        swal("Task has been deleted", {
          icon: "success",
        });
      }
    });
}

function changeStatus(status, todoId, i) {
  console.log("change status")
  console.log(status, todoId, i);

  $.ajax({
    method: "PUT",
    url: `${BASE_URL}/api/todos/${localStorage.projectId}/${todoId}/status`,
    data: { status },
    headers: {
      token: localStorage.token,
    },
  })
    .done(response => {
      $("#table-todos").text("");
      showTodos();
    })

    .fail((jqXHR, textStatus) => {
      console.log(textStatus);

      swal({
        title: err.responseJSON.message,
        icon: "error",
      });
    })
}