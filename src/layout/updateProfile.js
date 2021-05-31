import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import {
  TextField,
  Fab,
  MenuItem,
  InputAdornment,
  Slide,
  Paper,
  Backdrop,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import RequestAlert from './../components/requestAlert';

import useStore from '../hooks/use-store';
import { useUserDatabase } from '../hooks/use-database';
import { countryToFlag, countries } from '../utils/countries';
import './updateProfile.css';

export default observer(function UpdateProfile({
  title = 'Update Profile',
  disableGoBack = false,
}) {
  /**
   * README
   *
   * Do not deal with mode itself in here, as this components set the initial contents from firebase
   */

  const { setMode, userID } = useStore();
  const [user, , updateUser, loaded] = useUserDatabase(userID);
  const [loading, setLoading] = useState(true);
  const [backdropStack, setBackdropStack] = useState(0);
  const [updating, setUpdating] = useState(false);

  const [profileImage, setProfileImage] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(19);
  const [gender, setGender] = useState('other');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState(countries[0]);
  const [countryInput, setCountryInput] = useState('');
  const [phone, setPhone] = useState('');
  const [kakao, setKakao] = useState('');

  useEffect(() => {
    setLoading(!loaded);
    if (loaded) {
      if (user.profileImage) setProfileImage(user.profileImage);
      if (user.name) setName(user.name);
      if (user.age) setAge(user.age);
      if (user.gender) setGender(user.gender);
      if (user.bio) setBio(user.bio);
      if (user.country) {
        const it = countries.find((it) => it.code === user.country);
        setCountry(it);
        setCountryInput(it.label);
      }
      if (user.phone) setPhone(user.phone);
      if (user.kakao) setKakao(user.kakao);
      setBackdropStack(0);
    }
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (backdropStack >= 3) {
      setMode('main');
    }
  }, [backdropStack, setMode]);

  /*const alertDiv = openAlert ? (
    <RequestAlert message={'profile is successfully updated'} />
  ) : (
    <></>
  );*/
  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (ee) => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Backdrop
        open={loading}
        onClick={() => {
          setBackdropStack((prev) => prev + 1);
        }}
        style={{ zIndex: 11 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop open={updating} style={{ zIndex: 11 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Slide in={true}>
        <Paper elevation={3} className="update-profile-container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '35px',
              textAlign: 'center',
              borderBottom: '2px #5c5c5c solid',
              fontFamily: 'roboto, sans-serif',
              fontSize: '20px',
              justifyContent: 'center',
              color: 'black',
            }}
          >
            {title}
          </div>
          <div>
            {profileImage.length > 0 ? (
              <img
                src={profileImage}
                style={{ width: '92%', marginTop: '5px' }}
                alt="ProfileImage"
              />
            ) : (
              <Typography variant="body2" style={{ margin: 10 }}>
                "You haven't uploaded your image"
              </Typography>
            )}
            <br />
            <input
              accept="image/*"
              id="profile-upload-image-file"
              type="file"
              onChange={handleUploadImage}
              style={{ display: 'none' }}
            />
            <label htmlFor="profile-upload-image-file">
              <Fab
                component="span"
                color="primary"
                size={profileImage.length > 0 ? 'small' : 'medium'}
              >
                <AddPhotoAlternateIcon />
              </Fab>
            </label>
            {profileImage.length > 0 && (
              <Fab
                component="span"
                color="secondary"
                onClick={() => setProfileImage('')}
                size="small"
                style={{ marginLeft: 30 }}
              >
                <DeleteIcon />
              </Fab>
            )}
          </div>{' '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '92%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '10px',
            }}
          >
            <TextField id="id" label="ID" value={userID} disabled />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '92%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '10px',
            }}
          >
            <TextField
              id="name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '92%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '10px',
            }}
          >
            <TextField
              id="age"
              label="Age"
              type="number"
              value={age}
              onChange={(e) => {
                setAge(e.target.valueAsNumber);
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '92%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '10px',
              textAlign: 'left',
            }}
          >
            <TextField
              id="selectGender"
              select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '92%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '10px',
            }}
          >
            <TextField
              fullWidth
              id="bioText"
              label="About you"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              variant="outlined"
              multiline
              rows={3}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '92%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '10px',
            }}
          >
            <Autocomplete
              options={countries}
              autoHighlight
              value={country}
              onChange={(e, it) => {
                console.log(it);
                setCountry(it);
              }}
              inputValue={countryInput}
              onInputChange={(e, it) => setCountryInput(it)}
              getOptionLabel={(option) => option.label}
              getOptionSelected={(option, value) => option.code === value.code}
              renderOption={(option) => (
                <>
                  <span>{countryToFlag(option.code)}</span>
                  {option.label} ({option.code}) +{option.phone}
                </>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose your home country"
                  variable="standard"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  }}
                />
              )}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '92%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '10px',
            }}
          >
            <TextField
              fullWidth
              id="phone"
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="82XXXXXXYYYY"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+</InputAdornment>
                ),
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '92%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '10px',
            }}
          >
            <TextField
              fullWidth
              id="kakao"
              label="KakaoID"
              value={kakao}
              onChange={(e) => setKakao(e.target.value)}
            />
          </div>
          <div style={{ width: '100%', height: '80px' }}></div>
          <div
            style={{
              display: 'flex',
              position: 'fixed',
              top: 'calc(99% - 50px)',
              width: '200px',
              left: '50%',
              marginLeft: '-100px',
            }}
          >
            {!disableGoBack && (
              <Fab
                color="secondary"
                variant="extended"
                style={{ marginRight: '6%' }}
                onClick={() => setMode('main')}
              >
                Go Back
              </Fab>
            )}
            <Fab
              color="primary"
              variant="extended"
              onClick={() => {
                setUpdating(true);
                updateUser(
                  {
                    profileImage,
                    name,
                    age,
                    gender,
                    bio,
                    country: country.code,
                    phone,
                    kakao,
                  },
                  (error) => {
                    setUpdating(false);
                    setMode('main');
                  }
                );
              }}
            >
              Update Profile
            </Fab>
          </div>
        </Paper>
      </Slide>
    </>
  );
});
