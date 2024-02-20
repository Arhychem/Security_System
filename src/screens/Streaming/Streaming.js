/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 24/07/2023 - 07:31:52
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/07/2023
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Text, TextInput, Image, View, StyleSheet, Pressable, ScrollView, TouchableOpacity, useWindowDimensions, Button, Alert, Modal, Linking } from 'react-native';
import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'
import { AuthContext } from '../../components/AuthProvider/AuthProvider';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import StatusBar from '../../components/StatusBar/StatusBar';
import storage from '@react-native-firebase/storage';
import DatePicker from 'react-native-date-picker'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'; // Importez la bibliothèque UUID pour générer un nom de fichier unique
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

const Streaming = () => {
  const handlePress = async () => {
    const url = 'https://www.google.com'; // Remplacez avec l'adresse web souhaitée

    // Vérifiez si l'application peut ouvrir l'URL
    const canOpen = await Linking.canOpenURL(url);
    console.log(canOpen)

    if (canOpen) {
      // Ouvrez l'URL dans le navigateur par défaut de l'appareil
      await Linking.openURL(url);
    }
  };
  return (
   <> 
   <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
    <Text style={styles.title}>
      Surveiller votre domicile à temps réel
    </Text>
    <View style={styles.root}>
      <Text style={styles.subtitle}>
        Garantissez la sécurité de votre domicile à distance grâce à SecureAlertApp, votre application qui vous permet de contrôler votre domicile à distance
      </Text>
    <TouchableOpacity onPress={handlePress}>
      <Text> Streaming</Text>
    </TouchableOpacity>
    </View>
          </ScrollView>
  </>
  )
}
const styles=StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 20,
    },
    title:{
        fontSize:24,
        fontWeight:'bold',
        color:'#051C60',
        margin: 10,
        textAlign: 'center',

    },
    subtitle:{
        fontSize:16,
        color:'black',
        margin: 10,
    },
    text:{
        color:'gray',
        marginVertical: 10,
    },
    link:{
        color:'#fdb075',
    },
    logo:{
        width:'90%',
        alignItems: 'center'
    },
    zoneTexte:{
      alignItems: 'center',
      padding:20,
    },
    NavContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
    },
    NavBar: {
        flexDirection: 'row',
        backgroundColor: '#5C80BC',
        width: '100%',
        justifyContent: 'space-evenly',
        borderRadius: 40,
        padding: 2
    },
    IconBehave: {
        padding: 14,
        alignItems: 'center'
    },
    text:{
        color: 'white'
    },
    textActive:{
        color: '#efe'
    },
    iconStyle: {
        margin: 4,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 5,
      maxHeight: 200,
      width: 300,
    },
})
export default Streaming;