/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 22/07/2023 - 02:37:47
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/07/2023
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Alert, Modal} from 'react-native'
import React, {useState, useContext} from 'react'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import SocialSignInButtons from '../../components/SocialSignInButtons'
import { useNavigation, useRoute} from '@react-navigation/native'
import {useForm} from 'react-hook-form'
import { AuthContext } from '../../components/AuthProvider/AuthProvider'
import firebase from '@react-native-firebase/app'
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
const EMAIL_REGEX =   /^[^\s@]+@[^\s@]+.[^\s@]+$/
const ForgotPassword = () => {
    const {control, handleSubmit, watch} = useForm()
    const pwd = watch('password')
 //   const {signIn,  signOut,signUp, user, setUser} = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation();

    const onForgotPasswordPressed = async (data) => {
      setIsLoading(true)
      try {
        let response
          try{
              const userCreated = await auth().sendPasswordResetEmail(data.email);
              response=userCreated
          }  catch (error) {
            setIsLoading(false)
          if (error.code === 'auth/invalid-email') {
              // Adresse e-mail n'est pas valide
              console.warn("Cette adresse e-mail n'est pas valide");
              return
          } else if (error.code === 'auth/too-many-requests') {
              // Adresse e-mail invalide
              console.warn('Vous avez effectué un grand nombre de demandes de réinitialisation de mots de passe.');
              return
          } else if (error.code === 'auth/operation-not-allowed ') {
              // Mot de passe faible
              console.warn("La réinitialisation du mot de passe n'est pas autoriée.");
              return
          } else {
              // Erreur générique ou autre erreur inattendue
              console.warn('Une erreur s\'est produite lors de la créatio de votre compte.');
              return
          }
          }
          console.log("voici response: ", response)
          console.log("la demande de réinitialisation a été envoyée avec succès: ", response.user);
          Alert("Reinitialisation mail send!")
          navigation.navigate("signIn")
      } catch (error) {
        setIsLoading(false)
          console.log("Erreur lors de la proécdure de modification de mot de passe :");
          console.log(error);
          return
      }
        navigation.navigate("SignIn")
    }
    const onSignInPress = () => {
        console.warn("onSignInPress")
        navigation.navigate("SignIn")
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
      <Text style={styles.title}>Change Your Password</Text>
      <CustomInput
      name="email"
      placeholder="Email"
      control={control}
      secureTextEntry={false}
      rules={{pattern: {value:EMAIL_REGEX, message:'Votre adresse e-mail est invalide'},}}
      />
      <CustomButton
       text="Change Password"
       onPress={handleSubmit(onForgotPasswordPressed)} 
       type="container_PRIMARY"
       typeT="text_PRIMARY"
       />

      <CustomButton 
      text=" Have an account? Sign in" 
      onPress={onSignInPress} 
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
    title:{
        fontSize:24,
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
})
export default ForgotPassword