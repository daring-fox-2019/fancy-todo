# fancy-todo

## endpoint

### Entry

|No|Method|Route|Request|Response|Description
|---|---|---|---|---|---|
1|POST|/register|```body: { username: (string), email: (string), password: (string) }```| ``` status(201), accessToken: jwt, userId: id ```| Register a new user
2|POST|/login|```body: { email, password, type: regular }, { id_token, type: google} ```| ```status(200),accessToken: jwt, userId: id ```|User Login
3|GET|/home|``` headers: { Authorization: token }```| ```status(200),user: { username, email, projects: [{...}, {...}], todos: [{...}, {...}]}```| Get user relevant datas

### Todos
|No|Method|Route|Request|Response|Description
|---|---|---|---|---|---|
1|GET|/todos/|``` headers: { Authorization: token }``` | ```status(200), todos: [{...}, {...}] ```| Get all todos
2|GET|/todos/:id|``` headers: { Authorization: token }```|``` status(200),todo: {name, description, date, status, userId}```| Get todo by Id
3| POST|/todos/|``` headers: { Authorization: token }, body: { name, description, date}```| ```status(201), todo: {name, description, status, date}```| Create a todo
4|PUT|/todos/:id|``` headers: { Authorization: token }, body: { name, description, date, status}```| ``` status(200), todo: {name, description, status, date}```| Edit a todo
5|DELETE|/todos/:id|``` headers: { Authorization: token }```|```status(200), no content```|Delete a todo

### Projects
|No|Method|Route|Request|Response|Description
|---|---|---|---|---|---|
1|GET|/projects|``` headers: { Authorization: token }```|```status(200), projects:[{...}, {...}]```|Get all Projects
2|POST|/projects|``` headers: { Authorization: token } body: {name, description}```|```status(201), project: { name, description, ownerId, members: [], todos: []} ```| Create a project
3|PUT|/projects/:id/|``` headers: { Authorization: token }, body: {name, description, memberId, todoId}```| ```status(200), project: {updated fields} ```| Update a project
4|DELETE|/projects/:id|``` headers: { Authorization: token }```|```status(200), no content```|Delete a project

### Main
|No|Method|Route|Request|Response|Description
|---|---|---|---|---|---|
1|GET|/users/project/:projectId|```  headers: { Authorization: token } ``` |``` status(200), project: { name, description, ownerId, members: [], todos: []}```| Get a project by id
2|PATCH|/users/projectId/member|```  headers: { Authorization: token }, body: {user email} ```| ```status(200), project: { updated member }```| Add Member to Project by email
3|POST|/users/project/:projectId/todo|```headers: { Authorization: token }, body: {name, description, date} ```| ```status(201), todo:{name, description ,date, status, userId} ```| Create a todo in project
4|PUT|/users/project/:projectId/todo/:todoId|```headers: { Authorization: token } , body: {name, status, date}```| ``` status(200), todo: {updated fields} ```| Update a todo in project
5|DELETE|/users/project/:projectId/todo/:todoId|```headers: { Authorization: token``` }|``` status(200), no content```| Delete a todo in a project

### Server
```
cd server
npm -i
npm run start
```

### Client
```
cd client
live-server --host=localhost
```
