// ================================
// MEMBER
// ================================

function showMembers() {
  console.log("showMembers");

  $("#member-list").empty();

  if (localStorage.projectId) {
    $.ajax({
      method: "GET",
      url: `${BASE_URL}/api/projects/${localStorage.projectId}`,
      headers: {
        token: localStorage.token,
      }
    })
      .done((response) => {
        console.log(response);
  
        response.members.forEach((member) => {
          const memberData = `
            <div class="col-12">
              ${member.username}
            </div>
          `;
  
          $("#member-list").append(memberData);
        })

        $("#project-name").text(response.name);
        $("#project-creator").text(`Creator: ${response.creator.username}`);
      })
      .fail((jqXHR, textStatus) => {
        console.log(textStatus);
      });
  }
}

function addMember(e) {
  e.preventDefault();

  console.log("addMember");
  console.log(localStorage.projectId);

  $.ajax({
    method: "PATCH",
    url: `http://localhost:3000/api/projects/${localStorage.projectId}/add-member`,
    data: { name: $("#add-member-name").val() },
    headers: {
      token: localStorage.token,
    }
  })
    .done((response) => {
      console.log(response);
      $("#add-member-name").val("");
      showMembers();
    })
    .fail((jqXHR, textStatus) => {
      console.log(textStatus);
      // console.log(jqXHR.responseJSON);

      $("#add-member-name").val("");

      swal({
        title: jqXHR.responseJSON.message,
        icon: "error",
      });
    });
}