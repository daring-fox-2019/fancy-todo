### Fancy To-Do

API Documentation

**URLs**

```
Client URL : http://localhost:8080
Server URL : http://localhost:3000
```

## Usage

Make sure you have Node.js and npm in your computer and then run `npm install`.

In order to get access to all of the routes, you will need a `JWT(JSON Web Token) Token` which will be generated automatically after you sign in successfully.

Run `nodemon app.js or npm run dev` to start the server.

Run `live-server --host=localhost` to start the client



### List of To-Do Routes

| Route            | HTTP       | Headers(s)                                                   | Body                                                     | Description                             | Response Success                                             | Response Error   |
| ---------------- | ---------- | ------------------------------------------------------------ | -------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------ | ---------------- |
| `/todos`         | **GET**    | An Authenticated JWT Token                                   | none                                                     | Get all todo list by authenticated user | Show all the todo list in `array of object` :<br> [{ _id: ObjectId, title: String, description: String,dueDate: date,createdAt:Date, type:String [ObjectId],userId:ObjectId,projectId:ObjectId}] with status code 200 | Status code 500  |
| `/todos/:todoId` | **GET**    | An Authenticated JWT Token                                   | None                                                     | Get specific todo by Id                 | Show todo  in `object` : { _id: ObjectId, title: String, description: String,dueDate: date,createdAt:Date, type:String [ObjectId],userId:ObjectId,projectId:ObjectId} with status code 200 | Status code 500  |
| `/todos`         | **POST**   | An Authenticated JWT Token                                   | title: String,<br>description: String,<br>dueDate: Date  | Create new todo                         | Show the created todo in `object` :{ _id: ObjectId, title: String, description: String,dueDate: date,createdAt:Date, type:String [ObjectId],userId:ObjectId,projectId:ObjectId} with status code 201 | Status code: 500 |
| `/todos/:todoId` | **DELETE** | An Authenticated JWT Token, Authorization Token              | None                                                     | Delete specific todo                    | Show the deleted todo in `object` :{ _id: ObjectId, title: String, description: String,dueDate: date,createdAt:Date, type:String [ObjectId],userId:ObjectId,projectId:ObjectId} with status code 200 | Status code: 500 |
| `/todos/:todoId` | **PATCH**  | An Authenticated JWT Token, Authorization of a Project Member | title: String,<br/>description: String, dueDate : String | Update specific todo                    | Show the updated todo in `object` :{ _id: ObjectId, title: String, description: String,dueDate: date,createdAt:Date, type:String [ObjectId],userId:ObjectId,projectId:ObjectId} with status code 200 | Status code 500  |



### List of User Routes

| Route | HTTP | Headers(s) | Body | Description | Response Success | Response Error |
| ----- | ---- | ---------- | ---- | ----------- | ---------------- | -------------- |
| `/users/signin/local` | **POST** | none       | email: String (**required**),  password: String (**required**) | Log in as registered user | Show response  in `object` : { _id: ObjectId, token: String, firstName: String, lastName:String} with status code 200 | Status code 500 |
| `/users/signin/google` | **POST** | None       | id_Token (gained from google)                                | Log in as registered user | Show response  in `object` : { _id: ObjectId, token: String, firstName: String, lastName:String} with status code 200 | Status code 500 |
| `/users/register` | **POST** | none | firstName:string(**required**), lastName:string(**required**),email: String (**required**),  password: String (**required**) | Register as new user | Response an`object` {_id, email} | Status code 500 |



### List Of Projects Routes

| Route | HTTP | Headers(s) | Body | Description | Response Success | Response Error |
| ----- | ---- | ---------- | ---- | ----------- | ---------------- | -------------- |
| `/projects/` | **GET** | An Authenticated JWT Token | None | Get user's projects | Show response  in `array of object`  : [{ _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]}] with status code 200 | Status code : 500 |
| `/projects/:projectId` | **GET** | An Authenticated JWT Token | None | Get project by ID | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 200 | Status code : 500 |
| `/projects/:projectId` | **POST** | An Authenticated JWT Token | None | Create new project | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 200 | Status code : 500 |
| `/projects/:projectId` | **PATCH** | An Authenticated JWT Token, Authorized Project Owner | name:String(**required**) | Update a project | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 201 | Status code 500 |
| `/projects/:projectId` | **DELETE** | An Authenticated JWT Token, Authorized Project Owner | None | Delete selected project | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 200 | Status code 500 |
| `/projects/:projectId/:memberId` | **DELETE** | An Authenticated JWT Token, Authorized Project Owner | None | Delete selected member from a project | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 200 | Status code 500 |
| `/projects/invite/:memberId` | **PATCH** | An Authenticated JWT Token, Authorized Project Member | None | Invite member by email | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 200 | Status code 500 |
| `/projects/accept/:projectId` | **PATCH** | An Authenticated JWT Token | None | Accept project Invitation | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 200 | Status code 500 |
| `/projects/decline/:projectId` | **PATCH** | An Authenticated JWT Token | None | Decline project invitation | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 200 | Status code 500 |
| `/projects/todo/:projectId` | **POST** | An Authenticated JWT Token | ritle: String,<br/>description: String,dueDate: Date, assigneeEmail:String | Create new todo in Project | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 201 | Status code 500 |
| `/projects/todo/:projectId/:todoId` | **DELETE** | An Authenticated JWT Token | None | Delete todo in this project | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 200 |  
| `/projects/member/pending` | **GET** | An Authenticated JWT Token | None | Check member as pending members | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 200 | Status code 500 |
| `/projects/msg/:projectId` | **PATCH** | An Authenticated JWT Token, Authorized Project Member | message:string(**required**) | Post/Pin new message for specified project | Show response  in `object` : { _id: ObjectId, members:[ObjectId], pendingMembers: [ObjectId], createdBy:ObjectId, messageList:[date:Date, message:String, userId:ObjectId]} with status code 200 | Status code 500 |
