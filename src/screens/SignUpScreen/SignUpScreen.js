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
    appId:'1:82701150011:android:affa91f380ea753f3eb91e',
    authDomain: 'reactnative-62063.firebaseapp.com',
    storageBucket:'reactnative-62063.appspot.com',
    databaseURL:'firebase-adminsdk-wsv63@reactnative-62063.iam.gserviceaccount.com',
    messagingSenderId: '82701150011 ',
  })
  }
const EMAIL_REGEX =   /^[^\s@]+@[^\s@]+.[^\s@]+$/
const SignUpScreen = () => {
    const {control, handleSubmit, watch} = useForm()
    const pwd = watch('password')
    const {signIn,  signOut,signUp, user, setUser} = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation();

    const onRegisterPressed = async (data) => {
      setIsLoading(true)
      try {
        let response
          try{
              const userCreated = await auth().createUserWithEmailAndPassword(data.email, data.password);
              response=userCreated
          }  catch (error) {
            setIsLoading(false)
          if (error.code === 'auth/email-already-in-use') {
              // Adresse e-mail déjà utilisée
              console.warn('Cette adresse e-mail est déjà utilisée.');
              return
          } else if (error.code === 'auth/invalid-email') {
              // Adresse e-mail invalide
              console.warn('Adresse e-mail invalide.');
              return
          } else if (error.code === 'auth/weak-password') {
              // Mot de passe faible
              console.warn('Le mot de passe est faible.');
              return
          } else {
              // Erreur générique ou autre erreur inattendue
              console.warn('Une erreur s\'est produite lors de la créatio de votre compte.');
              return
          }
          }
          console.log("voici response: ", response)
          console.log("l'utilisateur a été créé avec succès: ", response.user);
          await response.user.updateProfile({
              displayName: data.username,
              phoneNumber: data.phone,
          });
          console.log("l'utilisateur a été mis à jour avec succès: ", response.user);
          await response.user.reload();
          console.log("Nom d'affichage de l'utilisateur mis à jour : ", response.user.displayName);
          setUser(auth().currentUser);
          auth().currentUser.sendEmailVerification({
              handleCodeInApp: true,//pour retourner vers l'application après validation depuis le compte e-mail
              url: 'https://reactnative-62063.firebaseapp.com',
          }).then(() => {
              Alert.alert('Verfication email sent')
              console.log("data.username",data.username)
              console.log("data.email",data.email)
              console.log("data.phoneNumber",data.phone)

              if(isAdmin==false){
                  firebase.firestore().collection('users').doc(auth().currentUser.uid).set({
                    username: data.username,
                    email: data.email,
                    phoneNumber: data.phone,
                    role: 'user'
                  }).then(()=>{
                      setIsLoading(false)
                      console.log('Document créé avec succès')
                  })
              }else{
                  firebase.firestore().collection('users').doc(auth().currentUser.uid).set({
                    username: data.username,
                    email: data.email,
                    phoneNumber: data.phone,
                    role: 'admin'
                  }).then(()=>{
                    setIsLoading(false)
                      console.log('Document créé avec succès')
                  })    
              }
          }).catch((error) => {
              console.log(error.message)
              setIsLoading(false)
              return
          })
      } catch (error) {
        setIsLoading(false)
          console.log("Erreur lors de l'inscription :");
          console.log(error);
          return
      }
        navigation.navigate("SignIn")
    }
    const onTermsOfUsePressed = () => {
        console.warn("onTermsOfUsePressed")
    }
    const onPrivacyPressed = (  ) => {
        console.warn("onPrivacyPressed")
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
      <Text style={styles.title}>Create an account</Text>
      <CustomInput 
      name="username"
      control={control}
      placeholder="Username"
      rules={{required: 'Username is required',
      minLength: {
        value: 3,
        message: 'Username should be at least 3 characters long'
      },
      maxLength: {
        value: 24,
        message: 'Username should be max 24 characters'
      }
    }}
      secureTextEntry={false}
      />
      <CustomInput
      name="email"
      placeholder="Email"
      control={control}
      secureTextEntry={false}
      rules={{pattern: {value:EMAIL_REGEX, message:'Votre adresse e-mail est invalide'},}}
      />
      <CustomInput
        name="phone"
        placeholder="Numéro de téléphone"
        secureTextEntry={false}
        control={control}
        rules={{
          required: 'Phone number is required',
        }}
      />
      <CustomInput 
      name="password"
      control={control}
      placeholder="Password"
      rules={{required: 'Password is required',
      minLength: {
        value: 6,
        message: 'votre mot de passe doit avoir au moins 6 caractères'
      },
      maxLength: {
        value: 24,
        message: 'Password should be max 24 characters'
      }
    }}
      secureTextEntry={true}
      />
     <CustomInput 
      name="password-repeat"
      control={control}
      placeholder="Repeat your password"
      rules={{
        validate: value =>
        value==pwd|| 'Password do not match'
      }}

      secureTextEntry={true}
      />
      <CustomButton
       text="Register"
       onPress={handleSubmit(onRegisterPressed)} 
       type="container_PRIMARY"
       typeT="text_PRIMARY"
       />

      <Text style={styles.text}>
        By registering, you confirm that you accept our {' '}
        <Text style={styles.link} onPress={onTermsOfUsePressed}>Terms of Use</Text> and {' '}
        <Text style={styles.link} onPress={onPrivacyPressed}>Privacy Policy</Text>
      </Text>

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
export default SignUpScreen