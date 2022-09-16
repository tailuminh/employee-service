import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { EmployeeItem } from '../models/EmployeeItem'
import { UpdateEmployeeRequest } from '../requests/UpdateEmployeeRequest'
import { genPresignUrl } from '../attachment/attachementHelper'
import * as uuid from 'uuid'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('employee-data-access')

export class EmployeeAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly employeesTable = process.env.EMPLOYEES_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET) { }

    getEmployees = async (userId: string): Promise<EmployeeItem[]> => {
        logger.log('info', 'Querying all employee...')
        let employees: EmployeeItem[]
        const result = await this.docClient.query({
            TableName: this.employeesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        employees = result.Items as EmployeeItem[]
        return employees
    }

    getEmployeeByCitizenId = async (userId: string, citizenId: string): Promise<EmployeeItem[]> => {
        logger.log('info', 'Querying employee with citizenId = '.concat(citizenId))
        let employee: EmployeeItem[]
        const result = await this.docClient.query({
            TableName: this.employeesTable,
            KeyConditionExpression: 'userId = :userId',
            FilterExpression: 'citizenId = :citizenId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':citizenId': citizenId
            }
        }).promise()
        employee = result.Items as EmployeeItem[]
        return employee
    }

    createEmployee = async (employee: EmployeeItem): Promise<EmployeeItem> => {
        logger.log('info', 'Create new employee: '.concat(JSON.stringify(employee)))
        await this.docClient.put({
            TableName: this.employeesTable,
            Item: employee
        }).promise()
        return employee
    }

    updateEmployee = async (userId: string, employeeId: string, updateEmployee: UpdateEmployeeRequest): Promise<void> => {
        logger.log('info', 'Updating employee info: '.concat(JSON.stringify({ ...updateEmployee, userId, employeeId })))
        await this.docClient.update({
            TableName: this.employeesTable,
            Key: {
                "userId": userId,
                "employeeId": employeeId
            },
            UpdateExpression: "set firstName=:firstName, lastName=:lastName, dob=:dob, department=:department, address=:address, workingStatus=:workingStatus",
            ExpressionAttributeValues: {
                ":firstName": updateEmployee.firstName,
                ":lastName": updateEmployee.lastName,
                ":dob": updateEmployee.dob,
                ":department": updateEmployee.department,
                ":address": updateEmployee.address,
                ":workingStatus": updateEmployee.workingStatus
            }
        }).promise()
    }

    deleteEmployee = async (userId: string, employeeId: string): Promise<void> => {
        logger.log('info', 'Deleting employee: '.concat(employeeId))
        await this.docClient.delete({
            TableName: this.employeesTable,
            Key: {
                "userId": userId,
                "employeeId": employeeId
            }
        }).promise()
    }

    getUploadURL = async (userId: string, employeeId: string): Promise<string> => {
        const imageId = uuid.v4()
        const presignedUrl = await genPresignUrl(imageId)
        this.docClient.update({
            TableName: this.employeesTable,
            Key: {
                employeeId,
                userId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${imageId}`,
            }
        }, (err, data) => {
            if (err) {
                logger.log('error', 'Error: '.concat(err.message))
                throw new Error(err.message)
            }
            logger.log('info', 'Created: '.concat(JSON.stringify(data)))
        })
        return presignedUrl
    }
}