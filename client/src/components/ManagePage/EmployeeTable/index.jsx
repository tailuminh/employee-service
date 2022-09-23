import { Row, Col } from 'react-bootstrap';
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import moment from 'moment'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import './styles.scss';
import { apiEndpoint } from '../../../config';
const EmployeeTable = (props) => {
  const {
    auth,
    data = [],
    receiveEdit,
    receiveUpdate,
    receiveLoading,
    receiveUploadLoading,
    loading
  } = props;

  const className = loading.get || loading.delete ? 'loading-icon' : ''
  const token = auth.getIdToken();

  const getEmployee = async (token) => {
    const response = await axios.get(`${apiEndpoint}/employees`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    receiveLoading(false);
    receiveUpdate(response.data.items);
    receiveUploadLoading(false);
  }

  const deleteEmployee = async (token, employeeId) => {
    const res = await axios.delete(`${apiEndpoint}/employees/${employeeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (res.status === 200) {
      getEmployee(token);
    }
  }

  const deleteItem = (id) => {
    receiveLoading(true);
    const token = auth.getIdToken();
    deleteEmployee(token, id);
  }

  const editItem = (obj, type) => {
    receiveEdit(obj, type);
  }

  const getUploadUrl = async (token, employeeId) => {
    const response = await axios.post(`${apiEndpoint}/employees/${employeeId}/attachment`, '', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data.uploadUrl;
  }


  const uploadFile = async (uploadUrl, file) => {
    const res = await axios.put(uploadUrl, file);
    if (res.status === 200) {
      getEmployee(token);
    }
  }

  const handleUpload = async (e, id) => {
    receiveUploadLoading(true);
    const file = e.target.files[0];
    const uploadUrl = await getUploadUrl(token, id);
    await uploadFile(uploadUrl, file);
  }

  return (
    <Row>
      <Col xs={12} className='title mt-2 mb-4'>Employee Table</Col>
      <Col xs={12} className={className}>
        {
          loading.get || loading.delete ? <Spinner animation='border' variant="info" /> :
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th className='text-center p-3'>Avatar</th>
                  <th className='text-center p-3'>EmployeeId</th>
                  <th className='text-center p-3'>First Name</th>
                  <th className='text-center p-3'>Last Name</th>
                  <th className='text-center p-3'>Department</th>
                  <th className='text-center p-3'>Address</th>
                  <th className='text-center p-3'>Date Of Birth</th>
                  <th className='text-center p-3'>Working Status</th>
                  <th className='text-center p-3'>Action</th>
                  <th className='text-center p-3'>Upload Avatar</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map(item => {
                    return (
                      <tr key={item.employeeId}>
                        <td className='avatar'>
                          {
                            loading.upload ? <Spinner animation='grow' variant="info" /> : <img src={item.attachmentUrl} alt='' />
                          }

                        </td>
                        <td>{item.citizenId}</td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.department}</td>
                        <td>{item.address}</td>
                        <td>{moment(new Date(item.dob)).format('YYYY-MM-DD')}</td>
                        <td>{item.workingStatus}</td>
                        <td className='text-center d-flex'>
                          <Button variant="secondary" className='m-2' onClick={() => editItem(item, 'UPDATE')}>Edit</Button>
                          <Button variant="danger" className='m-2' onClick={() => deleteItem(item.employeeId)}>Delete</Button>
                        </td>
                        <td>
                          <Form.Group controlId="formFile" className="mb-3">
                            <Form.Control type="file" accept='image/*' onChange={(e) => handleUpload(e, item.employeeId)} />
                          </Form.Group></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
        }
      </Col>

    </Row>

  )
}

export default EmployeeTable;