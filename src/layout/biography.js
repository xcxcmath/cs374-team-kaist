import React, { useState, useEffect, createElement } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import PlaceIcon from '@material-ui/icons/Place';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Fab from '@material-ui/core/Fab';
import { $mobx } from 'mobx';
import TextField from '@material-ui/core/TextField';
import RequestAlert from './../components/requestAlert';

var name = 'Sofia';
var age = '19';
var fromPlace = 'USA';
var gender = 'female';
var bioText = "I travel 5-10 times a year, my hobbies are: photography, dancing. Love walking a lot. KAIST'2023, UCLA'2019";
var visitText = "I came to South Korea attend BTS concert"
var moveText = "I want to get to GS25 convenience store to get some drinks and snacks, because we have a movie night tonight"
var finalDest = "GS25 convenience store, 160 Cheongsa-ro";
var profilePic = 'https://s7g3.scene7.com/is/image/soloinvest/n00554A?$big_image_web$';
var status = 'waiting';
var KakaoID = "ABC";
var phoneNum = "+8232312321";

export default function Biography(props) {
    var contact_info;
    var buttons;
    var travel_info;
    var alertDiv;
    const [st, setSt] = useState(status);
    const [repDisplay, setRepDisplay] = useState(false);
    const [alert, setAlert] = useState(false);
    if(alert == true){
        alertDiv = <RequestAlert message={"you and " + name + " are now companions"}/>;
    }
    let repStyle = {
        display: 'none'
    }
    if(repDisplay == true){
        repStyle = {
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '4%',
            marginRight: '4%'
        }
    }
    if(st == 'approved'){
        contact_info = <div><div style={{display: 'flex', alignItems: 'flex-start', width: '100%', marginTop: '10px',}}>
        <div style={{marginLeft: '4%', textAlign: 'left', fontFamily: 'roboto, sans-serif', fontSize: '20px', width:'92%'}}>Contact Information:</div>
    </div> 
    <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', }}>
        <div style={{marginLeft: '4%', textAlign: 'left', fontFamily: 'roboto, sans-serif', fontSize: '20px', width:'92%'}}>Phone number: {phoneNum}</div>
    </div>  
    <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
        <div style={{marginLeft: '4%', textAlign: 'left', fontFamily: 'roboto, sans-serif', fontSize: '20px', width:'92%'}}>KakaoID: {KakaoID}</div>
    </div>   
    </div>
        buttons = <div style={{display: 'flex', position: 'fixed', top: 'calc(99% - 50px)', width: '90px', left: '50%', marginLeft: '-45px'}}>
            <Fab color="secondary" variant="extended" style={{}}>
                Go&nbsp;Back
            </Fab>
        </div>
    }
    else if(st == 'waiting'){
        buttons = <div style={{display: 'flex', position: 'fixed', top: 'calc(99% - 50px)', width: '200px', left: '50%', marginLeft: '-100px'}}>
            <Fab color="secondary" variant="extended" style={{marginRight: '6%'}}>
                Decline
            </Fab>
            <Fab color="primary" variant="extended" style={{}}>
                <div style={{}} onClick={function(){setSt('approved'); setAlert(true); setTimeout(function(){setAlert(false)}, 1500)}}>Accept</div>
            </Fab>
        </div>
    }
    else{
        buttons = <div style={{display: 'flex', position: 'fixed', top: 'calc(99% - 50px)', width: '200px', left: '50%', marginLeft: '-100px'}}>
            <Fab color="secondary" variant="extended" style={{marginRight: '6%'}}>
                Go&nbsp;Back
            </Fab>
            <Fab color="primary" variant="extended" style={{}}>
                <div style={{}}>Accept</div>
            </Fab>
        </div>
        travel_info = <div>
            <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', marginTop: '10px', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
                <div style={{marginLeft: '4%', textAlign: 'left', fontFamily: 'roboto, sans-serif', fontSize: '20px', color: '#5c5c5c', width:'92%'}}>Reason for travel: {moveText}</div>
            </div>  
            <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', marginTop: '10px', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
                <div style={{marginLeft: '4%', textAlign: 'left', fontFamily: 'roboto, sans-serif', fontSize: '20px', color: '#5c5c5c', width:'92%'}}>Reason for visiting the country: {visitText}</div>
            </div>
    </div>
    }
    return <div>
        <div>
            <img src={profilePic} style={{width: '100%'}}/>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', width: '100%'}}>
            <div
            style={{ fontFamily: 'roboto, sans-serif', marginLeft: '4%', fontSize: '34px', fontWeight: 'bold',}}>{name}, </div>
            <div style={{fontFamily: 'roboto, sans-serif', fontSize: '34px', }}>{age}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
            <div style={{marginLeft: '4%'}}>{<HomeIcon/>}</div>
            <div style={{alignSelf: 'center', textAlign: 'left', fontFamily: 'roboto, sans-serif'}}> home country: {fromPlace}</div>
        </div>
        
        <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', }}>
            <div style={{marginLeft: '4%'}}>{<AccountCircleIcon/>}</div>
            <div style={{alignSelf: 'center', textAlign: 'left', fontFamily: 'roboto, sans-serif'}}>gender: {gender}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
            
            <div style={{marginLeft: '4%'}}>
            {<PlaceIcon/>}
            </div>
            <div style={{alignSelf: 'center', textAlign: 'left', fontFamily: 'roboto, sans-serif'}}>final destination: {finalDest}</div>
        </div>
        {contact_info}
        
        <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', marginTop: '10px', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
            <div style={{marginLeft: '4%', textAlign: 'left', fontFamily: 'roboto, sans-serif', fontSize: '20px', color: '#5c5c5c', width:'92%'}}>About myself: {bioText}</div>
        </div>
        <div style={{width: '100%', marginTop: '10px', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
            <div style={{fontFamily: 'roboto, sans-serif'}} id="repBtn" onClick={() => setRepDisplay(true)} >
                Report {name}
            </div>
            <div style={repStyle}>
                <div>
                    <div style={{alignSelf: 'center'}}>
                        <TextField id="repText" label="Describe bad behavior" multiline rowsMax={3} fullWidth />
                    </div>
                </div>
                
                <div style={{marginTop: '7px', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <div onClick={() => setRepDisplay(false)} style={{width: '50%', textAlign: 'center'}}>Cancel</div>
                    <div style={{width: '50%', textAlign: 'center', borderLeft: '1px #5c5c5c solid'}}>Submit</div>
                </div>
            </div>
        </div>
        <div style={{width: '100%', height: '80px'}}></div>
        {buttons}
        {alertDiv}
    </div>
    
    
  }