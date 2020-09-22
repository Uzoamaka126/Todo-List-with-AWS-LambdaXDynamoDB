import 'source-map-support/register';
import * as middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createTodo } from '../../businessLogic/todosLogic'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getToken } from '../../auth/utils';

const logger = createLogger('get_todos');

export const handler: APIGatewayProxyHandler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('processing request', event);
  
  try {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const jwtToken: string = getToken(event.headers.Authorization)
    const newTodoItem = await createTodo(newTodo, jwtToken)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newTodoItem
      })
    }
  } catch (err) {
      logger.error('Error: ' + err.message)
      return {
        statusCode: 500,
        body: err.message
      }
  }
});