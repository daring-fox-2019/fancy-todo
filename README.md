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
`/users` | GET | `none` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all users
`/users/:id` | GET | **Headers**<br>id: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get one user
`/users/:id` | PUT | **Headers**<br>id: `String`<br>**Body**<br>name: `String`<br>email: `String`<br>password: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one user
`/users/:id` | DELETE | **Headers**<br>id: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Delete a user

### Todo Router:

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/todos` | POST | **Headers**<br>token: `String`<br>**Body**<br>name: `String`<br>description: `String`<br>dueDate: `Date` | **Success**<br>`201` Created<br>**Fail**<br>`500` Internal Server Error | Create a todo
`/todos` | GET | `none` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all todos
`/todos/myTodo` | GET | **Headers**<br>token: `String`<br> | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all user's todos
`/todos/:id` | GET | **Headers**<br>id: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get one todo
`/todos/:id` | PUT | **Headers**<br>id: `String`<br>**Body**<br>name: `String`<br>description: `String`<br>dueDate: `Date`<br>status: `Boolean` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one todo
`/todos/:id` | DELETE | **Headers**<br>id: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Delete a todo

### Error Handling (Undefined Routes):

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/*` | any | any | **Fail**<br>`404` Not Found | Catch any unmatched routes and redirect them here



route.post('/projects', ControllerProject.create)
// route.post('/projects/:projectId', ControllerProject.createTodo)
route.get('/projects', ControllerProject.findAll)
route.use('/projects/:id', authorize)
route.get('/projects/:id', ControllerProject.findOne)
route.put('/projects/:id', ControllerProject.update)
route.delete('/projects/:id', ControllerProject.delete)
