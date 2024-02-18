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
import { Alert, Linking } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Text, TextInput, Image, View, StyleSheet, Pressable, ScrollView, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';
import { AuthContext } from '../../components/AuthProvider/AuthProvider';
import firebase from '@react-native-firebase/app'
import moment from 'moment';
import { useNavigation } from "@react-navigation/native"
import storage from '@react-native-firebase/storage';
import CustomButton from '../../components/CustomButton/CustomButton';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth'

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
  const callPolice = (phoneNumber) => {
    const phoneUrl = `tel://${phoneNumber}`;
    Linking.openURL(phoneUrl);
  };

  const AllIntrusions = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [reload, setReload] = useState(false)
    function deleteRequest(request, index){
      setIsLoading(true)
      console.log("supprimer")
      console.log("voici la request:",request)
      const db = firebase.firestore();
      const collectionRef = db.collection("requetes");
    
      collectionRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        console.log("doc.data().userId: ",doc.data().userId)
        console.log("auth().currentUser.uid",auth().currentUser.uid)
        console.log("doc.data().timestamp",doc.data().timestamp)
        console.log("request.timestamp",request.timestamp)
       
          if (doc.data().userId == auth().currentUser.uid && doc.data().timestamp.isEqual(request.timestamp)) {
            console.log("yo")
            doc.ref.delete().then(() => {
              setIsLoading(false)
              // Le document a été supprimé avec succès
              Alert.alert("Le document a été supprimé avec succès.");
              setReload(true)
              setReload(false)
            }).catch((error) => {
              // Une erreur s'est produite lors de la suppression du document
              setIsLoading(false)
              console.error("Erreur lors de la suppression du document :", error);
            });
          }
        });
      });
      setIsLoading(false)
    };
    const {height} = useWindowDimensions();
    const navigation = useNavigation();
   // const {signIn,  signOut,signUp, user,setUser} = useContext(AuthContext)
    const [requests, setRequests] = useState([]);
    const promises = []
    const [imageUrls, setImageUrls] = useState([]);
    useEffect(
      () => {
      const db = firebase.firestore();
      const collectionRef = db.collection("requetes");
      collectionRef.get().then((querySnapshot) => {
        const requests = [];
        console.log("querysnapshot",querySnapshot)
        querySnapshot.forEach((doc) => {
          console.log(auth().currentUser)
          if(auth().currentUser){
            if(doc.data().userId == auth().currentUser.uid){
              requests.push(doc.data());
            }
          }
        });
        console.log("avant :", requests)
        requests.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
        console.log(requests)
        for(let i=0;i<requests.length;i++){
        const storageRef = storage().ref(`images/${requests[i].userId}/${requests[i].url}.png`);
        promises.push(storageRef.getDownloadURL());
        Promise.all(promises)
          .then(urls => {
            setImageUrls(urls);
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des URLs de téléchargement des images :', error);
          });
        }
          setRequests(requests);
      }).catch((error) => {
        console.error('Erreur lors de la récupération des documents :', error);
        setRequests([]);
      });
      
    }, [reload]);  
    useEffect(() => {
      const interval = setInterval(() => {
        // Mettre à jour le state reload pour déclencher le rechargement du composant
        setReload(true)
        setReload(false)
      }, 1000000); // Rafraîchir toutes les 10 secondes
  
      // Nettoyer l'intervalle lorsque le composant est démonté
      return () => clearInterval(interval);
    }, []); // Utiliser une dépendance vide pour n'exécuter l'effet qu'une seule fois 
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      {isLoading && (
        <Modal visible={true} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Chargement...</Text>
            </View>
          </View>
        </Modal>
      )}
        {requests.map((request, index) => (
          <View key={index} style={styles.block}>
            <Text style={styles.title}>Intrusion no {index + 1}</Text>
            <Text style={styles.description}>{request.description}</Text>
            <Text style={styles.subtitle}>Date: {(moment((request.timestamp).toDate())).format('DD MMMM YYYY: HH[h]mm')}</Text>
            {imageUrls[index]? (<Image source={{ uri: imageUrls[index]}} 
            style={[styles.logo, {height: height * 0.3}]} 
            resizeMode="contain"
            />):(<Text>Echec récupération image</Text>)}
            <Pressable
              style={{
                padding: 10,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center', // Ajout de cette ligne
                opacity: 0.55,
                fontWeight:'bold',
              }}
              onPress={()=>{callPolice("117")}}
            >
              <FontAwesome5Icon name={'phone'} solid color='green' size={24} />
              <Text style={{ color: 'black', marginLeft: 5 }}>Appeler la police</Text>
            </Pressable>
            <TouchableOpacity onPress={() => deleteRequest(request, index)}>
              <Text style={{ color: 'black', textAlign:'center' }}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        ))} 
      </ScrollView>
    );
  
}

const styles = StyleSheet.create({
  container: {
    width : '100%',
    padding: 15,
    marginVertical:5,
    alignItems: 'center',
    borderRadius: 5,
  },
  block:{
    padding: 20,
    margin: 20,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title:{
      fontSize:18,
      fontWeight:'bold',
      color:'#051C60',
      margin: 10,
  },
  subtitle:{
      fontSize:13,
      fontWeight:'bold',
      color:'#051C60',
      margin: 10,
  },
  description:{
      fontSize:13,
      color:'black',
      margin: 10,
  },
  camera: {
    width: 300,
    height: 400,
    alignSelf: 'center',
    marginTop: 20,
  },
  container: {
    flex: 1
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    alignSelf: "center",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 2,
    marginTop: 16,
    height: 32,
    flex: 1
},
buttonText: {
    backgroundColor: "rgba(245, 252, 255, 0.7)",
    fontSize: 32,
},
image:{
    width:'70%',
    maxWidth: 300,
    maxHeight:200,
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
});

export default AllIntrusions;
