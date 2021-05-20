import React, { useState, useEffect, createElement } from 'react';
import TextField from '@material-ui/core/TextField';

export default function Login(props) {
    return <div>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '35px', textAlign: 'center', borderBottom: '2px #5c5c5c solid', fontFamily: 'roboto, sans-serif', fontSize: "20px", justifyContent:'center', color: 'black'}}>Login</div>
        <div style={{display: 'flex', flexDirection: 'column', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px'}}><TextField id="name" label="Name" /></div>

    </div>
}