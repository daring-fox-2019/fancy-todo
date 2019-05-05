const faker = require('faker')

let users = [
  {
    id: 0,
    email: 'asd@e.com'
  }
]

let todos = Array.from(Array(5), (el, index) => ({
  id: index,
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  dueDate: faker.date.recent(),
  status: 'Ongoing',
  authorId: users[0].id
}))

let projects = [
  {
    id: 0,
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    managerId: users[0].id,
    membersId: [],
    todosId: todos.filter(todo => Math.random() > 0.4).map(todo => todo.id)
  }
]

module.exports = function () {
  return {
    users,
    todos,
    projects
  }
}
