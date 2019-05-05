# fancy-todo
End Route Documentation : 

| Routes           | HTTP   | Header(s) | Body                                                         | Response                                                     | Description                                                 |
| ---------------- | ------ | --------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| `/signin   `        | `POST`   | `none`      | **email**(required) : String, **password**(required) : String | **Success** : (200) show task of authenticated user, **Error** : (500) : Internal Server Error | User can login                                              |
| `/googlesignin   `       | `POST`   | `none`      | **email**(required) of Gmail, **password**(required) of Gmail | **Success** : (200) show task of authenticated user, **Error** : (500) : Internal Server Error | User can login with Google email                            |
| `/register`        | `POST`   | `none`      | **email**(required) : String, **password**(required) : String | **Success** : (200) show login form**Error** : (500) : Internal Server Error | User signing up as a new user                               |
| `/todos`    | `POST`   | `token`     | **name**(required) : String, **dueDate** : Date, **description**: String, **Status** : String, **userId** : ObjectId | **Success** : (200) Created a new task **Error** : (500) : Internal Server Error | Create a new task                                           |
| `/todos`   | `GET` | `token`   |   none    | **Success** : (200) Fetch Data **Error** : (500) : Internal Server Error  | Show all tasks for authenticated user
| `/todos/showTips `       | `GET`    | `token`     | none                                                         | **Success** : (200) Fetch Data **Error** : (500) : Internal Server Error | Show video Tips from youtube                   |
| `/todos/:id` | `PATCH`    | `token`     | none                                                         | **Success** : (200) Updated status and completedAt **Error** : (500) : Internal Server Error | Updating a name, description,status and due date |
| `/todos/:id` | `DELETE` | `token`     | none                                                         | **Success** : (200) The task has been removed, **Error** : (500) : Internal Server Error | Remove the task                                             |

### Project Route

| Routes           | HTTP   | Header(s) | Body                                                         | Response                                                     | Description                                                 |
| ---------------- | ------ | --------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| `/todoprojects/invite   `        | `POST`   | `token`      | **projectId**:string, **email_user** : string | **Success** : (200) show modals of invited projects, **Error** : (500) : Internal Server Error | User can either accept or decline invited project                                            |
| `/todoprojects/new  `        | `POST`   | `token`      | **nameProject** : String   | **Success** : (201) Create a New Project, **Error** : (500) : Internal Server Error | User created a new project                                            |
| `/todoproject  `        | `GET`   | `token`      | `none` | **Success** : (200) Show User Project, **Error** : (500) : Internal Server Error | Show all authenticated user projects |

Usage :

```javascript
npm install
node app.js
```

Access client via `http://localhost:8080`<br>