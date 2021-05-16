import React, { useState, useEffect } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import PlaceIcon from '@material-ui/icons/Place';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Fab from '@material-ui/core/Fab';

var name = 'Sofia';
var age = '19';
var fromPlace = 'USA';
var gender = 'female';
var bioText = "I travel 5-10 times a year, my hobbies are: photography, dancing. Love walking a lot. KAIST'2023, UCLA'2019";
var visitText = "I came to South Korea attend BTS concert"
var moveText = "I want to get to GS25 convenience store to get some drinks and snacks, because we have a movie night tonight"
var finalDest = "GS25 convenience store, 160 Cheongsa-ro";

export default function Biography(props) {
    return <div>
        <div>
            <img src='https://s7g3.scene7.com/is/image/soloinvest/n00554A?$big_image_web$' style={{width: '100%'}}/>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', width: '100%'}}>
            <div
            style={{ fontFamily: 'roboto, sans-serif', marginLeft: '4%', fontSize: '34px', fontWeight: 'bold',}}>{name}, </div>
            <div style={{fontFamily: 'roboto, sans-serif', fontSize: '34px', }}>{age}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
            <div style={{marginLeft: '4%'}}>{<HomeIcon/>}</div>
            <div style={{alignSelf: 'center', textAlign: 'left'}}> home country: {fromPlace}</div>
        </div>
        
        <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', }}>
            <div style={{marginLeft: '4%'}}>{<AccountCircleIcon/>}</div>
            <div style={{alignSelf: 'center', textAlign: 'left'}}>gender: {gender}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
            
            <div style={{marginLeft: '4%'}}>
            {<PlaceIcon/>}
            </div>
            <div style={{alignSelf: 'center', textAlign: 'left'}}>final destination: {finalDest}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', marginTop: '10px', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
            <div style={{marginLeft: '4%', textAlign: 'left', fontFamily: 'Lora, serif', fontSize: '20px', color: '#5c5c5c', width:'92%'}}>Reason for travel: {moveText}</div>
        </div>  
        <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', marginTop: '10px', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
            <div style={{marginLeft: '4%', textAlign: 'left', fontFamily: 'Lora, serif', fontSize: '20px', color: '#5c5c5c', width:'92%'}}>Reason for visiting the country: {visitText}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start', width: '100%', marginTop: '10px', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
            <div style={{marginLeft: '4%', textAlign: 'left', fontFamily: 'Lora, serif', fontSize: '20px', color: '#5c5c5c', width:'92%'}}>About myself: {bioText}</div>
        </div>
        <div style={{width: '100%', marginTop: '10px', paddingBottom: '10px', borderBottom: '1px #5c5c5c solid'}}>
            <div style={{fontFamily: 'roboto, sans-serif'}}>
                Report {name}
            </div>
        </div>
        <div style={{width: '100%', height: '80px'}}></div>
        <div style={{display: 'flex', position: 'fixed', top: '90%', width: '200px', left: '50%', marginLeft: '-100px'}}>
            <Fab color="primary" variant="extended" style={{marginRight: '6%'}}>
                <div style={{}}>Accept</div>
            </Fab>
            <Fab color="secondary" variant="extended">
                Go&nbsp;Back
            </Fab>
        </div>
    </div>
    
    
  }