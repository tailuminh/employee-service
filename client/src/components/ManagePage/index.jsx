import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { apiEndpoint } from '../../config';
import CreateEmployee from './CreateEmployee';
import axios from "axios";
import EmployeeTable from './EmployeeTable';
import './styles.scss';

const ManagePage = (props) => {
  const {
    auth
  } = props;

  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState({
    get: true,
    create: undefined,
    update: undefined,
    delete: undefined,
    upload: undefined,
  });
  const [edit, setEdit] = useState({});

  const getEmployee = async (token) => {
    const response = await axios.get(`${apiEndpoint}/employees`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    if (response.status !== 200) {
      return
    }
    setEmployeeData(response.data.items);
    setLoading({ ...loading, get: false });
  }

  useEffect(() => {
    const token = auth.getIdToken();
    if (token) {
      getEmployee(token);
    }
  }, [])

  const receiveUpdate = (item) => {
    setEmployeeData(item)
  }

  const receiveEdit = (obj, type) => {
    setEdit({
      item: obj,
      type: type
    })
  }

  const receiveDeleteLoading = (val) => {
    setLoading({...loading, delete: val});
  }

  const receiveCreateLoading = (val) => {
    setLoading({...loading, create: val});
  }

  const receiveUpdateLoading = (val) => {
    setLoading({...loading, update: val});
  }

  const receiveUploadLoading = (val) => {
    setLoading({...loading, upload: val});
  }
  
  return (
    <Row className='manage-employee-container'>
      <Col xs={12}>
        <CreateEmployee
          auth={auth}
          receiveUpdate={receiveUpdate}
          editEmployee={edit}
          loading={loading}
          receiveCreateLoading={receiveCreateLoading}
          receiveUpdateLoading={receiveUpdateLoading}
        />
      </Col>
      <hr className='mx-2' />
      <Col xs={12} className='mt-3'>
        <EmployeeTable
          auth={auth}
          receiveLoading={receiveDeleteLoading}
          receiveUploadLoading={receiveUploadLoading}
          data={employeeData}
          loading={loading}
          receiveUpdate={receiveUpdate}
          receiveEdit={receiveEdit}
        />
      </Col>
    </Row>
  )
}

export default ManagePage;