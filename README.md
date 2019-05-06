# fancy-todo

### User routes:

| Routes        | HTTP           | Header(s) | Body| Respons | Description |
|-------------|-------------|-----|----|----|---|
| `/users` | GET | none | none |  Success: [ {object} ], <br />Error: Internal server error | Get all users
| `/users` | POST | none | name: String<br />email: String<br />password:String |  Success: {object}, <br />Error: Internal server error | Sign up user | 
| `/users/login` | POST | none | email: String<br/> password:String |  Success: {object}, <br />Error: Internal server error | Sign in via email| 
| `/users/googleLogin` | POST | none | email: String<br/> password:String |  Success: {object}, <br />Error: Internal server error | Sign in via googles | 

### Todo routes: 
| Routes        | HTTP           | Header(s) | Body |  Respons | Description |
|-------------|-------------|-----|----|----|---|
| `/todos/:id` | GET | none | none | Success:  {object}, <br />Error: Internal server error | Get detail task  |
| `/todos` | GET | token: String | none | Success: [ {object} ], <br />Error: Internal server error | Get all user task  | 
| `/todos` | POST | token: String | name:String<br>due_date:Date <br>description:String  <br> | Success:  {object}, <br />Error: Internal server error  | Create a new todo| Create new task |
| `/todos/:id` | PUT | token: String | name:String<br>due_date:Date <br>description:String  <br> |  Success:  {object}, <br />Error: Internal server error  | Update a todo base of id | 
| `/todos/:id` | PATCH | token: String | status: Boolean |  Success:  {object}, <br />Error: Internal server error  | Update status a todo base of id |
| `/todos/:id` | DELETE | token: String | none | Success:  {object}, <br />Error: Internal server error  | Delete a todo base of id | 

### Project routes: 
| Routes        | HTTP           | Header(s) | Body |  Respons | Description |
|-------------|-------------|-----|----|----|---|
| `/projects` | GET | token: String | none | Success:  [{object}], <br />Error: Internal server error | Get  all project a user  |
| `/projects` | POST | token: String | name:String| Success : Success:  {object}, <br />Error: Internal server error  | Create a new todo| Create new project |
| `/projects/addMember/:id` | POST | token: String | idUser: String | Success: {object}, <br />Error: Internal server error | Add member on project  | 
| `/projects/deleteMember/:id` | POST | token: String | idUser: String | Success: {object}, <br />Error: Internal server error | Delete member on project  | 
| `/projects/:id` | GET | token: String | none | Success:  [{object}], <br />Error: Internal server error | Get a project a user  |
| `/projects/:id` | PUT | token: String | name:String |  Success:  {object}, <br />Error: Internal server error  | Update a project base of id | 
| `/projects/:id` | DELETE | token: String | none | Success:  {object}, <br />Error: Internal server error  | Delete a peoject base of id | 

## Usage
Make sure Node.js is installed in your computer then run these commands:

```javascript
npm install
npm run dev
