import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Fab from '@material-ui/core/Fab';
import TimerIcon from '@material-ui/icons/Timer';
import { PowerInputSharp } from '@material-ui/icons';

//example call: 
      // <SwipeCard 
      //   image ="https://s7g3.scene7.com/is/image/soloinvest/n00554A?$big_image_web$"
      //   name = "Sofia"
      //   age = "19"
      //   gender = "female"
      //   travelText = "Going to GS25"
      //   timeLeft = "3 min"
      // />
export default function SwipeCard(props) {
  if(props.empty == true){
    return <div>
      <div style={{display: 'flex', flexDirection:'column', backgroundColor: '#FBEEEE', width: '85%', height: '100px', position: 'fixed', top: '60px', marginLeft: '5px'}}>
        <div style={{marginLeft: '4%', marginRight: '4%', textAlign: 'center'}}>No companions available. Do you want to create new request?</div>
        <div style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '5%'}}>
          <div style={{marginRight: '25px', display: 'inline'}}>Yes</div>
          <div style={{display: 'inline'}}>No</div>
        </div>
      </div>
    </div>
  }
  return <div>
    <div style={{display: 'flex', backgroundColor: '#FBEEEE', width: '85%', height: '100px', position: 'fixed', top: '60px', marginLeft: '5px'}}>
      <div style={{display:'flex', alignItems: 'center'}}><ChevronLeftIcon color='action'/></div>
      <div style={{display: 'flex', height: '100%', alignItems: 'center'}}>
        <img src={props.image} style={{ height: '88%'}}></img>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', marginLeft: '6px'}}>
        <div style={{fontFamily: 'roboto, sans-serif', fontSize: '16px', marginTop: '4px', textAlign: 'left'}}>
          {props.name} / {props.gender} / {props.age} 
        </div>
        <div style={{fontFamily: 'roboto, sans-serif', fontSize: '16px', marginTop: '3px', textAlign: 'left'}}>{props.travelText}</div>
        <div style={{display: 'flex', flexDirection: 'row', marginTop: '8px', fontFamily: 'roboto, sans-serif'}}>
          <div style={{}}><Fab color='primary' variant='extended' size='small'>Go&nbsp;to&nbsp;Bio</Fab></div>
          <div style={{display: 'flex', width: '70px', backgroundColor: 'lightblue', height: '35px', textAlign: 'center', marginLeft: '10px'}}>

            <div style={{alignSelf: 'center', marginLeft: '1px'}}><TimerIcon size='small'/></div>
            <div style={{alignSelf: 'center', fontSize: '16px'}}>{props.timeLeft}</div>
            </div>
        </div>
        
      </div>
      <div style={{display:'flex', alignItems: 'center', marginLeft: 'auto'}}><ChevronRightIcon color='action'/></div>
    </div>
  </div>;
}