# fancy-todo


End Route Documentation : 

| Routes           | HTTP   | Header(s) | Body                                                         | Response                                                     | Description                                                 |
| ---------------- | ------ | --------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| `/login   `        | `POST`   | `none`      | **name**(required) : String, **email**(required) : String, **password**(required) : String | **Success** : (200) show task of authenticated user, **Error** : (500) : Internal Server Error | User can login                                              |
| `/google   `       | `POST`   | `none`      | **email**(required) of Gmail, **password**(required) of Gmail | **Success** : (200) show task of authenticated user, **Error** : (500) : Internal Server Error | User can login with Google email                            |
| `/register`        | `POST`   | `none`      | **firstName**(required) : String, **lastName**(required) : String ,**email**(required) : String, **password**(required) : String | **Success** : (200) show login form**Error** : (500) : Internal Server Error | User signing up as a new user                               |
| `/todo`    | `POST`   | `token`     | **title**(required) : String, **dueDate** : Date, **description**: String, **Status** : String, **CreatedAt** : Date, **userId** : ObjectId, **projectId** : ObjectId | **Success** : (200) Created a new task **Error** : (500) : Internal Server Error | Create a new task                                           |
| `/todo`   | `GET` | `token`   |   none    | **Success** : (200) Fetch Data **Error** : (500) : Internal Server Error  | Show all tasks for authenticated user
| `/todo/:id `       | `GET`    | `token`     | none                                                         | **Success** : (200) Fetch Data **Error** : (500) : Internal Server Error | Show spesific list of tasks of authenticated User                   |
| `/todo/:id` | `PUT`    | `token`     | none                                                         | **Success** : (200) Updated status and completedAt **Error** : (500) : Internal Server Error | Updating a status and mark when the task marked as complete |
| `/todo/:id` | `DELETE` | `token`     | none                                                         | **Success** : (200) The task has been removed, **Error** : (500) : Internal Server Error | Remove the task                                             |

### Project Route

| Routes           | HTTP   | Header(s) | Body                                                         | Response                                                     | Description                                                 |
| ---------------- | ------ | --------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| `/projects/pending   `        | `GET`   | `token`      | `none` | **Success** : (200) show modals of invited projects, **Error** : (500) : Internal Server Error | User can either accept or decline invited project                                            |
| `/projects  `        | `POST`   | `token`      | **name**(required) : String, **members** : ObjectId, **pendingMembers** : ObjectId, **createdBy** : ObjectId, **todoList** : ObjectId   | **Success** : (201) Create a New Project, **Error** : (500) : Internal Server Error | User created a project                                            |
| `/projects  `        | `GET`   | `token`      | `none` | **Success** : (200) Show User Project, **Error** : (500) : Internal Server Error | Show all authenticated user projects |
| `/projects/:id `        | `GET`   | `token`      | `none` | **Success** : (200) Show one Project, **Error** : (500) : Internal Server Error | Show specific authenticated user project |
| `/projects/:id `        | `DELETE`   | `token`      | `none` | **Success** : (200) Delete a Project, **Error** : (500) : Internal Server Error | delete user project |
| `/projects/:id `        | `PUT`   | `token`      | `none` | **Success** : (200) Update a Project, **Error** : (500) : Internal Server Error | update user project |
| `/projects/addTodo/:id `        | `PUT`   | `token`      | `none` | **Success** : (200) Update a Project and add todo to Project, **Error** : (500) : Internal Server Error | add todo to project |
| `/projects/invite/:id `        | `PUT`   | `token`      | `none` | **Success** : (200) activate a member in a project, **Error** : (500) : Internal Server Error | pending member activate as a member |
| `/projects/join/:id `        | `PUT`   | `token`      | `none` | **Success** : (200) invited member accept a project, **Error** : (500) : Internal Server Error | pending member activate as a member |
| `/projects/join/:id `        | `PUT`   | `token`      | `none` | **Success** : (200) invited member decline a project, **Error** : (500) : Internal Server Error | pending member remove from project |

Usage :

```javascript
npm install
node app.js
```

Access client via `http://localhost:8080`<br>
Access server via `${baseURL}`