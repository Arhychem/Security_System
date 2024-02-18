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
import { Text, TextInput, Image, View, StyleSheet, Pressable, ScrollView, TouchableOpacity, useWindowDimensions, Button, Alert, Modal } from 'react-native';
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

const ConfigSystem = () => {
  const {height} = useWindowDimensions();
  const [hourBegin, setHourBegin] = useState(0);
  const [hourEnd, setHourEnd] = useState(0);
  const autoConfig = () =>{
    setIsLoading(true)
    firebase.firestore().collection("configs").add({
      userId: auth().currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      heureDebut: moment('01/01/2024 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ'),
      heureFin: new Date(),
     }) 
    Alert.alert("Votre requête a été envoyée")
    setIsLoading(false);
  }
  const [selectedDateTimeBegin, setSelectedDateTimeBegin] = useState(new Date());
  const [selectedDateTimeEnd, setSelectedDateTimeEnd] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false)

  const handleDateTimeChange = (datetime) => {
    setSelectedDateTimeBegin(datetime);
  };
  const iconSize = 24;
  const iconColor = "white";
  const iconActive = "#efe";

  //const {signIn,  signOut,signUp, user,setUser} = useContext(AuthContext)
  const navigation = useNavigation()
  //setUser(auth().currentUser)
  //afficher la liste des incidents signalés
  const onConfigureSystemPress = ()=>{
    navigation.navigate("ConfigSystem")
  }
  const affRequests = () =>{
    navigation.navigate("AllIntrusions")
  }
  const applyChange = () =>{
    setIsLoading(true)
    console.log("hourBegin: ",selectedDateTimeBegin)
    console.log("hourEnd: ",selectedDateTimeEnd)
    firebase.firestore().collection("configs").add({
      userId: auth().currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      heureDebut: selectedDateTimeBegin,
      heureFin: selectedDateTimeEnd,
     })
    Alert.alert("Votre requête a été envoyée")
    setIsLoading(false);
  }
  const listItems=[{iconName: "cog", label:"Configuration automatique"}]
  return (
   <> 
   {isLoading && (
     <Modal visible={true} transparent animationType="fade">
       <View style={styles.modalContainer}>
         <View style={styles.modalContent}>
           <Text>Chargement...</Text>
         </View>
       </View>
     </Modal>
   )}
   <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
    <Text style={styles.title}>
      Configurer Secure Alert
    </Text>
    <View style={styles.root}>
      <Text style={styles.subtitle}>
        Garantissez la sécurité de votre domicile à distance grâce à SecureAlertApp, votre application qui vous permet de contrôler votre domicile à distance
      </Text>

    </View>
    <View style={styles.zoneTexte}>  
    <View>
      <Text style={{fontSize:18, fontWeight:'bold', color:'#051C60'}}>Sélectionnez une heure pour la mise en marche du système</Text>
      <DatePicker
        style={{ width: 200 }}
        date={selectedDateTimeBegin}
        mode="datetime"
        placeholder="Sélectionnez une heure pour la mise en marche du système"
        format="HH:mm"
        onDateChange={handleDateTimeChange}
      />
      <Text style={{fontSize:18, fontWeight:'bold', color:'#051C60'}}>Sélectionnez une heure à laquelle le système va s'éteindre</Text>
      <DatePicker
        style={{ width: 200 }}
        date={selectedDateTimeEnd}
        mode="datetime"
        placeholder="Sélectionnez une heure à laquelle le système va s'éteindre"
        format="HH:mm"
        onDateChange={handleDateTimeChange}
      />
    </View>
    <Text>La configuration automatique laisse le système actif entre la date à laquelle on presse le bouton et le 31/12/ de l'année en cours</Text>
    <View style={{width:'80%', alignItems:'center', margin:65}}>
    <CustomButton
     text="Appliquer les modifications"
     onPress={applyChange} 
     type="container_PRIMARY"
     typeT="text_PRIMARY"
     />
     </View>
    </View>
    <View style={styles.NavContainer}>
      <View style={styles.NavBar}>
        {listItems.map((item, index) => (
          <View key={index}>
            <Pressable
              style={styles.IconBehave}
              android_ripple={{ borderless: true, radius: 50 }}
              onPress={autoConfig}
            >
              {item.color ? (
                <FontAwesome5Icon 
                name={item.iconName}
                size={iconSize}
                color={item.color}
                style={styles.iconStyle}
                 />
              ) : (
                <FontAwesome5Icon
                  name={item.iconName}
                  size={iconSize}
                  color={iconActive}
                  style={styles.iconStyle}
                />
              )}
              <Text style={styles.textActive}>{item.label}</Text>
            </Pressable>
          </View>
        ))}
      </View>
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
export default ConfigSystem;