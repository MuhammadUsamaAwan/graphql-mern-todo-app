let tasks = require('../data/tasksData.json')
const fsPromises = require('fs').promises
const path = require('path')

const find = body => {
  if (!body) return tasks
  const length = Object.keys(body).length
  const keys = Object.keys(body)
  const values = Object.values(body)
  let result
  for (let i = 0; i < length; i++)
    result = tasks.filter(task => task[keys[i]] === values[i])
  return result
}

const findById = id => tasks.find(task => task.id === id)

const findByIdAndDelete = id => saveFile(tasks.filter(task => task.id !== id))

const findByIdAndUpdate = (id, update) => {
  const foundTask = findById(id)
  const updatedTasks = tasks.map(task =>
    task === foundTask ? { ...task, ...update } : task
  )
  saveFile(updatedTasks)
}

const findOne = body => {
  if (!body) return tasks.find(task => task)
  const length = Object.keys(body).length
  const keys = Object.keys(body)
  const values = Object.values(body)
  let result
  for (let i = 0; i < length; i++)
    result = tasks.filter(task => task[keys[i]] === values[i])
  return result[0]
}

const create = async task => saveFile([...tasks, task])

const saveFile = async tasks => {
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'data', 'tasksData.json'),
    JSON.stringify(tasks)
  )
}

module.exports = {
  find,
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  findOne,
  create,
}
