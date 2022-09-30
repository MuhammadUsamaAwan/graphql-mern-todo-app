const Task = require('../model/Task')
const { v4: uuid } = require('uuid')
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql')

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLID },
    task: { type: GraphQLString },
  }),
})

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find()
      },
    },
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Task.findById(args.id)
      },
    },
  },
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTask: {
      type: TaskType,
      args: {
        task: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        Task.create({ id: uuid(), task: args.task })
        return { id: uuid(), task: args.task }
      },
    },
    updateTask: {
      type: TaskType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        task: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        Task.findByIdAndUpdate(args.id, { task: args.task })
        return { id: args.id, task: args.task }
      },
    },
    deleteTask: {
      type: TaskType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        Task.findByIdAndDelete(args.id)
        return { id: args.id }
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query,
  mutation,
})
