import React from 'react'
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.scss';
import LoginPage from './components/LoginPage'
import NoDataDisplay from './components/NoDataDisplay'
import ManagePage from './components/ManagePage'

const App = (props) => {
  const {
    auth,
  } = props;

  return (
    <Row className='app-container'>
      <Col xs={12} className='app-container__header'>
          <LoginPage auth={auth}/>
      </Col>
      <Col xs={12} className='app-container__content'>
        {
          auth.isAuthenticated() ? <ManagePage auth={auth}/> : <NoDataDisplay/>
        }
      </Col>
    </Row>
  )
}

export default App;
