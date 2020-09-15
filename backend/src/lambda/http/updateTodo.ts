import 'source-map-support/register'
import * as middy from 'middy'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getToken } from '../../auth/utils'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todosLogic'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update-todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todoId: string = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      const jwtToken: string = getToken(event.headers.Authorization)
      await updateTodo(todoId, updatedTodo, jwtToken)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        // return an empty body
        body: ''
      }
    } catch (err) {
      logger.error('Error', { error: err.message })

      return {
        statusCode: 500,
        body: err.message
      }
    }
  }
)