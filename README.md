
API Documentation


| Path          | Method        | Request | Success Respond | Error Respond  |
| ------------- |:-------------:| :------:| :-------------: | :------------: |
| /             | GET | none  | 200 | none
| /user         |   GET   |  none  | 200, {data: all user}| 500, {message}
| /user          | POST     |   body : {name, username, email, password}  | 201, {data: created user}| 500, {message}
| /todo      | GET | headers: {token} | 200 {data: user's todo list} | 500, {message} 
| /todo      |POST | headers : {token}, body: {title, description, due_date} | 201 {data: created todo list} | 500, {message} 400, {bad request}
| /todo     |PATCH | headers : {token}, body: {title, status, description, due_date}, params : {id : todoId} | 200 {data: updated todo list} | 500, {message} 400, {bad request}
|/todo      | DELETE | headers: {token}, params : {id : todoId} | 200 {data : deleted data} | 500, {message}
|/weather | GET | params : {lat: latitude, lon: longitude} | 200 {data : weather data} | 500, {message}
|/login | POST | data : {googleToken, email, password} | 200 | 500, {message}