# fancy-todo

## Usage

Make sure Node.js is installed in your computer then run these commands:

```javascript
npm install

npm run dev

npm run start
```

## Environment

PORT=

JWT_SECRET=

SALT=

CLIENT_ID=

CLIENT_SECRET=

### User Router:

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/api/users` | GET | `none` | **Success**<br>`200` OK<br>**Fail**<br>`500` Internal Server Error | Show all users
`/api/users/signup` | POST | **Body**<br>name: `String`<br>email: `String`<br>password: `String` | **Success**<br>`201` Created<br>**Fail**<br>`500` Internal Server Error | Create a user
`/api/users/signin` | POST | **Body**<br>email: `String`<br>password: `String` | `200` OK<br>**Fail**<br>`400` Bad Request | Sign a user in
`/api/users/googlesignin` | POST | **Body**<br>email: `String`<br>password: `String` | `200` OK<br>**Fail**<br>`400` Bad Request | Sign a user in with google account
`/api/users/:todoId` | GET | `none` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get logged in todo user by todoId

### Todo Router:

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/api/todos` | POST | **Headers**<br>token: `String`<br>**Body**<br>name: `String`<br>description: `String`<br>dueDate: `Date` | **Success**<br>`201` Created<br>**Fail**<br>`500` Internal Server Error | Create a todo
`/api/todos` | GET | `none` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all todos by authorize user
`/api/todos/search` | GET | **Query**<br>name: `String`<br> | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Get all user's todos
`/api/todos/:id` | PUT | **Headers**<br>id: `String`<br>**Body**<br>name: `String`<br>description: `String`<br>dueDate: `Date`<br>status: `Boolean` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one todo
`/api/todos/:id` | PATCH | **Headers**<br>id: `String`<br>**Body**<br>name: `String`<br>description: `String`<br>dueDate: `Date`<br>status: `Boolean` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Update one todo
`/api/todos/:id` | DELETE | **Headers**<br>id: `String` | `200` OK<br>**Fail**<br>`401` Authorization Error<br>`500` Internal Server Error | Delete a todo

### Error Handling (Undefined Routes):

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/*` | any | any | **Fail**<br>`404` Not Found | Catch any unmatched routes and redirect them here
