# Getting Started with Create React App

## Project Due

- 5/19 : Components Designs
- 5/26 : PPT

**PLEASE work on your own branch, not master**

---

## TODO

### general

- Message box for checking deletion
- Snackbar to show what happened

### map

- applying Jihun and Assel's works

### companion

- More robuts logics for matching companions
- More materialized designs for companion frames
- Deleting waiting & pending request (those for `accepted` are implemented)
- Posting report

## How to test

**Please prepare 2 ID that you want**
For example,

- Jihun: `jihun` and `jihun2`
- Arsen: `arsen` and `arsen2`
- Assel: `assel` and `assel2`

Or, if your want to test with just one ID, you can configure auto-login on `.env` file.
Please uncomment line containing `REACT_APP_PRELOGIN` and **set the ID as your one.**

Now, you don't have to change the mapbox public key and firebase config.

## How to Login

Just put in your preferred ID.

- If it is new, sign up frame is respawned
- If it is old, main frame is respawned

## After login

- You can restore your path plan from firebase
- You can update your profile
- You can update the notification configuration
- You can see, post, and delete request (see below)

## About Companion

- The recommended list is generated based on 2 distances between two origins, and two destinations.

## Database structure

```
users (ID: string) {
    name: string
    age: number
    picture: string?(base64)
    home country: string(code)
    gender: 'male' | 'female' | 'other'
    bio: string
    companion: string?
    setting: {radius: integer, circle: boolean, radar: boolean}
    phone: string
    kakao: string
    path: string?(JSON)
}

requests (ID = User ID) {
    travelText: string
    visitText: string
    time: time
    path: string
    status: accepted | null (when A wait others' respond) | pending (when waiting for requester's approval)
}

Report (random ID) {
    ID_snitch: string
    ID_reported: string
    report_text: string
}
```
