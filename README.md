# fancy-todo

##  User Register
```
    URL : /users/register
    Method : POST
    Headers: None
    Authenticate = None
    Body : name=[string], password=[string], email=[string]
    Params : None
    Success Response :
        Code 201
            {
                "_id": "5ccb24a09d738f4fd1011de0",
                "name": "komangmahendra",
                "email": "mail@mail.com",
                "password": "$2a$10$.HDPulTBd1.M0vTnU7oyDe4j8b3o68uj2FWAFJc.jhEgF4478rxna",
                "__v": 0
            }
    Error Response :
        Code: 500 
        Content: { message : <error message> }
```
##  User Login
```
    URL : /users/login
    Method : POST
    Headers: None
    Authenticate = None
    Body : password=[string], email=[string]
    Params : None
    Success Response :
        Code 201
            {
                "token": <token> ,
                "email" : <email>,
                "name": <name>
            }
    Error Response :
        Code: 500/400
        Content: { message : <error message> }
```
##  Google sign in
```
    URL : /oauth/google-sign-in
    Method : POST
    Headers: None
    Authenticate = None
    Body : id_token=[string]
    Params : None
    Success Response :
        Code 201
              {
                "token": <token> ,
                "email" : <email>,
                "name": <name>
            }
    Error Response :
        Code: 500
        Content: { message : <error message> }
```
##  get one user
```
    URL : /users/getone
    Method : GET
    Headers: token=[string]
    Authenticate = YES
    Body : None
    Params : None
    Success Response :
        Code 200
            {
                "project_list": [
                    {
                        "task": [],
                        "_id": "5ccef768301ff06f5f9e5e32",
                        "name": "hehehe",
                        "user_id": "5ccef75f301ff06f5f9e5e31",
                        "__v": 0
                    },
                   <object>
                ],
                "_id": "5ccef75f301ff06f5f9e5e31",
                "name": "Komang Mahendra",
                "email": "emahend@gmail.com"
            }
    Error Response :
        Code: 500
        Content: { message : <error message> }
```
##  update user
```
    URL : /users
    Method : PATCH
    Headers: token=[string], email=[string] (add collaboration)
    Authenticate = YES
    Body : project_id=[string], email=[string], password=[string]
    Params : None
    Success Response :
        Code 200
        {
            "project_list": [
                "5ccef768301ff06f5f9e5e32",
                "5ccef79e301ff06f5f9e5e35"
            ],
            "_id": "5ccef75f301ff06f5f9e5e31",
            "name": "Komang Mahendra",
            "email": "emahend@gmail.com",
            "password": "$2a$10$tQna9qBTRgW5/35hm6fIAe9uQxMANvt435qrS3pmVnvgls.EJEnIC",
            "__v": 0
        }
    Error Response :
        Code: 500
        Content: { message : <error message> }
```
##  create TODO
```
    URL : /todos
    Method : POST
    Headers: token=[string], project_id=[string](optional)
    Authenticate = YES
    Body : task=[string], description=[string], due_date=[date]
    Params : None
    Success Response :
        Code 200
        {
            "project_list": [
                "5ccef768301ff06f5f9e5e32",
                "5ccef79e301ff06f5f9e5e35"
            ],
            "_id": "5ccef75f301ff06f5f9e5e31",
            "name": "Komang Mahendra",
            "email": "emahend@gmail.com",
            "password": "$2a$10$tQna9qBTRgW5/35hm6fIAe9uQxMANvt435qrS3pmVnvgls.EJEnIC",
            "__v": 0
        }
    Error Response :
        Code: 500
        Content: { message : <error message> }
```
##  get all user Todo
```
    URL : /todos
    Method : GET
    Headers: token=[string]
    Authenticate = YES
    Body : None
    Params : None
    Success Response :
        Code 200
        [
            {
                "_id": "5ccefbfb301ff06f5f9e5e37",
                "task": "makan",
                "status": "new",
                "user_id": {
                    "project_list": [
                        "5ccef768301ff06f5f9e5e32",
                        "5ccef79e301ff06f5f9e5e35"
                    ],
                    "_id": "5ccef75f301ff06f5f9e5e31",
                    "name": "Komang Mahendra",
                    "email": "emahend@gmail.com"
                },
                "description": "enak",
                "due_date": "2019-05-20T00:00:00.000Z",
                "createdAt": "2019-05-05T15:06:35.164Z",
                "updatedAt": "2019-05-05T15:06:35.164Z",
                "__v": 0
            }
        ]
    Error Response :
        Code: 500
        Content: { message : <error message> }
```
##  delete Todo
```
    URL : /todos/:id
    Method : POST
    Headers: token=[string]
    Authenticate : YES
    Authorization : YES
    Body : None
    Params : id=[string]
    Success Response :
        Code 204
        No Content
    Error Response :
        Code: 500/400
        Content: { message : <error message> }
```
##  update Todo
```
    URL : /todos/:id
    Method : PATCH
    Headers: token=[string]
    Authenticate : YES
    Authorization : YES
    Body : None
    Params : id=[string]
    Success Response :
        Code 200
        {
            "_id": "5ccefda9301ff06f5f9e5e38",
            "task": "makan enak enak",
            "status": "new",
            "user_id": "5ccef75f301ff06f5f9e5e31",
            "description": "enak",
            "due_date": "2019-05-20T00:00:00.000Z",
            "createdAt": "2019-05-05T15:13:45.244Z",
            "updatedAt": "2019-05-05T15:14:07.624Z",
            "__v": 0
        }
    Error Response :
        Code: 500/400
        Content: { message : <error message> }
```
##  create project
```
    URL : /projects
    Method : POST
    Headers: token=[string]
    Authenticate : YES
    Authorization : None
    Body : name=[string]
    Params : None
    Success Response :
        Code 201
        {
            "task": [],
            "_id": "5ccefe5543c3e078afef5520",
            "name": "makan enak enak",
            "user_id": "5ccef75f301ff06f5f9e5e31",
            "__v": 0
        }
    Error Response :
        Code: 500
        Content: { message : <error message> }
```
##  update project
```
    URL : /projects
    Method : POST
    Headers: token=[string]
    Authenticate : YES
    Authorization : None
    Body : name=[string]
    Params : id=[string]
    Success Response :
        Code 200
        {
            "task": [],
            "_id": "5ccefe5543c3e078afef5520",
            "name": "makan enak enak enak enak",
            "user_id": "5ccef75f301ff06f5f9e5e31",
            "__v": 0
        }
    Error Response :
        Code: 500
        Content: { message : <error message> }
```
##  get one project
```
    URL : /projects/:id
    Method : GET
    Headers: token=[string]
    Authenticate : YES
    Authorization : None
    Body : None
    Params : id=[string]
    Success Response :
        Code 200
        {
            "task": [],
            "_id": "5ccefe5543c3e078afef5520",
            "name": "makan enak enak enak enak",
            "user_id": {
                "project_list": [
                    "5ccef768301ff06f5f9e5e32",
                    "5ccef79e301ff06f5f9e5e35",
                    "5ccefe1f301ff06f5f9e5e39",
                    "5ccefe5543c3e078afef5520"
                ],
                "_id": "5ccef75f301ff06f5f9e5e31",
                "name": "Komang Mahendra",
                "email": "emahend@gmail.com",
                "password": "$2a$10$tQna9qBTRgW5/35hm6fIAe9uQxMANvt435qrS3pmVnvgls.EJEnIC",
                "__v": 0
            },
            "__v": 0
        }
    Error Response :
        Code: 500
        Content: { message : <error message> }
```
##  delete project
```
    URL : /projects/:id
    Method : DELETE
    Headers: token=[string]
    Authenticate : YES
    Authorization : YES
    Body : None
    Params : id=[string]
    Success Response :
        Code 204
        No Content
    Error Response :
        Code: 500/400
        Content: { message : <error message> }
```


## Use Application
```
npm init
npm install
nodemon -L app.js
```

## server deploy
```
http://todo-server.komangmahendra.me
```
