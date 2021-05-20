import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';


export default function UpdateProfile(props) {
    var name = "Sofia";
    var prevBio = "I travel 5-10 times a year, my hobbies are: photography, dancing. Love walking a lot. KAIST'2023, UCLA'2019";
    var prevAge = 19;
    var prevGender = 'female';
    var prevCountry = 'USA';
    var profilePic = 'https://s7g3.scene7.com/is/image/soloinvest/n00554A?$big_image_web$';
    var prevPhone = '';
    var prevKakao = '';
    const [gender, setGender] = useState('other');
    const handleChange = (event) => {
        setGender(event.target.value);
      };
    return <div>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '35px', textAlign: 'center', borderBottom: '2px #5c5c5c solid', fontFamily: 'roboto, sans-serif', fontSize: "20px", justifyContent:'center', color: 'black'}}>Update Profile</div>

        <div> <img src={profilePic} style={{width: '92%', marginTop: '5px'}}/> </div>
        <div style={{display: 'flex', flexDirection: 'column', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px'}}><TextField disabled id="name" label="Name" defaultValue={name}/></div>
        <div style={{display: 'flex', flexDirection: 'column', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px'}}><TextField id="age" label="Age" type="number" defaultValue={prevAge} /></div>
        <div style={{display: 'flex', flexDirection: 'column', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', textAlign: 'left'}}>
            <TextField
                id="selectGender"
                select
                label="Gender"
                value={gender}
                onChange={e => handleChange(e)}
                >
                    <MenuItem key={'male'} value={'male'}>
                        {'Male'}
                    </MenuItem>
                    <MenuItem key={'female'} value={'female'}>
                        {'Female'}
                    </MenuItem>
                    <MenuItem key={'other'} value={'other'}>
                        {'Prefer not to mention'}
                    </MenuItem>
        
            </TextField>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px'}}><TextField fullWidth id="bioText" label="About you" defaultValue={prevBio} multiline rows={3} /></div>
        <div style={{display: 'flex', flexDirection: 'column', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px'}}><TextField fullWidth id="country" label="Home Country" defaultValue={prevCountry} /></div>
        <div style={{display: 'flex', flexDirection: 'column', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px'}}>
            <TextField fullWidth id="phone" label="Phone Number" defaultValue={prevPhone} placeholder="82XXXXXXYYYY"  
            InputProps={{
            startAdornment: <InputAdornment position="start">+</InputAdornment>,
             }}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: '92%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px'}}><TextField fullWidth id="kakao" label="KakaoID" defaultValue={prevKakao} /></div>
        <div style={{width: '100%', height: '80px'}}></div>
        <div style={{display: 'flex', position: 'fixed', top: 'calc(99% - 50px)', width: '200px', left: '50%', marginLeft: '-100px'}}>
            
            <Fab color="secondary" variant="extended" style={{marginRight: '6%'}}>
                 Go Back 
            </Fab>
            <Fab color="primary" variant="extended">
                <div style={{}} >Update Profile</div>
            </Fab>
        </div>
    </div>
}