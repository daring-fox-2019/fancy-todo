const faker = require('faker')
const jwt = require('jsonwebtoken')

const models = require('../models')

const clearDb = (...modelName) => done => {
  Promise.all(
    modelName.map(modelName => models[modelName].deleteMany({}))
  )
    .then(_ => done())
    .catch(done)
}

const createUser = () => {
  const rawPassword = faker.internet.password()
  return models.UserModel
    .create({
      email: faker.internet.email(),
      password: rawPassword
    })
    .then(user => {
      user.rawPassword = rawPassword
      return user
    })
}

const createTodo = ({ authorId }) => {
  return models.TodoModel
    .create({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      dueDate: faker.date.future(),
      authorId
    })
}

const createProject = ({ managerId }) => {
  return models.ProjectModel
    .create({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      managerId
    })
}

const createToken = (user) => {
  return jwt.sign({
    _id: user._id,
    email: user.email,
    password: user.password
  }, process.env.JWT_SECRET)
}

module.exports = {
  createUser,
  clearDb,
  createTodo,
  createProject,
  createToken
}
