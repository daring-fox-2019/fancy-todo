# Fancy Todo!

## User Routes
| Route | HTTP | Request | Response |
|--|--|--|--|
| `/users/register` | POST | name: String (**required**)<br>email: String (**required**)<br>password: String (**required**) | *Success:*<br>201: User Created<br>*Error:*<br>500: Internal server error |
| `/users/google-login` | POST | email: String (**required**)<br>password: String (**required**) | *Success:*<br>200: Login Succeed!<br>*Error:*<br>500: Internal server error |
| `/users/login` | POST | email: String (**required**)<br>password: String (**required**) | *Success:*<br>200: Login Succeed!<br>*Error:*<br>500: Internal server error |

## Todo Routes
| Route | HTTP | HEADER(s)| Request | Response |
|--|--|--|--|--|
| `/todos` | POST | `accesstoken` | title: String (**required**)<br>description: String (**required**)<br>due_date: Date (**required**) | *Success:*<br>201: Todo created<br>*Error:*<br>500: Internal server error |
| `/todos` | GET | `accesstoken` |  | *Success:*<br>200: `[{ <object todo> }, ... {}]`<br>*Error:*<br>500: Internal server error |
| `/todos/:id` | PATCH | `accesstoken` |  | *Success:*<br>200: Todo updated!<br>*Error:*<br>500: Internal server error |
| `/todos/:id` | DELETE | `accesstoken` |  | *Success:*<br>200: Todo Deleted!<br>*Error:*<br>500: Internal server error |

## Project Routes
| Route | HTTP | HEADER(s) | Request | Description |
|--|--|--|--|--|
| `/projects` | POST | `accesstoken` | name: String (**required**) | Create new project |
| `/projects` | GET | `accesstoken` | | Get all project |
| `/projects/:id` | GET | `accesstoken` |  | Get spesific project |
| `/projects/:id/add-todo` | PUT | `accesstoken` |  | Add todo to project |
| `/projects/:id/add-member` | PUT | `accesstoken` |  | Add member to a project |
| `/projects/:id/:todoId` | PATCH | `accesstoken` |  | Update todo in a project |
| `/projects/:id/:todoId` | DELETE | `accesstoken` |  | Delete todo in a project |
| `/projects/:id/:memberId` | DELETE | `accesstoken` |  | Remove member from project |
| `/projects/:id` | DELETE | `accesstoken` |  | Delete project |


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
