import { EmployeeAccess } from '../dataAccess/employeeAccess'
import { EmployeeItem } from '../models/EmployeeItem'
import { CreateEmployeeRequest } from '../requests/CreateEmployeeRequest'
import { UpdateEmployeeRequest } from '../requests/UpdateEmployeeRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('employee-bussiness-layer')
const employeeAccess = new EmployeeAccess()

export const getEmployees = async (userId: string): Promise<EmployeeItem[]> => {
    return await employeeAccess.getEmployees(userId);
}

export const createEmployee = async (userId: string, employee: CreateEmployeeRequest): Promise<EmployeeItem> => {
    logger.log('info', 'Received employee create request: '.concat(JSON.stringify(employee)))
    if ((await employeeAccess.getEmployeeByCitizenId(userId, employee.citizenId)).length) throw new Error(`citizenId ${employee.citizenId} existed!`)
    const employeeId = uuid.v4();
    const newEmployee: EmployeeItem = {
        ...employee,
        userId,
        employeeId,
        onboardAt: new Date().toISOString()
    }
    await employeeAccess.createEmployee(newEmployee);
    return newEmployee;
}

export const updateEmployee = async (userId: string, employeeId: string, updateEmployee: UpdateEmployeeRequest): Promise<void> => {
    logger.log('info', 'Received employee update request: '.concat(employeeId))
    await employeeAccess.updateEmployee(userId, employeeId, updateEmployee)
}

export const deleteEmployee = async (userId: string, employeeId: string): Promise<void> => {
    logger.log('info', 'Received employee delete request: '.concat(employeeId))
    await employeeAccess.deleteEmployee(userId, employeeId)
}

export const generateUploadURL = async (userId: string, employeeId: string): Promise<string> => {
    logger.log('info', 'Uploading image for employee: '.concat(employeeId))
    const url = await employeeAccess.getUploadURL(userId, employeeId)
    return url 
}