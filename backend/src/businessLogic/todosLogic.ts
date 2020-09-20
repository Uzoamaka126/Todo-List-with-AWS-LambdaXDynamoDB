import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const logger = createLogger('todos');
const todoAccess = new TodoAccess();

export async function getAllUserTodos (jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken);

  return await todoAccess.getAllTodos(userId);
}

export async function createTodo (createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
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

export const updateTodo = async (
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  jwtToken: string
): Promise<TodoItem> => {
  logger.info('Processing request...')

  const userId = parseUserId(jwtToken)
  logger.info('User Id is: ' + userId)

  return await todoAccess.updateTodo({
    todoId,
    userId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done,
    createdAt: new Date().toISOString()
  })
}

export const deleteTodo = async (
  todoId: string,
  jwtToken: string
): Promise<string> => {
  logger.info('In deleteTodo() function')

  const userId = parseUserId(jwtToken);
  logger.info('User Id: ' + userId);

  return await todoAccess.deleteTodo(todoId, userId)
}

export const generateUploadUrl = async (todoId: string): Promise<string> => {
  logger.info('In generateUploadUrl() function')

  return await todoAccess.generateUploadUrl(todoId)
}