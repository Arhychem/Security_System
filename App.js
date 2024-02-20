/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 23/07/2023 - 14:20:02
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/07/2023
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler'
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import Navigation from './src/navigation';

import firebase from '@react-native-firebase/app'
import SplashScreen from 'react-native-splash-screen';
import DrawerNavigator from './Drawer-Stack-Navigation-main/Drawer-Stack-Navigation-main/DrawerNavigation';
import { NavigationContainer } from '@react-navigation/native';
import StackNav from './src/components/StackNav';

//Initialize Firebase
if(!firebase.apps.length){
  firebase.initializeApp({
    apiKey:'AIzaSyD4mhlw1VEpce-UKstitbmsc0QBp9rEwKw',
    projectId:'alert-31175',
    appId:'1:281790357000:android:1e426f26d74aef76fc3bbd',
    authDomain: 'alert-31175.firebaseapp.com',
    storageBucket:'alert-31175.appspot.com',
    databaseURL:'firebase-adminsdk-wsv63@alert-31175.iam.gserviceaccount.com',
    messagingSenderId: '281790357000 ',
  })
}

function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 900);
  }, []);
  return (
    <>
    <NavigationContainer>
      <StackNav/>
    </NavigationContainer>
    </>
    )
}

const styles = StyleSheet.create({
  root:{
    flex:1,
    backgroundColor:'#f9fbfc',
  }
});

export default App;
