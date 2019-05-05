# fancy-todo

# Simple Todo List
##### oleh : [Novi Irnawati]

Aplikasi ini adalah tugas portofolio. Fitur utamanya adalah :
  - Menyimpan todo list berdasarkan user
  - Mengedit todo list sesuai user yang ter autentifikasi dan ownernya
  - Menghapus todo list sesuai user yang ter autentifikasi dan ownernya
  - Melihat todo list user yang ter autentifikasi dan ownernya
  - Daily quotes untuk menyemangati user agar menyelesaikan tugasnya

### Detail :
Aplikasi ini menggunakan beberapa teknologi dan tools antara lain :
* [bcrypt] - library untuk keperluan enkripsi password
* [express] - network app framework
* [mongoose] - 
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [google oauth] - login via google


### Routes Back End
|Method| Route | function |
| ------ | ------ | ------ |
|GET| /todos | create new todo |
|POST| /todos |  view owner's todo list|
|GET| /todos/:id | view todo details |
|DELETE| /todos/:id | delete a todo by owner |
|PUT| /todos/:id | update a todo by owner |

### Middle wares
path : /server/middlewares

middleware digunakan di beberapa routes untuk fungsi suthentication dan authorization

[bcrypt]: <https://github.com/noviirna>
[express]: <https://github.com/noviirna>
[mongoose]: <https://github.com/noviirna>
[node.js]: <https://github.com/noviirna>
[Express]: <https://github.com/noviirna>
[Novi Irnawati]: <https://github.com/noviirna>
[google oauth]: <https://github.com/noviirna>
