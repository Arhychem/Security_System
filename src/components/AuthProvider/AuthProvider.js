/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 21/07/2023 - 23:55:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/07/2023
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/
import React, {createContext, useState} from 'react'
import {Alert} from 'react-native'
import auth from '@react-native-firebase/auth'
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore'
export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    //State pour stocker le statut de l'authentification de l'utilisateur
    const [user, setUser] = useState(null)
    const [confirmation, setConfirmation] = useState(null)
    //Fonction pour s'authentifier avec Firebase
    //normalement ceci ne me sert à rien
    const signIn = async (email, password) => {
        try{
            const response = await auth().signInWithEmailAndPassword(email, password)
            setUser(response.user)
            if(auth().currentUser.emailVerified==true){
                navigation.navigate("HomeScreen")
            }
        } catch (error) {
            console.log("erreur signIn:")
            console.log(error)
        }
    }
    //Fonction pour s'enregistrer sur Firebase

    //Fonction pour s'enregistrer sur Firebase
    const signUp = async (username, email, password,isAdmin=false) => {
        try {
            try{
                const response = await auth().createUserWithEmailAndPassword(email, password);
            }  catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                // Adresse e-mail déjà utilisée
                console.warn('Cette adresse e-mail est déjà utilisée.');
            } else if (error.code === 'auth/invalid-email') {
                // Adresse e-mail invalide
                console.warn('Adresse e-mail invalide.');
            } else if (error.code === 'auth/weak-password') {
                // Mot de passe faible
                console.warn('Le mot de passe est faible.');
            } else {
                // Erreur générique ou autre erreur inattendue
                console.warn('Une erreur s\'est produite lors de la créatio de votre compte.');
            }
            }
            console.log("l'utilisateur a été créé avec succès: ", response.user);
            await response.user.updateProfile({
                displayName: username,
            });
            console.log("l'utilisateur a été mis à jour avec succès: ", response.user);
            await response.user.reload();
            console.log("Nom d'affichage de l'utilisateur mis à jour : ", response.user.displayName);
            setUser(auth().currentUser);
            auth().currentUser.sendEmailVerification({
                handleCodeInApp: true,//pour retourner vers l'application après validation depuis le compte e-mail
                url: 'https://reactnative-b941d.firebaseapp.com',
            }).then(() => {
                Alert.alert('Verfication email sent')
                if(isAdmin==false){
                    firebase.firestore().collection('users').doc(auth().currentUser.uid).set({
                        username: auth().currentUser.displayName,
                        email: auth().currentUser.email,
                        role: 'user'
                    }).then(()=>{
                        console.log('Document créé avec succès')
                    })
                }else{
                    firebase.firestore().collection('users').doc(auth().currentUser.uid).set({
                        username: auth().currentUser.displayName,
                        email: auth().currentUser.email,
                        role: 'admin'
                    }).then(()=>{
                        console.log('Document créé avec succès')
                    })    
                }
            }).catch((error) => {
                console.log(error.message)
            })
        } catch (error) {
            console.log("Erreur lors de l'inscription :");
            console.log(error);
        }
    };
    //Fonction pour se déconnecter de Firebase
    const signOut = async () => {
        try {
            await auth().signOut()
            setUser(null)
        } catch (error){
            console.log("erreur signOut")
            console.log(error)
        }
    }
    //valeurs à fournir à tous les composants enfants qui utilisent ce contexte
    const authContextValues = {
        user: user,
        signIn: signIn,
        signOut: signOut, 
        signUp: signUp,
        setUser:setUser,
        confirmation: confirmation,
        setConfirmation: setConfirmation,
    }
    return (
    <AuthContext.Provider value = {authContextValues}> 
        {children} 
    </AuthContext.Provider>
    )
}
export default AuthProvider