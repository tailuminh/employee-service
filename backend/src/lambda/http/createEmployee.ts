import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateEmployeeRequest } from '../../requests/CreateEmployeeRequest'
import { getUserId } from '../utils';
import { createEmployee } from '../../businessLogic/employeeBussiness'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newEmployee: CreateEmployeeRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    try {
      const newCreatedEmployee = await createEmployee(userId, newEmployee);
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ item: newCreatedEmployee })
      }
    }
    catch (err) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(err)
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
