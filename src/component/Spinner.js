import React from 'react'
import { Spinner as ReactStrapSpinner } from 'reactstrap';

const Spinner = () => {
  return (
    <div className='d-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}>
        <ReactStrapSpinner />
    </div>
  )
}

export default Spinner;