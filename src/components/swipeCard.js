import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Fab from '@material-ui/core/Fab';
import TimerIcon from '@material-ui/icons/Timer';

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
  return <div>
    <div style={{display: 'flex', backgroundColor: '#FBEEEE', width: '85%', height: '15%', position: 'fixed', top: '60px', marginLeft: '5px'}}>
      <div style={{display:'flex', alignItems: 'center', marginLeft: '4px'}}><ChevronLeftIcon color='action'/></div>
      <div style={{display: 'flex', width: '30%', height: '100%', alignItems: 'center'}}>
        <img src={props.image} style={{ height: '88%'}}></img>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{fontFamily: 'roboto, sans-serif', fontSize: '20px', marginTop: '5px'}}>
          {props.name} / {props.gender} / {props.age} 
        </div>
        <div style={{fontFamily: 'roboto, sans-serif', fontSize: '20px', marginTop: '5px', textAlign: 'left'}}>{props.travelText}</div>
        <div style={{display: 'flex', flexDirection: 'row', marginTop: '10px', fontFamily: 'roboto, sans-serif'}}>
          <Fab color='primary' variant='extended' size='small'>Go to Bio</Fab>
          <div style={{display: 'flex', width: '70px', backgroundColor: 'lightblue', height: '35px', marginLeft: '10px', textAlign: 'center'}}>

            <div style={{alignSelf: 'center', marginLeft: '1px'}}><TimerIcon size='small'/></div>
            <div style={{alignSelf: 'center'}}>{props.timeLeft}</div>
            </div>
        </div>
        
      </div>
      <div style={{display:'flex', alignItems: 'center', marginLeft: '4px'}}><ChevronRightIcon color='action'/></div>
    </div>
  </div>;
}