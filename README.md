# Todo

Link: [todo.emrido.site](http://todo.emrido.site/)

Server: [todo-server.emrido.site](http://todo-server.emrido.site/)

## User Route

### Register New User

- Method
    - **POST**
- Route
    - `users/register`
- Body
    ```JS
    {
        name: String,
        email: String,
        password: String
    }
    ```
- Response
    - `code: 201`
    ```JS
    {
        _id: "<ObjectId>",
        name: "<name>",
        email: "<email>",
        password: "<hashed password>",
        projects: []
        _v: 0
    }
    ```

### Login

- Method
    - **POST**
- Route
    - `users/login`
- Body
    ```JS
    {
        email: String,
        password: String
    }
    ```
- Response
    - `code: 200`
    ```JS
    {
        accesstoken: "<generated access token>"
    }
    ```

### Google Login

- Method
    - **POST**
- Route
    - `users/google-login`
- Body
    ```JS
    {
        token: "<google id_token>"
    }
    ```
- Response
    - `code: 200`
    ```JS
    {
        accesstoken: "<generated access token>"
    }
    ```
---
## Todo Route

### Create Todo

- Method
    - **POST**
- Route
    - `todos/`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Body
    ```JS
    {
        title: String,
        description: String,
        due_date: Date
    }
    ```
- Response
    - `code: 200`
    ```JS
    {
        title: "<generated access token>"
    }
    ```

### Get All User Todo

- Method
    - **GET**
- Route
    - `todos/`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Response
    - `code: 200`
    ```JS
    [
        {
            "status": Boolean,
            "_id": "<ObjectId>",
            "name": "...",
            "description": "...",
            "due_date": Date,
            "owner": "<ObjectId User>",
            "date": Date,
            "__v": 0
        },
        { "<Object Todo>" }, ...
    ]
    ```

### Get One User Todo

- Method
    - **GET**
- Route
    - `todos/`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Response
    - `code: 200`
    ```JS
    {
        "status": Boolean,
        "_id": "<ObjectId>",
        "name": "...",
        "description": "...",
        "due_date": Date,
        "owner": "<ObjectId User>",
        "date": Date,
        "__v": 0
    }
    ```

### Update Todo

- Method
    - **PATCH**
- Route
    - `todos/:id`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Body
    ```JS
    {
        title: String,
        description: String,
        status: Boolean
        due_date: Date
    }
    ```
- Response
    - `code: 200`
    ```JS
    {
        "message": "Todo updated"
    }
    ```

### Delete Todo

- Method
    - **DELETE**
- Route
    - `todos/:id`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Response
    - `code: 200`
    ```JS
    {
        "message": "Todo deleted"
    }
    ```
## Project Route

### Create New Project

- Method
    - **POST**
- Route
    - `projects/`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Body
    ```JS
    {
        name: String,
    }
    ```
- Response
    - `code: 200`
    ```JS
    {
        "members": [],
        "todos": [],
        "_id": "5ce79bf6143346359e1d07e2",
        "name": "First Project",
        "master": "5ce768a4259a740fb314d478",
        "__v": 0
    }
    ```
### Get One Project

- Method
    - **GET**
- Route
    - `projects/:id`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Response
    - `code: 200`
    ```JS
    {
        "members": [],
        "todos": [],
        "_id": "5ce79bf6143346359e1d07e2",
        "name": "First Project",
        "master": "5ce768a4259a740fb314d478",
        "__v": 0
    }
    ```


### Add Todo to Project

- Method
    - **PUT**
- Route
    - `projects/:id/add-todo`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Body
    ```JS
    {
        title: String,
        description: String,
        due_date: Date
    }
    ```
- Response
    - `code: 200`
    ```JS
    {
        "n": 1,
        "nModified": 1,
        "opTime": {
            "ts": "6694492045974700034",
            "t": 3
        },
        "electionId": "7fffffff0000000000000003",
        "ok": 1,
        "operationTime": "6694492045974700034",
        "$clusterTime": {
            "clusterTime": "6694492045974700034",
            "signature": {
                "hash": "aw5tR2NhPzlOmSBZS+NIUpeL0OA=",
                "keyId": "6676677921790230530"
            }
        }
    }
    ```

### Add Member to Project

- Method
    - **PUT**
- Route
    - `projects/:id/add-member`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Body
    ```JS
    {
        email: String
    }
    ```
- Response
    - `code: 200`
    ```JS
    {
        "n": 1,
        "nModified": 1,
        "opTime": {
            "ts": "6694492045974700034",
            "t": 3
        },
        "electionId": "7fffffff0000000000000003",
        "ok": 1,
        "operationTime": "6694492045974700034",
        "$clusterTime": {
            "clusterTime": "6694492045974700034",
            "signature": {
                "hash": "aw5tR2NhPzlOmSBZS+NIUpeL0OA=",
                "keyId": "6676677921790230530"
            }
        }
    }
    ```

### Update Todo in Project

- Method
    - **PATCH**
- Route
    - `projects/:id/:todoId`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Body
    ```JS
    {
        title: String,
        description: String,
        status: Boolean
        due_date: Date
    }
    ```
- Response
    - `code: 200`
    ```JS
    {
        "n": 1,
        "nModified": 1,
        "opTime": {
            "ts": "6694493493378678785",
            "t": 3
        },
        "electionId": "7fffffff0000000000000003",
        "ok": 1,
        "operationTime": "6694493493378678785",
        "$clusterTime": {
            "clusterTime": "6694493493378678785",
            "signature": {
                "hash": "JY+p9KIupDSIx1wB6+cxaCE1Nd4=",
                "keyId": "6676677921790230530"
            }
        }
    }
    ```

### Delete Todo in Project

- Method
    - **DELETE**
- Route
    - `projects/:id/:todoId`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Response
    - `code: 200`
    ```JS
    {
        "n": 1,
        "opTime": {
            "ts": "6694493841271029761",
            "t": 3
        },
        "electionId": "7fffffff0000000000000003",
        "ok": 1,
        "operationTime": "6694493841271029761",
        "$clusterTime": {
            "clusterTime": "6694493841271029761",
            "signature": {
                "hash": "0UAKs4Z/lrKo93ADDR53AIdIWg0=",
                "keyId": "6676677921790230530"
            }
        },
        "deletedCount": 1
    }
    ```
### Delete Project

- Method
    - **DELETE**
- Route
    - `projects/:id`
- Header
    - `{ accesstoken: "<generated access token>" }`
- Response
    - `code: 200`
    ```JS
    [
        {
            "n": 1,
            "opTime": {
                "ts": "6694494279357693953",
                "t": 3
            },
            "electionId": "7fffffff0000000000000003",
            "ok": 1,
            "operationTime": "6694494279357693953",
            "$clusterTime": {
                "clusterTime": "6694494279357693953",
                "signature": {
                    "hash": "F8y9eDDU7iCCkOrGQCsY323u5Z0=",
                    "keyId": "6676677921790230530"
                }
            },
            "deletedCount": 1
        },
        {
            "n": 0,
            "opTime": {
                "ts": "6694494279357693953",
                "t": 3
            },
            "electionId": "7fffffff0000000000000003",
            "ok": 1,
            "operationTime": "6694494279357693953",
            "$clusterTime": {
                "clusterTime": "6694494279357693953",
                "signature": {
                    "hash": "F8y9eDDU7iCCkOrGQCsY323u5Z0=",
                    "keyId": "6676677921790230530"
                }
            },
            "deletedCount": 0
        }
    ]
    ```

## Usage

Server:
```
$ npm install
$ npm start
```
Client:
```
$ live-server --host=localhost
```

## Access point:
Server: http://localhost:3000

Client: http://localhost:8080
