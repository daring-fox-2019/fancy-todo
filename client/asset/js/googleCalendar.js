
var CLIENT_ID = '615722240425-d7oh56nimd7c2nli23i2fq2n0meb1rfr.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAS-_vOxCs_KnS7Eo2y_pfKeYcYpOQRkpU';

var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');


function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    $('#add-event-calendar').show()
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    $('#add-event-calendar').hide()
    $('#container-google-calendar').empty()
  }
}


function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}


function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}


function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 20,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    //appendPre('Upcoming events:');

    $('#container-google-calendar').empty()
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }

        $('#container-google-calendar').prepend(`
        <div>
            <p> <span style="font-size:20px"> <b>${events.length-i} . ${event.summary} </b></span> - <span style="color:#519E8A">${moment(when).format("MMM Do YY")} </span></p>
        </div>
        `)
        //appendPre(event.summary + ' (' + when + ')')
      }
    } else {
      //appendPre('No upcoming events found.');
        $('#container-google-calendar').prepend(`
            <p style="font-size:25px;color:#55545C"><b>No upcoming events found ... </b></p>
        `)
    }
  });
}


function addEvent(){
    const summary = $('#summary-google').val()
    const location = $('#location-google').val()
    const description = $('#description-google').val()
    let start = $('#datepicker-google-start').val()
    let end = $('#datepicker-google-end').val()

    start = new Date(start)
    end = new Date(end)

    console.log(start<end, start < new Date(), end < new Date())
    if( ! (start < end || (start < new Date()) || (end < new Date()))){
        Swal.fire({
            type: "error",
            title: "Check Your Date",
            text: 'Re-check your date input',
            showConfirmButton: false,
        });

        $('#datepicker-google-start').val('')
        $('#datepicker-google-end').val('')
    } else {
        var event = {
            'summary': summary,
            'location': location,
            'description': description,
            'start': {
              'dateTime': start,
              'timezone': 'Asia/Jakarta'
            },
            'end': {
              'dateTime': end,
              'timezone': 'Asia/Jakarta'
            },
            'reminders': {
              'useDefault': false,
              'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10}
              ]
            }
          };
    
    
        let request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
        });
    
        request.execute(function(event) {
            listUpcomingEvents()
            Swal.fire({
                type: "success",
                title: "Add Event Successfully",
                text: 'Check Your Google Calendar',
                showConfirmButton: false,
            });

            $('#summary-google').val()
            $('#location-google').val()
            $('#description-google').val()
            $('#datepicker-google-start').val()
            $('#datepicker-google-end').val()
            $('#hide-modal-google-add-event').click()
        });

    }
}

