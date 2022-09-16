export interface CreateEmployeeRequest {
    userId: string
    citizenId: string
    firstName: string
    lastName: string
    dob: string
    department: string
    address: string
    status: string
    attachmentUrl?: string
  }
  