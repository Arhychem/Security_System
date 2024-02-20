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

const ConfigSystem = () => {
  const {height} = useWindowDimensions();
  const [hourBegin, setHourBegin] = useState(0);
  const [hourEnd, setHourEnd] = useState(0);
  const autoConfig = async () => {
    setIsLoading(true);
    const dateActuelle = new Date()
    const fileContent = {
      userId: auth().currentUser.uid,
      heureDebut: Math.floor(dateActuelle.getTime() / 1000),
      heureFin: Math.floor(dateActuelle.getTime() / 1000 + 604800), //on ajoute une semaine
    };
  
    const fileName = `config.txt`; // Génère un nom de fichier unique avec une extension .txt
  
    const folderRef = firebase.storage().ref().child(`configs/${auth().currentUser.uid}/`);
  
    try {
      // Obtient la liste des fichiers dans le dossier
      const fileList = await folderRef.listAll();
  
      // Supprime chaque fichier dans la liste
      await Promise.all(fileList.items.map(file => file.delete()));
  
      // Ajoute le nouveau fichier
      const fileRef = folderRef.child(fileName);
      await fileRef.putString(JSON.stringify(fileContent));
  
      Alert.alert('Votre requête a été envoyée');
    } catch (error) {
      console.error('Erreur lors du stockage du fichier :', error);
    }
  
    setIsLoading(false);
  };
  const [selectedDateTimeBegin, setSelectedDateTimeBegin] = useState(new Date());
  const [selectedDateTimeEnd, setSelectedDateTimeEnd] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)

  const handleDateTimeChangeBegin = (datetime) => {
    setSelectedDateTimeBegin(datetime);
  };
  const handleDateTimeChangeEnd = (datetime) => {
    setSelectedDateTimeEnd(datetime);
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
  const applyChange = async () => {
    setIsLoading(true);
    const dateActuelle = new Date()
    const fileContent = {
      userId: auth().currentUser.uid,
      DateModification:  Math.floor(dateActuelle.getTime() / 1000),
      heureDebut:  Math.floor(selectedDateTimeBegin.getTime() / 1000),
      heureFin: Math.floor(selectedDateTimeEnd.getTime() / 1000),
    };
  
    const fileName = `config.txt`; // Génère un nom de fichier unique avec une extension .txt
  
    const folderRef = firebase.storage().ref().child(`configs/${auth().currentUser.uid}/`);
  
    try {
      // Obtient la liste des fichiers dans le dossier
      const fileList = await folderRef.listAll();
  
      // Supprime chaque fichier dans la liste
      await Promise.all(fileList.items.map(file => file.delete()));
  
      // Ajoute le nouveau fichier
      const fileRef = folderRef.child(fileName);
      await fileRef.putString(JSON.stringify(fileContent));
  
      Alert.alert('Votre requête a été envoyée');
    } catch (error) {
      console.error('Erreur lors du stockage du fichier :', error);
    }
  
    setIsLoading(false);
  };
  const listItems=[{iconName: "cog", label:"Configuration automatique", color:'#5C80BC'}]
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
     <View style={styles.parentRoot}>
       <View style={styles.root}>
         <View style={styles.subroot}>
           <Text style={styles.title}>
           Configuration manuelle du temps de fontionnement
           </Text>
           <View style={styles.zoneTexte}>  
           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
             <View style={{ flex:1 , paddingRight:10}}>
               <Button title="DATE MARCHE" onPress={() => setOpen1(true)} style={{fontSize:18, fontWeight:'bold'}}/>
               <DatePicker
                 modal
                 locale='fr'
                 open={open1}
                 style={{ width: 200,borderRadius:10 }}
                 date={selectedDateTimeBegin}
                 mode="datetime"
                 title="Sélectionnez la date de mise en marche"
                 format="HH:mm"
                 onConfirm={(selectedDateTimeBegin) => {
                   setOpen1(false)
                   setSelectedDateTimeBegin(selectedDateTimeBegin)
                 }}
                 onCancel={() => {
                   setOpen1(false)
                 }}
                 confirmText='Confirmer'
                 cancelText='Annuler'
               />
               <Text>{selectedDateTimeBegin.toDateString()}</Text>
             </View>
             <View style={{ flex:1 }}>
               <Button title="DATE ARRET" onPress={() => setOpen2(true)} style={{fontSize:18, fontWeight:'bold'}}/>
               <DatePicker
                 modal
                 locale='fr'
                 open={open2}
                 style={{ width: 200,borderRadius:10 }}
                 date={selectedDateTimeEnd}
                 minimumDate={selectedDateTimeBegin}
                 mode="datetime"
                 title="Sélectionnez la date de mise en arret"
                 format="HH:mm"
                 onConfirm={(selectedDateTimeEnd) => {
                   setOpen2(false)
                   setSelectedDateTimeEnd(selectedDateTimeEnd)
                 }}
                 onCancel={() => {
                   setOpen2(false)
                 }}
                 confirmText='Confirmer' 
                 cancelText='Annuler'
               />
               <Text>{selectedDateTimeEnd.toDateString()}</Text>
             </View>
           </View>
           <CustomButton
             text="Appliquer les modifications"
             onPress={applyChange} 
             type="container_PRIMARY"
             typeT="text_PRIMARY"
           />
           </View>
         </View>
         <View style={styles.subroot1}>
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
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width:10, height:20},
    shadowOpacity: 0.8,
    elevation: 10, 
  },
  parentRoot:{
    padding:20,
    paddingTop:100,
  },
  subroot:{
    alignItems:'center',
    backgroundColor: 'white',
  },
  subroot1:{
    alignItems:'center',
    width:"100%",
    paddingTop:30,
  },
    title:{
        fontSize:15,
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
        backgroundColor: 'white',
        width: '100%',
        fontFamily: 'Helvetica',
        justifyContent: 'space-evenly',
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
        color: '#5C80BC',
        fontSize:10,
        fontFamily:'Helvetica'
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