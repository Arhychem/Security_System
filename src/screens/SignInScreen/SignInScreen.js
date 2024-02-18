/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 23/07/2023 - 04:28:38
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/07/2023
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/
import { View, Text, TextInput, Alert, Image, StyleSheet, useWindowDimensions, ScrollView, Modal } from 'react-native'
import React, {useState, useContext, createContext, useEffect} from 'react'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import SocialSignInButtons from '../../components/SocialSignInButtons/SocialSignInButtons'
import { useNavigation } from '@react-navigation/native'
import {useForm, Controller} from 'react-hook-form'
import { AuthContext } from '../../components/AuthProvider/AuthProvider'
import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth'
import google from '../../../assets/images/google.png'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import StatusBar from '../../components/StatusBar/StatusBar'
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

const EMAIL_REGEX =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/



const SignInScreen = () => {
    
    const {height} = useWindowDimensions();
    const navigation = useNavigation();

    const {
      control, 
      handleSubmit,
      watch,
      formState: {errors},
    } = useForm()

    const [downloadUrl, setDownloadUrl] = useState(null);

    const [isAdmin, setIsAdmin] = useState(false);

    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          // L'utilisateur est connecté
          if (user) {
            
            navigation.navigate("HomeScreen")
            }
        } else {
          // L'utilisateur n'est pas connecté
          console.log('Utilisateur déconnecté');
        }
      });
  
      // Nettoyage de l'abonnement lors du démontage du composant
      return unsubscribe;
    }, []);

    useEffect(() => {
      async function fetchImage() {
        const url = await storage().ref('assets/images/R.png').getDownloadURL();
        setDownloadUrl(url);
      }
      fetchImage();
    }, []);
    const onForgotPressed = () =>{
      navigation.navigate("ForgotPassword")
    }
    const signInWithGoogle = async () => {
      setIsLoading(true)
      try {
        GoogleSignin.configure({
          offlineAccess: false,
          webClientId: '82701150011-6ra7l63mfrg3ifa41cq7bmhq2270afpe.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
        });
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        const {idToken} = await GoogleSignin.signIn();
        const googleCredentials = auth.GoogleAuthProvider.credential(idToken);
        auth().signInWithCredential(googleCredentials);
        setIsLoading(false)
        return userInfo;
      } catch (error) {
        setIsLoading(false)
        console.log('=> Google Sign In', error);
        return null;
      }
    };
    const onSignInPressed = async (data) => {
      //setIsLoading(true)
      navigation.navigate("HomeScreen")
     // setIsLoading(false)
    }
    
    const launchSignInWithGoogle = () =>{
      signInWithGoogle().then((data) => console.log(data))
    }
    
    const onSignUpPressed = () => {
      navigation.navigate("SignUp")
    }

// Vérifier si l'adresse e-mail saisie existe déjà dans Firebase
/*const checkIfEmailExists = async (email) => {
  try {
    const signInMethods = await firebase.auth().fetchSignInMethodsForEmail(email);
    if (signInMethods && signInMethods.length > 0) {
      return true;
    } else {
      return 'Il n\'y a pas de compte associé à cette adresse e-mail';
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'adresse e-mail:', error);
    return false;
  }
}*/
const CheckEmail = async (email) =>{
  try{
    const passw = watch('password').toString()
    console.log(passw)
    const response = await auth().signInWithEmailAndPassword(email,passw)
    if(response.user.emailVerified==true){
      return true
    }else{
      return "Veuillez valider la création de votre compte depuis votre compte de messagerie"
    }
  }catch(error){
    console.log("erreur:", error.message)
    if (error.code === 'auth/user-disabled') {
      return "Cet utilisateur est désactivé"
    } else if (error.code === 'auth/wrong-password') {
      return 'Mot de passe incorrect'
    } else if (error.code === 'auth/user-not-found') {
      return ' Aucun utilisateur correspondant à l\'adresse e-mail spécifiée n\'a été trouvé.'
    }  else if (error.code === 'auth/network-request-failed') {
      return ' Une erreur de réseau s\'est produite lors de la tentative de connexion'
    }  else if (error.code === 'auth/too-many-requests') {
      return ' De nombreuses tentatives de connexion infructueuses ont été effectuées récemment depuis l\'adresse IP de l\'utilisateur.'
    } else if (error.code === 'auth/operation-not-allowed') {
      return 'La connexion avec l\'adresse e-mail et le mot de passe n\'est pas autorisée.'
    } else {
      return 'Erreur lors de la connexion'
    }
  }
}
    return (
      <ScrollView showsVerticalScrollIndicator={true}>
        {isLoading && (
      <Modal visible={true} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Chargement...</Text>
          </View>
        </View>
      </Modal>
    )}
        <View style={styles.root}>
        <Text style={styles.title}>Sign In</Text>
          {downloadUrl && <Image source={{ uri: downloadUrl }} 
          
            style={[styles.logo, {height: height * 0.15, margin: 1}]} 
            resizeMode="contain"
          />}
           <CustomInput
            name="email"
            placeholder = "Email"
            control={control}
            rules={
              {
                required: 'Email is required',
                pattern: {value:EMAIL_REGEX, message:'Email is invalid'}, 
                validate: {CheckEmail},
              }
            }
          />
          <CustomInput
            name="password"
            placeholder="Password"
            secureTextEntry
            control={control}
            rules={{required:'Password is required', minLength: {value:3, message: 'Password should be minimum 3 characters long'}}}
          />   

          <CustomButton
            text="Sign in"
            onPress={handleSubmit(onSignInPressed)} 
            type="container_PRIMARY"
            typeT="text_PRIMARY"
          />
          <CustomButton 
            text=" Do n't have an account? Create one" 
            onPress={onSignUpPressed} 
            type="container_TERTIARY"
            typeT="text_TERTIARY"
          />
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={launchSignInWithGoogle}
          />
          <CustomButton 
            text=" Forgot Password?" 
            onPress={onForgotPressed} 
            type="container_TERTIARY"
            typeT="text_TERTIARY"
          />
        </View> 
      
      </ScrollView>
    )
}

const styles=StyleSheet.create({
    root:{
        alignItems:'center',
        padding: 20,
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
    logo:{
        width:'70%',
        maxWidth: 300,
        maxHeight:200,
    },
    title:{
        fontSize:24,
        fontWeight:'bold',
        color:'#051C60',
        margin: 20,
        textAlign: 'left',

    },
})

export default SignInScreen