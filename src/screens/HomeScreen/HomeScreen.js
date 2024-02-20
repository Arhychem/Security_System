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
import { Text, TextInput, Image, View, StyleSheet, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'
import { AuthContext } from '../../components/AuthProvider/AuthProvider';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import StatusBar from '../../components/StatusBar/StatusBar';
import storage from '@react-native-firebase/storage';
import Carousel from 'react-native-snap-carousel';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { BackHandler } from 'react-native';
const items = [
  {
    image: require('../../../assets/secu9.png'),
    description: 'Avec un système contrôlable par téléphone, vous pouvez armer et désarmer votre système de sécurité à distance, ce qui est pratique lorsque vous avez oublié de le faire en partant de chez vous.',
    link: 'lien_vers_une_autre_page_1'
  },
  {
    image: require('../../../assets/secu0.jpeg'),
    description: "La visualisation en direct des caméras de sécurité sur votre téléphone vous permet de surveiller votre maison en temps réel, ce qui peut dissuader les intrus et vous offrir une tranquillité d'esprit supplémentaire",
    link: 'lien_vers_une_autre_page_2'
  },
  {
    image: require('../../../assets/secu1.jpeg'),
    description: "La capacité de verrouiller et déverrouiller les portes à distance via votre téléphone vous permet de contrôler l'accès à votre maison, même lorsque vous n'êtes pas physiquement présent",
    link: 'lien_vers_une_autre_page_2'
  },
  {
    image: require('../../../assets/secu2.jpeg'),
    description: "En cas d'urgence, comme une intrusion ou un incendie, pouvoir déclencher l'alarme ou contacter les services d'urgence directement depuis votre téléphone peut sauver des vies et limiter les dommages.",
    link: 'lien_vers_une_autre_page_2'
  },
  {
    image: require('../../../assets/secu3.jpeg'),
    description: "Les systèmes de sécurité contrôlables par téléphone offrent souvent des fonctionnalités avancées telles que la gestion des codes d'accès pour les visiteurs ou les prestataires de services, ce qui vous permet de contrôler qui entre dans votre maison.",
    link: 'lien_vers_une_autre_page_2'
  },
  {
    image: require('../../../assets/secu4.jpeg'),
    description: 'La possibilité de contrôler votre système de sécurité à domicile via votre téléphone vous offre un accès facile et pratique à distance, vous permettant de surveiller et de gérer la sécurité de votre maison où que vous soyez.',
    link: 'lien_vers_une_autre_page_2'
  },
  {
    image: require('../../../assets/secu5.jpeg'),
    description: "Recevoir des notifications en temps réel sur votre téléphone en cas d'activité suspecte ou d'urgence vous permet de réagir rapidement et de prendre les mesures nécessaires pour assurer la sécurité de votre domicile.",
    link: 'lien_vers_une_autre_page_2'
  },
  {
    image: require('../../../assets/secu6.jpeg'),
    description: "La connectivité mobile permet également de recevoir des alertes en cas de coupure de courant ou de dysfonctionnement du système, vous permettant de prendre des mesures correctives rapidement",
    link: 'lien_vers_une_autre_page_2'
  },
  {
    image: require('../../../assets/secu7.jpeg'),
    description: "En intégrant des capteurs intelligents à votre système de sécurité contrôlable par téléphone, vous pouvez surveiller des aspects spécifiques de votre maison, comme la température, l'humidité ou la qualité de l'air",
    link: 'lien_vers_une_autre_page_2'
  },
  {
    image: require('../../../assets/secu8.jpeg'),
    description: "Enfin, un système de sécurité à domicile que vous pouvez gérer avec votre téléphone offre une flexibilité et une personnalisation accrues, vous permettant d'adapter le système à vos besoins spécifiques et d'améliorer la sécurité globale de votre maison",
    link: 'lien_vers_une_autre_page_2'
  },
];
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
  const iconSize = 24;
  const iconColor = "white";
  const iconActive = "#efe";

const HomeScreen = () => {
  console.log(auth())
  const [downloadUrl, setDownloadUrl] = useState(null);
  useEffect(() => {
  const disableBackButtonHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => true
  );

  return () => {
    disableBackButtonHandler.remove();
  };
}, []);
  useEffect(() => {
    async function fetchImage() {
      const url = await storage().ref('assets/images/OIP.jpeg').getDownloadURL();
      console.log(url)
      setDownloadUrl(url);
    }
    fetchImage();
  }, []);
  const renderItem = ({ item }) => (
    <View className="h-100 w-full" style={{ backgroundColor: 'rgba(255,255,255,1)',borderRadius: 10, padding:10 }}>
    <Image style={{ height: '50%', width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} source={item.image} blurRadius={1} />
    <View style={{ height: '30%', width: '100%', backgroundColor: 'transparent', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'black',fontSize:16,lineHeight:26,}}>{item.description}</Text>
    </View>
    </View>
);
  //const {signIn,  signOut,signUp, user,setUser} = useContext(AuthContext)
  const navigation = useNavigation()
  //setUser(auth().currentUser)
  //afficher la liste des incidents signalés
  const onConfigureSystemPress = ()=>{
    navigation.navigate("ConfigSystem")
  }
  const activeSystem = () =>{
    console.log('active')
  }
  const desactiveSystem = () => {
    console.log("desactive")
  }
  const listItems=[{iconName: "power-off", label:"Activer le système", color:'white', onPress:activeSystem }, {iconName:"power-off", label:"Désactiver le système", color: 'red', onPress:desactiveSystem}]
  return (
   <> 
    {auth().currentUser && <Text style={styles.title}>{auth().currentUser.displayName}, Bienvenue sur Secure Alert</Text>}
    <View className="flex-1 bg-white" style={{ alignItems: 'center',
        width: '100%',
        height: '94%',}}>
        <Image
        source={require('../../../assets/background.png')}
        style={styles.image}
        blurRadius={40}
      />
        <Carousel
            data={items}
            renderItem={renderItem}
            sliderWidth={400}
            itemWidth={400}
            autoplay
            autoplayInterval={5000}
            loop
        />
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
        fontSize:12,
        fontWeight:'bold',
        color:'#051C60',
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
    logoContainer:{
      alignItems: 'center'
    },
    button: {
      backgroundColor: '#1E40AF', // Couleur bleue
      borderRadius: 8, // Coins arrondis
      padding: 12, // Espacement intérieur
      paddingLeft:50,
      paddingRight:50,
      margin: 2, // Marge extérieure
      shadowColor: '#000', // Couleur de l'ombre
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, // Effet d'élévation pour l'ombre sur Android
    },
    buttonText: {
      color: 'black', // Couleur du texte
      fontSize: 20
    },
    image: {
      position: 'absolute',
      width: '100%',
      height: '100%',
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
})
export default HomeScreen;