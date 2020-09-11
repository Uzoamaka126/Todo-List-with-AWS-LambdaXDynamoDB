import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoLayer'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos');

const todoAccess = new TodoAccess();

export const getAllUserTodos = async (jwtToken: string): Promise<TodoItem[]> => {
  const userId = parseUserId(jwtToken)

  return await todoAccess.getAllTodos(userId)
}

export const createTodo = async (createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> => {
  logger.info('In createTodo() function')

  const itemId = uuid.v4();
  const userId = parseUserId(jwtToken);

  return await todoAccess.createTodo({
    todoId: itemId,
    userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}
