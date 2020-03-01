// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const firebaseConfig = {
  apiKey: "AIzaSyCC6Je29faaukk2SOVIAblKSj8SJZogiMY",
  authDomain: "notasapp-bf9e5.firebaseapp.com",
  databaseURL: "https://notasapp-bf9e5.firebaseio.com",
  projectId: "notasapp-bf9e5",
  storageBucket: "notasapp-bf9e5.appspot.com",
  messagingSenderId: "932510974702",
  appId: "1:932510974702:web:8fbf1d6cdc2af8cdefa9ff"

}

export const snapToArray = (snap:firebase.database.DataSnapshot) => {
  let returnedArray = [];

  snap.forEach(element => {
    let item = element.val();
    item.key = element.key;

    returnedArray.push(item);
    
  });
  return returnedArray;

}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
