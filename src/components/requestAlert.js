import React, { useState, useEffect } from 'react'
import Alert from '@material-ui/lab/Alert';

export default function RequestAlert(props) {
    return <div style={{display: 'flex', position: 'fixed', top: 'calc(99% - 40px)', width: '100%'}}>
        <div ><Alert>Request was successfully created</Alert></div>
    </div>
}