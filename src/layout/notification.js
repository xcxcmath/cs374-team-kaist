import React from 'react'
import { observer } from 'mobx-react';
import {Slider} from '@material-ui/core'
export default observer(function Notification(){
    return (<div id = "ABCDE" style={{
        height: "30vh",
        width: "20wh",
        backgroundColor: 'white',
        boxShadow: '1px',
        position: 'absolute',
        right: 5,
        top: 5,
      }}>
        <div class="notif-settings">
  <p class="heading" style ={{
    fontFamily: "Roboto,sans-serif",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "24px",
    lineHeight: "28px",
}}>Notification Settings</p>
    <p class="description" style = {{
    fontFamily: "Roboto,sans-serif",
fontStyle: "normal",
fontWeight: "normal",
fontSize: "18px",
lineHeight: "21px",
}}>Notify safety issues for every Infinite walking</p>
  <input id="frequency" type="range"  min="1" max="100" value="50"
    style = {{
    width: "369px",
    height: "5px",
    background: "grey",
    opacity: "0.7",
    transition: "opacity .2s",
}
    }
  />
    <p class="description">Nearby radius 100 km</p>
    <input id="radius" type="range"  min="1" max="100" value="50"
      style = {{
    width: "369px",
    height: "5px",
    background: "grey",
    opacity: "0.7",
  transition: "opacity .2s",
}}
    />
    <button id="add" type="button" onclick="" style = {
      {
    position:"absolute",
    right:"5px",
    bottom:"5px",
    width:"70px",
    height:"34px",
    borderRadius: "24px",
    backgroundColor:" #2EB4FF",
    color:"#FFFFFF",
    border: "none",
}
    }>Add</button>
    <button id="cancel" type="button" onclick="" style = {
      {
    position:"absolute",
    right:"85px",
    bottom:"5px",
    width:"70px",
    height:"34px",
    borderRadius: "24px",
    backgroundColor: "#8E8E8E",
    color:"#FFFFFF",
    border: "none",
}
    }>Cancel</button>
</div>
<div id="pop-up" style = {{
      position: "absolute",
      top:"40%",
      right:"50%",
      height:"30vh",
      width: "80vw",
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      color: "#FFFFFF",
      borderRadius: "16px",
    }}>
  <p class="heading" style = {{
      fontFamily:" Roboto,sans-serif",
fontStyle: "normal",
fontWeight:" bold",
fontSize: "120%",
lineHeight: "28px",
    }}>Theft</p>
  <p class="subheading" style = {{
      fontFamily:" Roboto,sans-serif",
fontStyle: "normal",
fontWeight: "300",
fontSize: "110%",
      lineHeight: "21px",
    }}>King's Cross station</p>
  <p class="details" style = {{
      fontFamily: "Roboto,sans-serif",
fontStyle: "normal",
fontWeight: "300",
fontSize: "100%",
      lineHeight: "16px"
    }}>Avg. 8 events per day</p>
  <p class="details">Recent event: 2 hours ago</p>
  <button id="safer" type="button" onclick="" style={{
    fontSize:"100%",
    position:"absolute",
    left:"4%",
    bottom:"5px",
    width:"44%",
    height:"20%",
    borderRadius: "24px",
    backgroundColor: "#2EB4FF",
    color:"#FFFFFF",
    border: "none",
    }}>Find Safer Path</button>
  <button id="companion" type="button" onclick="" style = {{
      position:"absolute",
    right:"4%",
    bottom:"5px",
    width:"44%",
    height:"20%",
    borderRadius:" 24px",
    backgroundColor: "#2EB4FF",
    color:"#FFFFFF",
    border: "none",
    }}>Find a Companion</button>
</div>
    </div>)
})