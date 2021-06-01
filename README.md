# The Kare

---

## Repository Description

The names in parenthesis indicate who _designed_ for that.
Almost all logics and linkage for firebase are implemented by BeomJu.

- `public` : including main HTML, logo, and icons (+ favicon)
- `src` : implementations

In `src`

- `GradientContinuousSlider`, `GradientDiscreteSlider` : (Jihun) testing gradient slider
- `components` : components without context
  - `degree-label.js` : (BeomJu) flickering typographic hotspot symbol
  - `gradient-slider.js` : Wrapper for Jihun's gradient slider
  - `map-route.js` : (BeomJu) Displaying the path
  - `requestAlert.js` : (Arsen) testing snackbar
  - `swipeCard.js` : (Arsen) showing brief companion info.
- `hooks` : custom React hooks
  - `use-database.js` : CRUD operation support for firebase realtime database
  - `use-store.js` : MobX context consumer
- `layout` : components with MobX context
  - `App.js`, `App.css` : (BeomJu) Overall layout for app + snackbar & messagebox
  - `biography.js` : (Arsen & Assel) Displaying other's detailed profile + Report form
  - `bottom-button-list.js` : (BeomJu) Displaying profile button & setting button on ~~bottom~~ top right
  - `bottom-plan-list.js` : (BeomJu) Displaying "Find path" button or current plan panel
  - `companion-panel.js` : (Arsen) Displaying request list and info of each item, or matched companion info
  - `login.js` : (Arsen, Assel) Login frame
  - `map-directions-control.js` : (BeomJu) directions input panel
  - `map.js` : (BeomJu) `react-map-gl` things including hotspots, popups, radar, and paths (imported from other files)
  - `newRequest.js` : (BeomJu & Arsen) Request posting
  - `radar.js` : (BeomJu) Displaying radar
  - `screen-border.js` : (BeomJu) Displaying red border when hotspots come nearby
  - `setting-panel.js` : (BeomJu) Setting panel
  - `updateProfile.js` : (Arsen) updating or creating own profile
- `stores` : for MobX contexts and firebase
  - `firebase.js` : realtime database instance
  - `index.js` : combining map & app contexts
  - `map-directions-store.js` : separate MobX context, migrated from `@mapbox/mapbox-gl-directions`
  - `map-store.js` : MobX context for map display
- `utils`
  - `colors.js` : color interpolation for gradient slider
  - `countries.js` : country list and their labels and infos.
  - `directions.js` : utility functions used for `layout/map-directions.control.js`, some of them are referred from `@mapbox/mapbox-gl-directions`
- `index.js`, `index.css` : React entry point

---

## How to test

**The details are in DP4 report file. Please check them carefully rather than this README.**

## How to Login

Just put in your preferred ID satisfying `[A-Za-z0-9]+`.

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
    companionMessage: string? (for showing message, 'declined', 'accepted', 'pending', or null)
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

reports (target ID) {
    (reporter ID) : {
        string
    }
}
```
