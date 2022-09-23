import React from "react";
import { Row, Col } from 'react-bootstrap';
import './styles.scss';

const LoginPage = (props) => {
  const {
    auth,
  } = props;

  const handleLogin = () => {
    auth.login();
  }

  const handleLogout = () => {
    auth.logout();
  }
  
  return (
    <Row className='login-page-container'>
      <Col xs={6} className='text-left login-page-container__col-1'>
        {auth.isAuthenticated() && <span>Hi Tai</span>}
      </Col>
      <Col xs={6} className='d-flex justify-content-end login-page-container__col-2'>
        {auth.isAuthenticated() && <span onClick={handleLogout}>LogOut</span>}
        {!auth.isAuthenticated() && <span onClick={handleLogin}>LogIn</span>}
      </Col>
    </Row>
  )
}

export default LoginPage;