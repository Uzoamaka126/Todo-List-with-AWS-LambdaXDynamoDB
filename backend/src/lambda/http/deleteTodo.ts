import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todosLogic'
import * as middy from 'middy'
import { getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('delete-a-todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const jwtToken: string = getToken(event.headers.Authorization)

    try {
      await deleteTodo(todoId, jwtToken);
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
      logger.error('Error: ' + err.message)

      return {
        statusCode: 500,
        body: err.message
      }
    }
  }
)