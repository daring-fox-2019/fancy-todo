# Welcome to TodoQue!
Organize your personal task and share your project's tasks with others!

# List of Routes
Route | HTTP | Header(s) | Body | Description | Success Response | Failed Response
--- | --- | --- | --- | --- | --- | --- 
/ | GET | none | none | get all users data | status code 200 and JSON data of TodoQue users | status code 500 and JSON data of error report
/login | POST | none | email: STRING (**required**), password: STRING (**required**) | Logging in into TodoQue via Google or regular login | Status code 200 or 201 (for first time log in using Google sign-in) and JSON Web Token | Status Response 500, 400, or 401 and Error Message
/register | POST | none | name: STRING (**required**), email: STRING (**required**), password: STRING (**required**) | create an account in TodoQue | Status code 201 and JSON data of newly created account | Status code 400 and Error Message
/todo | GET | JSON Web Token generated while logging in | none | Show all todos list of logged in user | Status code 200 and JSON data of todo list | Status code 500, or 401 and JSON data of error report
/todo/:id | GET | JSON Web Token generated while logging in | none | Show one of user's todo | Status Response 200 and JSON data of a todo | Status code 500, or 401 and JSON data of error report
/todo | POST | JSON Web Token generated while logging in |todo: STRING (**required**), start: DATE (**required**), end: DATE (**required**), description: STRING, location: STRING, status: STRING (**Done** or **Not Done**) (**required**) | Add new todo into user's list | Status Code 201 and JSON data of newly added todo | Status code 400, 401, or  500 and JSON data of error report
/todo/:id | PUT | JSON Web Token generated while logging in |todo: STRING (**required**), start: DATE (**required**), end: DATE (**required**), description: STRING, location: STRING, status: NUMBER (**required** | update previously existed todo | Status code 200 and JSON data of update report | Status code 400, 401, or 500 and JSON data of error report
/todo/:id | DELETE | JSON Web Token generated while logging in | none | Delete specific todo | Status code 200 | Status code 401, or 500 and JSON data of error report
/project | GET | JSON Web Token generated while logging in | none | Show list of projects the user involved in | status code 200 and JSON data of user's projects list | status code 401, or 500 and JSON data of error report
/project | POST | JSON Web Token generated while logging in | project: STRING (**required**), desription: STRING (**required**), members: ARRAY (**required**) | Create a project and add projects members | status code 201 and JSON data of newly created project | status code 400, 401, or 500 and JSON data of error report
/project/:id | GET | JSON Web Token generated while logging in | none | Show one project | status code 200 and JSON data of project | Status code 401, or 500 and JSON data of error report
project/:id | PUT | JSON Web Token generated while logging in | project: STRING (**required**), desription: STRING (**required**), members: ARRAY (**required**) | Update/edit a project | status code 201 and JSON data of update report | status code 400, 401, or 500 and JSON data of error report
project/:id | DELETE | JSON Web Token created while logging in | none | Delete a project | status code 200 and JSON data of delete report | status code 401, or 500 and JSON data of error report
project/addMember/:id/:userId | PATCH | none | JSON Web Token created while logging in | add a member into project | status code 201 and JSON data of update report | status code of 400,401, or 500 and JSON data of error report
project/removeMember/:id/:userId | PATCH | none | JSON Web Token created while logging in | remove a member from project | status code 201 and JSON data of update report | status code of 400,401, or 500 and JSON data of error report
project/:id | GET | JSON Web Token created while logging in | none | get all todos data from specific project | status code 200 and JSON data of specific project's todos | status code 401, or 500 and JSON data of error report
project/:id | POST | JSON Web Token generated while logging in | todo: STRING (**required**), start: DATE (**required**), end: DATE (**required**), description: STRING, location: STRING, status: STRING (**Done** or **Not Done**) (**required**) | create a todo related to specific project | status code 201 and JSON data of newly created todo | status code 400, 401, or 500 and JSON data of error report
project/:id/:todoId | PUT | JSON Web Token generated while logging in | todo: STRING (**required**), start: DATE (**required**), end: DATE (**required**), description: STRING, location: STRING, status: STRING (**Done** or **Not Done**) (**required**) | update a todo related to specific project | status code 201 and JSON data of newly updated todo | status code 400, 401, or 500 and JSON data of error report
project/:id/:todoId | DELETE | JSON Web Token generated while logging in | none | delete a todo related to specific project | status code 200 and JSON data of delete report | status code 401, or 500 and JSON data of error report


# Usage
Make sure you have node.js installed on your computer and then run these commands :

 $ npm install express axios bcryptjs cors jsonwebtoken google-auth-library mongoose --save
 
 $ npm install dotenv --save-dev
 
 $ npm run start

access the API via http://localhost:4500/<*--choose from list 