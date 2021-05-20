# Getting Started with Create React App

## Project Due

- 5/19 : Components Designs
- 5/26 : PPT

**PLEASE work on your own branch, not master**

---

### Database structure

```
User (ID) {  
    ID: string  
    name: string  
    age: string  
    picture: URL // I suggest that we use pictures from internet, because uploading and storing custom images might be hard  
    home country: string  
    gender: string  
    biography: string  
    companion ID: string | null 
    setting: {radius: integer, circle: boolean, radar: boolean}
    contact_info: {phone number: string, KakaoID: string}
}  
  
Request (ID = User ID) {  
    user_ID: string  
    about_path: string
    about_visit: string
    time: time
    path: string
    status: approved  |  null (when A wait others' respond)  |  pending (when waiting for requester's approval) 
}  
  
Report (random ID) {  
    ID_snitch: string  
    ID_reported: string  
    report_text: string  
}  
```