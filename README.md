# fancy-todo

## User route
### User Register
```sh
POST /users/register
```
* Headers : none
* Body    : {email, password, name}
* Success : Status:201, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Output:

{
    "_id": "5ccf12d7ab6f1e64715e2155",
    "email": "michael123@yahoo.com",
    "password": "$2a$10$fmaN6k8tcLx2T1CZCfzYsOYI3rTP716HOXggFFv6GhS41hoXxwy6W",
    "name": "michael r",
    "__v": 0
}

```


### User Login
```sh
POST /users/login
```
* Headers : none
* Body    : {email, password}
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Output:
{
    "message": "successfully logged in",
    "token": "....",
    "user": {
        "_id": "5cced165f2e9ed30cf28e8bb",
        "email": "michael@yahoo.com",
        "name": "michael"
    }
}

```

### Google Login
```sh
POST /users/google-login
```
* Headers : none
* Body    : {idToken: googleToken}
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Input: {idToken: googleToken}
Output:
{
    "message": "successfully logged in",
    "token": "....",
    "user": {
        "_id": "5cced165f2e9ed30cf28e8bb",
        "email": "michael@yahoo.com",
        "name": "michael"
    }
}

```

### Find User
```sh
GET /users?query=
```
* Headers : {token}
* Body    : none
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Output:
[
    {
        "_id": "5ccc708e3017730f0c440e31",
        "email": "mryans93@gmail.com",
        "name": "michael ryan",
        "picture": "url...",
        "password": "$2a$10$3kgFRp3iv3MvpcSNTBF7.uu9HJewM/Y9xAMm/SLh4Gm3uGOk.OGse",
        "__v": 0
    },
    {
        "_id": "5cce7a55d6b6b6227858a1bd",
        "name": "michael1",
        "email": "michael1@yahoo.com",
        "password": "$2a$10$eYspczZ0Xw7p1g68qRdDzunsbLiuUA7ilX9Ehskdplk0e4StanmqK",
        "__v": 0
    }
]
```

## Todo Routes
### Get all Todo
```sh
GET /todos
```
* Headers : {token}
* Body    : none
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Output:
[
    {
        "_id": "5ccf1478ab6f1e64715e2156",
        "name": "membuat portofolio",
        "description": "portofolio week 1",
        "createdAt": "2019-05-05T16:51:04.193Z",
        "user": "5cced165f2e9ed30cf28e8bb",
        "inProject": false,
        "status": false,
        "__v": 0
    }
]

```

### Create Todo
```sh
POST /todos
```
* Headers : {token}
* Body    : {name, description, dueDate}
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Output:
{
    "_id": "5ccf1478ab6f1e64715e2156",
    "name": "membuat portofolio",
    "description": "portofolio week 1",
    "createdAt": "2019-05-05T16:51:04.193Z",
    "user": "5cced165f2e9ed30cf28e8bb",
    "inProject": false,
    "status": false,
    "__v": 0
}
```

### Create Todo
```sh
POST /todos
```
* Headers : {token}
* Body    : {name, description, dueDate}
* Success : Status:201, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Output:
{
    "_id": "5ccf1478ab6f1e64715e2156",
    "name": "membuat portofolio",
    "description": "portofolio week 1",
    "createdAt": "2019-05-05T16:51:04.193Z",
    "user": "5cced165f2e9ed30cf28e8bb",
    "inProject": false,
    "status": false,
    "__v": 0
}
```

### Get Specific Todo
```sh
GET /todos/:id
```
* Headers : {token}
* Body    : none
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Output:
{
    "_id": "5ccf1478ab6f1e64715e2156",
    "name": "membuat portofolio",
    "description": "portofolio week 1",
    "createdAt": "2019-05-05T16:51:04.193Z",
    "user": "5cced165f2e9ed30cf28e8bb",
    "inProject": false,
    "status": false,
    "__v": 0
}
```

### Update Specific Todo
```sh
PATCH /todos/:id
```
* Headers : {token}
* Body    : {...updatedField{}
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Before:
{
    "_id": "5ccf1478ab6f1e64715e2156",
    "name": "membuat portofolio",
    "description": "portofolio week 1",
    "createdAt": "2019-05-05T16:51:04.193Z",
    "user": "5cced165f2e9ed30cf28e8bb",
    "inProject": false,
    "status": false,
    "__v": 0
}

Input:
{
    status: true
}

Output:
{
    "_id": "5ccf1478ab6f1e64715e2156",
    "name": "membuat portofolio",
    "description": "portofolio week 1",
    "createdAt": "2019-05-05T16:51:04.193Z",
    "user": "5cced165f2e9ed30cf28e8bb",
    "inProject": false,
    "status": true, --> updated
    "__v": 0
}
```

### Delete Specific Todo
```sh
DELETE /todos/:id
```
* Headers : {token}
* Body    : none
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
//Output: (deleted object)
{
    "_id": "5ccf1478ab6f1e64715e2156",
    "name": "membuat portofolio",
    "description": "portofolio week 1",
    "createdAt": "2019-05-05T16:51:04.193Z",
    "user": "5cced165f2e9ed30cf28e8bb",
    "inProject": false,
    "status": false,
    "__v": 0
}
```
## Project Routes
### Create Projects
```sh
POST /projects
```
* Headers : {token}
* Body    : {name, description}
* Success : Status:201, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
//Output: 
{
    "members": [
        "5cced165f2e9ed30cf28e8bb"
    ],
    "todos": [],
    "_id": "5ccf1f7aab6f1e64715e2157",
    "name": "membuat portofolio",
    "description": "hari jumat malam",
    "createdBy": "5cced165f2e9ed30cf28e8bb",
    "__v": 0
}
```

### Find all user's project
```sh
GET /projects
```
* Headers : {token}
* Body    : none
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
//Output: 
[
    {
        "members": [
            {
                "_id": "5cced165f2e9ed30cf28e8bb",
                "name": "michael",
                "email": "michael@yahoo.com"
            }
        ],
        "pendingMembers": [],
        "todos": [],
        "_id": "5ccf1f7aab6f1e64715e2157",
        "name": "membuat portofolio",
        "description": "hari jumat malam",
        "createdBy": {
            "_id": "5cced165f2e9ed30cf28e8bb",
            "name": "finishing login",
            "email": "michael@yahoo.com"
        },
        "__v": 0
    }
]
```

### Find specific project owned by user
```sh
GET /projects/:id
```
* Headers : {token}
* Body    : none
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
//Output: 
{
    "members": [
        {
            "_id": "5cced165f2e9ed30cf28e8bb",
            "name": "michael",
            "email": "michael@yahoo.com"
        }
    ],
    "pendingMembers": [],
    "todos": [],
    "_id": "5ccf1f7aab6f1e64715e2157",
    "name": "membuat portofolio",
    "description": "hari jumat malam",
    "createdBy": {
        "_id": "5cced165f2e9ed30cf28e8bb",
        "name": "finishing login",
        "email": "michael@yahoo.com"
    },
    "__v": 0
}

```

### Delete specific project owned by user
```sh
DELETE /projects/:id
```
* Headers : {token}
* Body    : none
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Output: 
{
    "message": "success deleting project 5ccf1f7aab6f1e64715e2157"
}

```

### Add member to projects
```sh
PATCH /projects/:id
```
* Headers : {token}
* Body    : {addMember: member_id}
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
//Input: 
{
    addMember: "5ccc5328cdc26c7496156d17"
}

//Output: 
{
    "members": [
        "5cced165f2e9ed30cf28e8bb",
        "5ccc5328cdc26c7496156d17" //<-- added
    ],
    "pendingMembers": [],
    "todos": [],
    "_id": "5ccf2113ab6f1e64715e2158",
    "name": "fancy todo",
    "description": "w1 hacktiv porto",
    "createdBy": "5cced165f2e9ed30cf28e8bb",
    "__v": 0
}

```

### Delete member from projects
```sh
PATCH /projects/:id
```
* Headers : {token}
* Body    : {deleteMember: member_id}
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Input: 
{
    deleteMember: "5ccc5328cdc26c7496156d17"
}

Output: 
{
    "members": [
        "5cced165f2e9ed30cf28e8bb", //<-- deleted
    ],
    "pendingMembers": [],
    "todos": [],
    "_id": "5ccf2113ab6f1e64715e2158",
    "name": "fancy todo",
    "description": "w1 hacktiv porto",
    "createdBy": "5cced165f2e9ed30cf28e8bb",
    "__v": 0
}

```


### Add todo to project
```sh
PATCH /projects/:id
```
* Headers : {token}
* Body    : {addTodo: todo_id}
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
//Input: 
{
    addTodo: "5ccc5328cdc26c7496156d17",
    name: "todo1project",
    description: "keterangan todo"
}

//Output: 
{
    "members": [
        "5cced165f2e9ed30cf28e8bb",
        "5ccc5328cdc26c7496156d17"
    ],
    "pendingMembers": [],
    "todos": [
        "5ccf220cab6f1e64715e215a" //<-- created todo
    ],
    "_id": "5ccf2113ab6f1e64715e2158",
    "name": "fancy todo",
    "description": "w1 hacktiv porto",
    "createdBy": "5cced165f2e9ed30cf28e8bb",
    "__v": 0
}

```

### Add todo to project
```sh
PATCH /projects/:id
```
* Headers : {token}
* Body    : {deleteTodo: todo_id}
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}

Example Output
```javascript
Input: 
{
    deleteTodo: "5ccc5328cdc26c7496156d17",
}

Output: 
{
    "members": [
        "5cced165f2e9ed30cf28e8bb",
        "5ccc5328cdc26c7496156d17"
    ],
    "pendingMembers": [],
    "todos": [], //<-- todo removed
    "_id": "5ccf2113ab6f1e64715e2158",
    "name": "fancy todo",
    "description": "w1 hacktiv porto",
    "createdBy": "5cced165f2e9ed30cf28e8bb",
    "__v": 0
}

```

### Update project information
```sh
PATCH /projects/:id
```
* Headers : {token}
* Body    : {...updatedFields}
* Success : Status:200, dataTypes:{}
* Error : Status:500 , dataTypes:{}