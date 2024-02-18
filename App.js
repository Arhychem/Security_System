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
    apiKey:'AIzaSyB-Q7l57z3QzUjcxE9tI7ThaKS85DQu_lg',
    projectId:'reactnative-62063',
    appId:'1:82701150011:android:0b04c34b6307930e3eb91e',
    authDomain: 'reactnative-62063.firebaseapp.com',
    storageBucket:'reactnative-62063.appspot.com',
    databaseURL:'firebase-adminsdk-wsv63@reactnative-62063.iam.gserviceaccount.com',
    messagingSenderId: '82701150011 ',
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
