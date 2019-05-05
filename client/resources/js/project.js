// ================================
// PROJECT
// ================================

function showProjects() {
  console.log("showProjects");

  $("#project-list").empty();

  $.ajax({
    method: "GET",
    url: `${BASE_URL}/api/projects`,
    headers: {
      token: localStorage.token,
    }
  })
    .done((response) => {
      // console.log(response);
      
      for (let i = 0; i < response.length; i++) {
        const projectData = `
          <li class="nav-item">
            <a class="nav-link" href="#" onclick=updateProjectId('${response[i]._id}')>${response[i].name}</a>
          </li>
        `;

        $("#project-list").append(projectData);
      }
    })
    .fail((jqXHR, textStatus) => {
      console.log(textStatus);
    })
}

function addProject(e) {
  e.preventDefault();

  console.log("addProject");

  $.ajax({
    method: "POST",
    url: `${BASE_URL}/api/projects`,
    data: { name: $("#add-project-name").val() },
    headers: {
      token: localStorage.token,
    }
  })
    .done((response) => {
      console.log(response);
      $("#add-project-name").val("");
      showProjects();
    })
    .fail((jqXHR, textStatus) => {
      console.log(textStatus);
    });
}

function updateProjectId(projectId) {
  localStorage.projectId = projectId;

  showTodos();
  showMembers();
  $("#member-list-container").show();
}

function removeProjectId() {
  localStorage.removeItem("projectId");
  showTodos();
  showMembers();
  $("#member-list-container").hide();
  $("#project-name").text("");
  $("#project-creator").text("");
}
