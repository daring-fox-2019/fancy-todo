# fancy-todo

### User routes:

| Routes        | HTTP           | Header(s) | Body| Respons | Description |
|-------------|-------------|-----|----|----|---|
| /api/users | POST | none | name: String<br />email: String<br />password:String | Success : Create user success, Error : Internal Server Error | register user | 
| /api/users/login | POST | none | id:String<br/> password:String | Success : Login success, Error : Internal Server Error | login via email| 
| /api/users/googleLogin | POST | none | id:String<br/> password:String | Success : Login success, Error : Internal Server Error | login via googles | 

### Todo routes: 
| Routes        | HTTP           | Header(s) | Body |  Respons | Description |
|-------------|-------------|-----|----|----|---|
| /api/todo | GET | none | none | Success : Get task data success, Error : Internal Server Error | Get all the task  | 
| /api/todo/:id | GET | none | none | Success : Get task data success, Error : Internal Server Error | Get detail task  |
| /api/todo | POST | none | name:String  <br>due_date:Date <br>description:String  <br> | Success : Create task success, Error : Create task failed  | Create a new todo| Create new task 
| /api/todo/:id | DELETE | none | id:String |  Success : Delete task success, Error : Delete task failed  | Delete a todo base of id | 
| /api/todo/:id | PUT | none | id:String |  Success : Update task success, Error : Update task failed  | Update a todo base of id | 
| /api/todo/:id | PATCH | none | id:String |  Success : Update status task success, Error : Update status task failed  | Update status a todo base of id |



## Usage
Make sure Node.js is installed in your computer then run these commands:

```javascript
npm install
npm run dev
