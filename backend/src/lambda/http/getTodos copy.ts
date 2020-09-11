import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';


const docClient = new AWS.DynamoDB.DocumentClient();
const usersTable = process.env.USERS_TABLE;
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Caller event', event);

  const userId = event.pathParameters.userId;

  const validateUserId = await userExists(userId);

  if (!validateUserId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'User does not exist'
      })
    }
  }

  const todos = await getTodosPerUser(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
     items: todos
    })
  }

}

async function userExists(userId: string) {
  const result = await docClient.get({
    TableName: usersTable,
    Key: {
      id: userId
    }
  })
  .promise()

  console.log('Get group: ', result)
  return !!result.Item
}

async function getTodosPerUser(userId: string) {
  const result = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  return result.Items;
}