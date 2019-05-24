# fancy-todo

User Router:

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`users/register` | POST | **Body**<br>first name: `String`<br>last name: `String`<br>email: `String`<br>password: `String` | **Success**<br>`201` Created<br>**Fail**<br>`500` Internal Server Error | Create a user
`users/login` | POST | **Body**<br>email: `String`<br>password: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error | Sign a user in
`/users` | GET | `none` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all users
`/users/:id` | GET | **Headers**<br>id: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get one user
`/users/:id` | PUT | **Headers**<br>id: `String`<br>**Body**<br>first name: `String`<br>last name: `String`<br>email: `String`<br>password: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one user
`/users/:id` | DELETE | **Headers**<br>id: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Delete a user

Todo Router:

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`todos/` | POST | **Body**<br>title: `String`<br>description: `String`<br>dueDate: `Date`<br>status: `Boolean`<br>urgency: `Boolean` | **Success**<br>`201` Created<br>**Fail**<br>`500` Internal Server Error | Create a todo
`todos/:id` | PUT | **Headers**<br>id: `String`<br>token: `String`<br>**Body**<br>title: `String`<br>description: `String`<br>dueDate: `Date`| `200` OK<br>**Fail**<br>`401` Authorization Error | Edit a Todo
`todos/` | GET | `none` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all todos
`todos/:id` | GET | **Headers**<br>id: `String`<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get one todos
`/todos/:id` | PATCH | **Headers**<br>id: `String`<br>token: `String`<br>**Body**<br>field: `String`<br>value: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one todos
`/todos/:id/done` | PATCH | **Headers**<br>id: `String`<br>token: `String`<br>**Body**<br>field: `String`<br>value: `Boolean` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one todos as Done
`/todos/:id/urgent` | PATCH | **Headers**<br>id: `String`<br>token: `String`<br>**Body**<br>field: `String`<br>value: `Boolean` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one todos as Urgent
`/todos/:id` | DELETE | **Headers**<br>id: `String`<br>token: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Delete a todo
