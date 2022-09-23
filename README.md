# employee-service
Capstone Project - Serverless - Udacity Cloud Developer

## Description
This application is a employee management application that allow company to store and manage their employees personal information.
The application include with both serverless back-end and front-end modules.

## Note
This project is based on the starter code of project-04 in `cloud-developer` repository provided in Udacity Cloud Developer course.
All the deployment and run steps are similar to the project Serverless Application.

## Usage
### 1. Installation
Clone the repository to your local machine, then cd to `./client`, run the client service with command:

`npm install` or use with (`--force`) if any installation issue occurred

### 2. Start-up client at local
Run the client service with command:

`npm run start`

After the UI started successfully on local machine, the new browser windows will be automatically show up with URL: `http://localhost:3000/`

At the first time use, user need to register for their account and login with that credential before registering any of their projects.

### 3. Create/Delete employee info
To create new employee info, all the fields below should be provided:

- CitizenId: unique citizen identifier (only 1 citizenId allowed within a company)
- First name / Last name: name of the employee
- Department: name of the department that employee work for
- Address: employee home address

You can also delete employee info by clicking on the red button at the end of each record row.

### 4. Upload employee image
This action is done by clicking on the blue button and provide the image file. This file will then be uploaded to S3 bucket and show on the page.

### 5. Note
- All the field need to be input with string with minimum length of 2 and no spacing allowed at the beginning.