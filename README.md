# fancy-todo

## List of user routes:

Route | HTTP | Params | Headers | Body | Description | Response | Input Example
--- | --- | --- | --- | --- | --- | --- | ---
```/api/todos``` | GET | none | none | none | Get all the todos info  | Success: Return all todos and status 200. Error: Return error message and status 500. | none
```/api/todos/:id``` | GET | _id:ObjectID | none | none | Get a single todo info | Success: Return todo and status 200. Error: Return error message and status 500. | { _id: "5ca9d3e8364eff59d7921fbb"}
```/api/todos``` | POST | none | none | username:String, password:String | Create a todo | Success: Return created todo and status 201. Error: Return error message and status 500. | test
```/api/todos/:id``` | DELETE | _id:ObjectID| none | none | Delete a todo (Admin only) | Success: Return deleted todo and status 200. Error: Return error message and status 500. | test
```/api/todos/:id``` | PUT | _id:ObjectID | none | username:String, password:String | Update a todo with new info | Success: Return updated todo and status 200. Error: Return error message and status 500. | test
```/api/register``` | POST | none | none | username:String, password:String | Sign up with new todo info | Success: Return username and hashed password and status 200. Error: Return error message (validation) and status 500. | {username: admin, password: password}
```/api/login``` | POST | none | none | username:String, password:String | Sign in and get an access token based on credentials | Success: Return welcome message with token and status 200. Error: Return error message "Wrong username/password" and status 401. | {username: admin, password: password}

# Usage
Make sure you have Node.js and npm installed in your computer, and then run these commands:

```
$ cd server
$ npm init
$ npm install
```

Read ```.env.example``` and then you can create your own ```.env``` file.

After you have finished, on your server run the following command:

```
$ npm run dev
```

On your client, run the following command:

```
$ live-server --host=localhost
```

First step is to register or login.
For register, you need to fill out username, password. For login, insert username and password or you can sign in using your Google account.