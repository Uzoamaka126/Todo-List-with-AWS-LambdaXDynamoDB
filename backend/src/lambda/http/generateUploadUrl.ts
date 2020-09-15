import 'source-map-support/register'
import { createLogger } from '../../utils/logger';
import * as middy from 'middy';
import { generateUploadUrl } from '../../businessLogic/todosLogic';

const logger = createLogger('update-a-todo');

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  logger.info('Processing event', event);
  
  try {
    const todoId = event.pathParameters.todoId
    const uploadUrl = await generateUploadUrl(todoId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl
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
