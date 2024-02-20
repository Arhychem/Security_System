import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from '../CustomButton/CustomButton'
    const onSignInPressed = () => {
        console.warn("Sign in")
    }
    const onForgotPasswordPressed = () => {
        console.warn("Forgot password")
    }
    const onSignInFacebook = () => {
        console.warn("onSignInFacebook")
    }
    const onSignInGoogle = () => {
        console.warn("onSignInGoogle")
    }
    const onSignInApple = () => {
        console.warn("onSignInApple")
    }

const SocialSignInButtons = () => {
  return (
    <>
     <CustomButton 
      text=" Sign In with Facebook" 
      onPress={onSignInFacebook} 
      type="container_Facebook"
      typeT="text_Facebook"
      />
      <CustomButton 
      text="Sign In with Google" 
      onPress={onSignInGoogle} 
      type="container_Google"
      typeT="text_Google"
      />
      <CustomButton 
      text="Sign In with Apple" 
      onPress={onSignInApple} 
      type="container_Apple"
      typeT="text_Apple"
      />
    </>
  )
}

export default SocialSignInButtons