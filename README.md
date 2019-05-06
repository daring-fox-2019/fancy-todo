# fancy-todo
###### CRUD User
---
| Route | HTTP | Description | Input | Output |
| ------ | ------ | ------ | ------ | ------ |
| ````/signup```` | POST | Create new user via manual register | [email], [password] | User Detail
| ````/signin```` | POST | Login user via manual login | [email], [password] | User Detail
| ````/gsignin```` | POST | Create new user or login via google | [google account] | User Detail
---

###### CRUD Todo
---
| Route | HTTP | Description | Input | Output |
| ------ | ------ | ------ | ------ | ------ |
| ````/todo/:owner```` | GET | Get all the tasks | none | Task List
| ````/todo/list```` | POST | Create a task (user only) | [desc], [owner]
| ````/todo/:id```` | DELETE | Delete a task (user only) | [id] | none
| ````/todo/:id```` | UPDATE | Update a task with new info (user only) | [id] 
---