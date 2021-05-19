import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import RequestAlert from './../components/requestAlert';
export default function NewRequest(props) {
    var alertDiv;
    const [alert, setAlert] = useState(false);
    if(alert == true){
        alertDiv = <RequestAlert/>;
    }
    return <div>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '35px', textAlign: 'center', borderBottom: '2px #5c5c5c solid', fontFamily: 'roboto, sans-serif', fontSize: "20px", justifyContent:'center', color: 'black'}}>New request</div>
        <div style={{display: 'flex', flexDirection: 'column', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '5px'}}><TextField fullWidth id="travelText" label="About path" placeholder="Explain why you chose the path" multiline rows={3}/></div>
        <div style={{display: 'flex', flexDirection: 'column', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '5px'}}><TextField fullWidth id="visitText" label="About visit" placeholder="Explain why you are visiting the city" multiline rows={3}/></div>
        <div style={{display: 'flex', flexDirection: 'row', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', justifyContent: 'center'}}>
            <div style={{marginRight: '20px', alignSelf: 'center'}}>Choose departure time</div>
            <TextField type="time"/>
        </div>
        <div style={{display: 'flex', position: 'fixed', top: 'calc(99% - 50px)', width: '200px', left: '50%', marginLeft: '-100px'}}>
            
            <Fab color="secondary" variant="extended" style={{marginRight: '6%'}}>
                 Cancel 
            </Fab>
            <Fab color="primary" variant="extended" onClick={function(){ setAlert(true); setTimeout(function(){setAlert(false)}, 1500)}}>
                <div style={{}} >Create request</div>
            </Fab>
        </div>
        <div style={{width: '100%', height: '80px'}}></div>
        {alertDiv}
    </div>
}