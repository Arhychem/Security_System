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

const Parametres = () => {
  const [isLoading,setIsLoading]=useState(false)
  const iconSize = 15;
  const iconColor = "white";
  const iconActive = "#efe";
  const getFirebaseFileContent = async (filePath) => {
    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(filePath);
      const fileSnapshot = await fileRef.getDownloadURL();
      const downloadURL = fileSnapshot.toString();
      
      const response = await fetch(downloadURL);
      if (response.ok) {
        const fileContent = await response.text();
        return fileContent;
      } else {
        throw new Error('Erreur lors de la récupération du fichier.');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const ifNewDateIsBetween = async (date) =>{
      fileContent=await getFirebaseFileContent(`configs/${auth().currentUser.uid}/config.txt`)
      response = JSON.parse(fileContent)
      if(response.heureDebut<date && date<response.heureFin){
        return true
      }else{
        return false
      }
  }
  const enablePhotoWithPir = async () => {
    setIsLoading(true)
    const dateActuelle = new Date()
    console.log(dateActuelle)
    const testActivity=await ifNewDateIsBetween(Math.floor(dateActuelle.getTime() / 1000))
    console.log("ifNewDateIsBetween",testActivity)
    if(!testActivity){
      Alert.alert("Veuillez activer le système")
      return
    }
    const fileContent = {
      userId: auth().currentUser.uid,
      DateModification: Math.floor(dateActuelle.getTime() / 1000),
      text: "/enable_capture_Photo_with_PIR"
    };
  
    const fileName = `commandesTelegram.txt`; // Génère un nom de fichier unique avec une extension .txt
  
    const folderRef = firebase.storage().ref().child( `CommandesTelegram/${auth().currentUser.uid}/`);
  
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
    setIsLoading(false)
    setListItems((prevListItems) => {
      return prevListItems.map((item, index) => {
        if (index === 0) { // Modifier uniquement le premier élément
          return { ...item, label: "Désactiver caméra et PIR", onPress: disablePhotoWithPir };
        }
        return item;
      });
    });
  };
  
  const disablePhotoWithPir = async () => {
    setIsLoading(true)
    const dateActuelle = new Date()
    console.log(dateActuelle)
    const testActivity=await ifNewDateIsBetween(Math.floor(dateActuelle.getTime() / 1000))
    console.log("ifNewDateIsBetween",testActivity)
    if(!testActivity){
      Alert.alert("Veuillez activer le système")
      return
    }
    const fileContent = {
      userId: auth().currentUser.uid,
      DateModification: Math.floor(dateActuelle.getTime() / 1000),
      text: "/disable_capture_Photo_with_PIR"
    };
  
    const fileName = `commandesTelegram.txt`; // Génère un nom de fichier unique avec une extension .txt
  
    const folderRef = firebase.storage().ref().child( `CommandesTelegram/${auth().currentUser.uid}/`);
  
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
    setIsLoading(false)
    setListItems((prevListItems) => {
      return prevListItems.map((item, index) => {
        if (index === 0) { // Modifier uniquement le premier élément
          return { ...item, label: "Activer caméra et PIR", onPress: enablePhotoWithPir };
        }
        return item;
      });
    });
  };
  
  const enablePhotoWithFlash = async () => {
    setIsLoading(true)
    const dateActuelle = new Date()
    console.log(dateActuelle)
    const testActivity=await ifNewDateIsBetween(Math.floor(dateActuelle.getTime() / 1000))
    console.log("ifNewDateIsBetween",testActivity)
    if(!testActivity){
      Alert.alert("Veuillez activer le système")
      return
    }
    const fileContent = {
      userId: auth().currentUser.uid,
      DateModification: Math.floor(dateActuelle.getTime() / 1000),
      text: "/enable_capture_Photo_With_Flash"
    };
  
    const fileName = `commandesTelegram.txt`; // Génère un nom de fichier unique avec une extension .txt
  
    const folderRef = firebase.storage().ref().child( `CommandesTelegram/${auth().currentUser.uid}/`);
  
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
    setIsLoading(false)
    setListItems((prevListItems) => {
      return prevListItems.map((item, index) => {
        if (index === 1) { // Modifier uniquement le deuxième élément
          return { ...item, label: "Désactiver caméra et flash", onPress: disablePhotoWithFlash };
        }
        return item;
      });
    });
  };
  
  const disablePhotoWithFlash = async () => {
    setIsLoading(true)
    const dateActuelle = new Date()
    console.log(dateActuelle)
    const testActivity=await ifNewDateIsBetween(Math.floor(dateActuelle.getTime() / 1000))
    console.log("ifNewDateIsBetween",testActivity)
    if(!testActivity){
      Alert.alert("Veuillez activer le système")
      return
    }
    const fileContent = {
      userId: auth().currentUser.uid,
      DateModification: Math.floor(dateActuelle.getTime() / 1000),
      text: "/disable_capture_Photo_With_Flash"
    };
  
    const fileName = `commandesTelegram.txt`; // Génère un nom de fichier unique avec une extension .txt
  
    const folderRef = firebase.storage().ref().child( `CommandesTelegram/${auth().currentUser.uid}/`);
  
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
    setIsLoading(false)
    setListItems((prevListItems) => {
      return prevListItems.map((item, index) => {
        if (index === 1) { // Modifier uniquement le deuxième élément
          return { ...item, label: "Activer caméra et flash", onPress: enablePhotoWithFlash };
        }
        return item;
      });
    });
  };
  
  const capturePhoto = async () => {
    // Votre logique de capture de photo
    setIsLoading(true)
    const dateActuelle = new Date()
    console.log(dateActuelle)
    const testActivity=await ifNewDateIsBetween(Math.floor(dateActuelle.getTime() / 1000))
    console.log("ifNewDateIsBetween",testActivity)
    if(!testActivity){
      Alert.alert("Veuillez activer le système")
      return
    }
    const fileContent = {
      userId: auth().currentUser.uid,
      DateModification: Math.floor(dateActuelle.getTime() / 1000),
      text: "/capture_photo"
    };
  
    const fileName = `commandesTelegram.txt`; // Génère un nom de fichier unique avec une extension .txt
  
    const folderRef = firebase.storage().ref().child( `CommandesTelegram/${auth().currentUser.uid}/`);
  
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
    setIsLoading(false)
  };
  
  const [listItems, setListItems] = useState([
    { iconName: "exclamation-triangle", label: "Activer caméra et PIR", color: '#5C80BC', onPress: enablePhotoWithPir },
    { iconName: "bolt", label: "Activer caméra et flash", color: '#5C80BC', onPress: enablePhotoWithFlash },
    { iconName: "camera", label: "Prendre une photo", color: '#5C80BC', onPress: capturePhoto }
  ]);
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
      Paramétrer le système
    </Text>
    <View style={styles.root}>
      <Text style={styles.subtitle}>
      </Text>
    </View>
    <View style={styles.NavContainer}>
      <View style={styles.NavBar}>
        {listItems.map((item, index) => (
          <View key={index}>
            <Pressable
              style={styles.IconBehave}
              android_ripple={{ borderless: true, radius: 50 }}
              onPress={item.onPress}
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
        margin: 230,
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
        marginTop:100
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
export default Parametres;