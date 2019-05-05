function showMessageBoard(id) {
    fetchOneProject(id)
    $('#messageBoxModal').html(`
    <div class="modal-content">
    <h5>Group Message Board</h5>
    <div class="chat-container">
    <div class="people-list" id="people-list">
    <h6 style="color:#434651; padding-left:10px"><b>Group Members</b></h6>
    </div>
    <div class="chat">
        <!-- STAR HEADER -->
        <div class="chat-header clearfix">
            <div class="chat-about">
                <div class="chat-with"></div>
                <div class="chat-num-messages"></div>
            </div>
        </div>
        <!-- EHD HEADER -->
        <!-- START LOGS -->
        <div class="chat-history">
            
        </div>
        <!-- END LOGS -->
        <div class="chat-message clearfix">
            <textarea name="message-to-send" id="message-to-send" placeholder="Message To Group"
                rows="3"></textarea>
            <button onclick="sendMsg('${id}')" class="chat-box-btn">Send</button>
        </div>
    </div>
</div>
    <Br>
    <Br>
    </div>`)
}


function sendMsg(id) {
    let message = $('#message-to-send').val()
    if (message == '') {
        M.toast({html : 'Cannot pin empty message!'})
    } else {
        $.ajax({
            url : `${baseURL}/projects/msg/${id}`,
            type : 'PATCH',
            headers: {
               token: localStorage.getItem('token'),
           },
           data : {
            message
           }
        })
        .done(function(response) {
            $('#message-to-send').val('')
    
            console.log(response);
            let lastmsg = response.messageList[response.messageList.length-1]
            console.log(lastmsg);
            
            let chatUl = ` <ul>`
            chatUl += ` 
            <li>
            <div class="message-data align-left">
            Pin from : <span class="message-data-name">${localStorage.getItem('firstName')}</span> on <span class="message-data-time">${moment(lastmsg.date).format('MMMM Do YYYY, h:mm:ss a')}</span> &nbsp; &nbsp;
            </div>
            <div class="message my-message float-left">
            ${lastmsg.message}
            </div>
             </li>`
        
        chatUl += `</ul>`
        $('.chat-history').append(chatUl)
        $('.chat-num-messages').html(`already ${response.messageList.length} messages`)
    
        })
        .fail(function (err, textStatus) {
    
            swal({
                text: 'Something is wrong',
                icon: "warning",
                button: "Understood",
            });
        })

    }

}
