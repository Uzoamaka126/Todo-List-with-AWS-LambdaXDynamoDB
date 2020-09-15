import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllUserTodos } from '../../businessLogic/todosLogic'
import { getToken } from '../../auth/utils';
import { createLogger } from '../../utils/logger'
import * as middy from 'middy';

const logger = createLogger('get_todos');

export const handler: APIGatewayProxyHandler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Processing request', event);

  try {
    const jwtToken: string = getToken(event.headers.Authorization)
    const todos = await getAllUserTodos(jwtToken);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: todos
      })
    }
  } catch (err) {
    logger.error('Error: ' + err.message)

    return {
      statusCode: 500,
      body: err.message
    }
  }
})