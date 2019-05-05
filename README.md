# fancy-todo

### Route Home
Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/` | GET | `none` | `200` OK | Showing `home` in a JSON format

### User Router:

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/register` | POST | **Body**<br>name: `String`<br>email: `String`<br>password: `String` | **Success**<br>`201` Created<br>**Fail**<br>`500` Internal Server Error | Create a user
`/login` | POST | **Body**<br>email: `String`<br>password: `String` | `200` OK<br>**Fail**<br>`400` Bad Request | Sign a user in
`/auth/google` | POST | **Headers**<br>token: `String` | `200` OK<br>**Fail**<br>`400` Bad Request | Sign a user in using Google account
`/users` | GET | `none` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all users
`/users/:id` | GET | **Headers**<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get one user
`/users/:id` | PUT | **Headers**<br>token: `String`<br>**Body**<br>name: `String`<br>email: `String`<br>password: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one user
`/users/:id` | DELETE | **Headers**<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Delete a user

### Todo Router:

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/todos` | POST | **Headers**<br>token: `String`<br>**Body**<br>name: `String`<br>description: `String`<br>dueDate: `Date` | **Success**<br>`201` Created<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Create a todo
`/todos` | GET | **Headers**<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all todos
`/todos/myTodo` | GET | **Headers**<br>token: `String`<br> | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all user's todos
`/todos/:todoId` | GET | **Headers**<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get one todo
`/todos/:todoId` | PUT | **Headers**<br>token: `String`<br>**Body**<br>name: `String`<br>description: `String`<br>dueDate: `Date`<br>status: `Boolean` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one todo
`/todos/:todoId` | DELETE | **Headers**<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Delete a todo

### Project Router:

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/projects` | POST | **Headers**<br>token: `String`<br>**Body**<br>name: `String`<br>user: `String` | **Success**<br>`201` Created<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Create a project
`/projects` | GET | **Headers**<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all projects
`/projects/myProjects` | GET | **Headers**<br>token: `String`<br> | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all user's projects
`/projects/todos/:todoId` | PUT | **Headers**<br>token: `String`<br>**Body**<br>name: `String`<br>description: `String`<br>status: `Boolean`<br>dueDate: `String` | **Success**<br>`201` Created<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update a Todo in specified project
`/projects/todos/:todoId` | DELETE | **Headers**<br>token: `String` | **Success**<br>`200` Created<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Delete a Todo in specified project
`/projects/todos/:projectId` | GET | **Headers**<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get one todo in a specified project
`/projects/:projectId` | POST | **Headers**<br>token: `String`<br>name: `String`<br>description: `String`<br>dueDate: `String` | `201` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Create a project in specified project
`/projects/:projectId` | GET | **Headers**<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get one project
`/projects/:projectId` | PUT | **Headers**<br>token: `String`<br>**Body**<br>name: `String`<br>description: `String`<br>dueDate: `Date`<br>status: `Boolean` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one project
`/projects/:projectId` | DELETE | **Headers**<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Delete a project

### Error Handling (Undefined Routes):

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/*` | any | any | **Fail**<br>`404` Not Found | Catch any unmatched routes and redirect them here