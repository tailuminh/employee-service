import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import DatePicker from 'react-datepicker'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import './styles.scss';
import { apiEndpoint } from "../../../config";
import { useEffect, useState } from "react";

const CreateEmployee = (props) => {

  const {
    auth,
    editEmployee,
    receiveUpdate,
    receiveUpdateLoading,
    receiveCreateLoading,
    loading
  } = props;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {

    }
  });

  const [type, setType] = useState('');

  const getEmployee = async (token) => {
    const response = await axios.get(`${apiEndpoint}/employees`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    receiveCreateLoading(false);
    receiveUpdate(response.data.items);
    receiveUpdateLoading(false);
  }

  const createEmployee = async (payload, token) => {
    const response = await axios.post(`${apiEndpoint}/employees`, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.status !== 201) {
      return;
    }
    getEmployee(token);
    reset();
  }


  const updateEmployee = async (token, employeeId, payload) => {
    const res = await axios.patch(`${apiEndpoint}/employees/${employeeId}`, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.status === 200) {
      getEmployee(token);
      reset();
      setType('CREATE');
    }
  }

  const onSubmit = (formData) => {
    const token = auth.getIdToken();

    if (type === 'UPDATE') {
      receiveUpdateLoading(true);
      updateEmployee(token, editEmployee.item.employeeId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        department: formData.department,
        address: formData.address,
        workingStatus: formData.workingStatus
      })
    } else {
      receiveCreateLoading(true)
      const payload = {
        citizenId: formData.citizenId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        department: formData.department,
        address: formData.address,
        workingStatus: formData.workingStatus
      }
      createEmployee(payload, token);
    }
  };

  useEffect(() => {
    setType(editEmployee.type);
    if (editEmployee.item) {
      setValue('citizenId', editEmployee.item.citizenId)
      setValue('firstName', editEmployee.item.firstName)
      setValue('lastName', editEmployee.item.lastName)
      setValue('department', editEmployee.item.department)
      setValue('address', editEmployee.item.address)
      setValue('dob', new Date(editEmployee.item.dob))
      setValue('workingStatus', editEmployee.item.workingStatus)
    }
  }, [editEmployee])

  const onCancel = () => {
    reset();
    setType('CREATE');
  }

  return (

    <Row className='my-4 form'>
      <Col xs={12} className='title my-2'>Create new employee</Col>
      <Col xs={8}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mt-1">
            <Col xs={4}>
              <Form.Group className="mb-3" controlId="citizenId">
                <Form.Label>EmployeeId:</Form.Label>
                <Form.Control
                  type="text"
                  {...register("citizenId", { 
                    required: "This field is required",
                    pattern: {
                      value: /^[0-9]{12}$/i,
                      message: "Mus be 12-digit numbers "
                    }
                  })}
                />
                {errors.citizenId && (
                  <Form.Text className="text-danger">
                    {errors.citizenId.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>FirstName:</Form.Label>
                <Form.Control
                  type="text"
                  {...register("firstName", { required: "This field is required" })}
                />
                {errors.firstName && (
                  <Form.Text className="text-danger">
                    {errors.firstName.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={4}>
              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>LastName:</Form.Label>
                <Form.Control
                  type="text"
                  {...register("lastName", { required: "This field is required" })}
                />
                {errors.lastName && (
                  <Form.Text className="text-danger">
                    {errors.lastName.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Form.Group className="mb-3" controlId="department">
                <Form.Label>Department:</Form.Label>
                <Form.Control
                  type="text"
                  {...register("department", { required: "This field is required" })}
                />
                {errors.department && (
                  <Form.Text className="text-danger">
                    {errors.department.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={4}>
              <Form.Group className="mb-3 date-picker" controlId="address">
                <Form.Label>Date Of Birth:</Form.Label>
                <Controller
                  control={control}
                  name='dob'
                  register={register('dob',{ required: "This field is required" })}
                  render={({ field }) => (
                    <DatePicker
                      placeholderText='Select date'
                      onChange={(e) => { field.onChange(e) }}
                      selected={field.value}
                      dateFormat='yyyy-MM-dd'
                    />
                  )}
                />
                {errors.dob && (
                  <Form.Text className="text-danger">
                    {errors.dob.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address:</Form.Label>
                <Form.Control
                  type="text"
                  {...register("address", { required: "This field is required" })}
                />
                {errors.address && (
                  <Form.Text className="text-danger">
                    {errors.address.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={4}>
              <Form.Group className="mb-3 radio-group" controlId="workingStatusr">
                <Form.Label>WorkingStatus:</Form.Label>
                <Form.Check
                  type="radio"
                  label="Active"
                  id="workingStatus"
                  value='active'
                  name="workingStatus"
                  {...register("workingStatus")}
                />
                <Form.Check
                  type="radio"
                  label="Pending"
                  id="workingStatus"
                  value='pending'
                  name="workingStatus"
                  {...register("workingStatus", { required: "This field is required" })}
                />
                {errors.workingStatus && (
                  <Form.Text className="text-danger">
                    {errors.workingStatus.message}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col className="text-left">
              <Button variant="secondary" onClick={onCancel}>Cancel</Button>
              {
                type !== 'UPDATE' && <Button variant="success" className='mx-4' type='submit'>
                {
                  loading.create ? <Spinner animation='border' variant="info" /> : 'Create'
                }
                </Button>
              }
              {
               type === 'UPDATE'&& <Button variant="success" className='mx-4' type='submit'>
                {
                  loading.update ? <Spinner animation='border' variant="info"/> : 'Update'
                }
               </Button>
              }
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>

  )
}

export default CreateEmployee;