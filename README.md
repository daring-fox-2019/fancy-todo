# Fancy-Todo

## Rest-Api Resources

- [Auth Endpoints](#auth-endpoints)
    - [Register a User](#register-a-user): `POST /auth/register`
    - [Login](#login): `POST /auth/login`
- [Users Endpoints](#users-endpoints)
    - [Fetch Users](#fetch-users): `GET /users`
    - [Fetch a User by Id](#fetch-a-user-by-id): `GET /users/:user_id`
    - [Update a User](#update-a-user): `PUT /users/:user_id`
    - [Delete a User](#delete-a-user): `DELETE /users/:user_id`
- [Todos Endpoints](#todos-endpoints)
    - [Fetch Todos](#fetch-todos): `GET /todos`
    - [Fetch a Todo by Id](#fetch-a-todo-by-id): `GET /todos/:todo_id`
    - [Update a Todo](#update-a-todo): `PUT /todos/:todo_id`
    - [Delete a Todo](#delete-a-todo): `DELETE /todos/:todo_id`
- [Projects Endpoints](#projects-endpoints)
    - [Fetch Projects](#fetch-projects): `GET /projects`
    - [Fetch a Project by Id](#fetch-a-project-by-id): `GET /projects/:project_id`
    - [Update a Project](#update-a-project): `PUT /projects/:project_id`
    - [Delete a Project](#delete-a-project): `DELETE /projects/:project_id`
    - [Add a Member](#add-a-member): `PUT /projects/:project_id/members`
    - [Remove a Member](#remove-a-member): `DELETE /projects/:project_id/members/:member_id`
    - [Add a Todo](#add-a-todo): `PUT /projects/:project_id/todos`



### Auth Endpoints

<hr>

#### Register a User

<hr>

**Method**: `POST`

**URL**: `/auth/register`

**Request Body**:
```javascript
{
    email: String,
    password: String
}
```

**Response Success**

**Status**: `201`

**Body**:
```javascript
{
    user: {
        _id: String,
        email: String,
        password: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:

```javascript
{
    message: "Internal Server Error"
}
```



#### Login

<hr>

**Method**: `POST`

**URL**: `/auth/login`

**Request Body**:
```javascript
{
    email: String,
    password: String
}
```

**Response Success**

**Status**: `201`

**Body**:
```javascript
{
    user: {
        _id: String,
        email: String,
        password: String
    },
    token: String
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```



### Users Endpoints

<hr>

#### Fetch Users

<hr>

**Method**: `GET`

**URL**: `/users`

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    users: [
        {
            _id: String,
            email: String,
            password: String
        }
        ...
    ]
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```



#### Fetch a User by Id

<hr>

**Method**: `GET`

**URL**: `/users/:user_id`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Response Success**

**Status**: `200`

**Body**:

```javascript
{
    user: {
        _id: String,
        email: String,
        password: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Unauthorized Access"
}
```



#### Create a User

<hr>

**Method**: `POST`

**URL**: `/users`

**Request Body**:
```javascript
{
    email: String,
    password: String
}
```

**Response Success**

**Status**: `201`

**Body**:
```javascript
{
    user: {
        _id: String,
        email: String,
        password: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:

```javascript
{
    message: "Internal Server Error"
}
```



#### Update a User

<hr>

**Method**: `PUT`

**URL**: `/users/:user_id`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Request Body**:
```javascript
{
    email: String,
    password: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    user: {
        _id: String,
        email: String,
        password: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:

```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Unauthorized Access"
}
```



#### Delete a User

<hr>

**Method**: `DELETE`

**URL**: `/users/:user_id`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    user: {
        _id: String,
        email: String,
        password: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Unauthorized Access"
}
```



### Todos Endpoints

<hr>

#### Fetch Todos

<hr>

**Method**: `GET`

**URL**: `/todos`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    todos: [
        {
            _id: String,
            title: String,
            description: String,
            status: String,
            dueDate: Date,
            authorId: String
        }
        ...
    ]
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```



#### Fetch a Todo by Id

<hr>

**Method**: `GET`

**URL**: `/todos/:todo_id`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    todo: {
        _id: String,
        title: String,
        description: String,
        status: String,
        dueDate: Date,
        authorId: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Todo Not Found"
}
```



#### Create a Todo

<hr>

**Method**: `POST`

**URL**: `/todos`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Request Body**:
```javascript
{
    title: String,
    description: String,
    dueDate: Date
}
```

**Response Success**

**Status**: `201`

**Body**:
```javascript
{
    todo: {
        _id: String,
        title: String,
        description: String,
        status: String,
        dueDate: Date,
        authorId: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```



#### Update a Todo

<hr>

**Method**: `PUT`

**URL**: '/todos/:todo_id'

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Request Body**:
```javascript
{
    title: String,
    description: String,
    status: String,
    dueDate: Date
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    todo: {
        _id: String,
        title: String,
        description: String,
        status: String,
        dueDate: Date,
        authorId: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Todo Not Found"
}
```



#### Delete a Todo

<hr>

**Method**: `DELETE`

**URL**: `/todos/:todo_id`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    todo: {
        _id: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Todo Not Found"
}
```



### Projects Endpoints

<hr>

#### Fetch Projects

<hr>

**Method**: `GET`

**URL**: `/projects`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    projects: [
        {
            _id: String,
            title: String,
            description: String,
            managerId: String,
            membersId: [ String ],
            todosId: [ String ]
        }
        ...
    ]
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```



#### Fetch a Project by Id

<hr>

**Method**: `GET`

**URL**: `/projects/:project_id`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    todo: {
        _id: String,
        title: String,
        description: String,
        managerId: String,
        membersId: String,
        todosId: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Project Not Found"
}
```



#### Create a Project

<hr>

**Method**: `POST`

**URL**: `/projects`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Request Body**:
```javascript
{
    title: String,
    description: String
}
```

**Response Success**

**Status**: `201`

**Body**:
```javascript
{
    project: {
        _id: String,
        title: String,
        description: String,
        managerId: String,
        membersId: [ String ],
        todosId: [ String ]
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```



#### Update a Project

<hr>

**Method**: `PUT`

**URL**: `/projects/:project_id`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Request Body**:
```javascript
{
    title: String,
    description: String,
    status: String,
    managerId: String,
    membersId: String,
    todosId: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    project: {
        _id: String,
        title: String,
        description: String,
        managerId: String,
        membersId: Date,
        todosId: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Project Not Found"
}
```



#### Delete a Project

<hr>

**Method**: `DELETE`

**URL**: `/projects/:project_id`

**Request Headers**:
```javascript
{
    Authorization: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    project: {
        _id: String
    }
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Project Not Found"
}
```



### Add a Member

<hr>

**Method**: `PUT`

**URL**: `/projects/:project_id/members`

**Request Header**:
```javascript
{
    Authorization: String
}
```

**Request Body**:
```javascript
{
    userId: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    project: {
        _id: String,
        title: String,
        description: String,
        managerId: String,
        membersId: String,
        todosId: String
    }
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Unauthorized Access"
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Project Not Found"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "User Not Found"
}
```



### Remove a Member

<hr>

**Method**: `DELETE`

**URL**: `/projects/:project_id/members/:member_id`

**Request Header**:
```javascript
{
    Authorization: String
}
```

**Request Body**:
```javascript
{
    userId: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    project: {
        _id: String,
        title: String,
        description: String,
        managerId: String,
        membersId: String,
        todosId: String
    }
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Unauthorized Access"
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Project Not Found"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "User Not Found"
}
```



### Add a Todo

<hr>

**Method**: `PUT`

**URL**: `/projects/:project_id/todos`

**Request Header**:
```javascript
{
    Authorization: String
}
```

**Request Body**:
```javascript
{
    todoId: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    project: {
        _id: String,
        title: String,
        description: String,
        managerId: String,
        membersId: String,
        todosId: String
    }
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Project Not Found"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Todo Not Found"
}
```



### Remove a Todo

<hr>

**Method**: `DELETE`

**URL**: `/projects/:project_id/todos/:todo_id`

**Request Header**:
```javascript
{
    Authorization: String
}
```

**Request Body**:
```javascript
{
    todoId: String
}
```

**Response Success**

**Status**: `200`

**Body**:
```javascript
{
    project: {
        _id: String,
        title: String,
        description: String,
        managerId: String,
        membersId: String,
        todosId: String
    }
}
```

**Status**: `400`

**Body**:
```javascript
{
    message: "Missing Token"
}
```

**Status**: `401`

**Body**:
```javascript
{
    message: "Invalid Token"
}
```

**Response Failure**

**Status**: `500`

**Body**:
```javascript
{
    message: "Internal Server Error"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Project Not Found"
}
```

**Status**: `404`

**Body**:
```javascript
{
    message: "Todo Not Found"
}
```
