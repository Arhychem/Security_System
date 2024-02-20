/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 25/01/2024 - 22:46:21
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 25/01/2024
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/
import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

const CustomButton = ( {onPress, text, type="container_PRIMARY", typeT="text_PRIMARY"} ) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, styles[type]]}>
      <Text style={[styles.text, styles[typeT]]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width : '100%',
    padding: 15,
    marginVertical:5,

    alignItems: 'center',
    borderRadius: 5,
  },

  container_PRIMARY:{
    backgroundColor: '#191970',
  },
  container_SECONDARY:{
    borderColor: '#3B71F3',
    borderWidth: 2,
  },
  container_TERTIARY:{},
  text: {
    fontWeight : 'bold',
  },
  container_Facebook:{
    backgroundColor: '#E7EAF4'
  },
  container_Google:{
    backgroundColor: '#FAE9EA'
  },
  container_Apple:{
    backgroundColor: '#e3e3e3'
  },
  text_TERTIARY: {
    color: 'gray',
  },
  text_PRIMARY: {
    color: 'white',
  },
  text_SECONDARY:{
    color: '#3B71F3',
  },
  text_Facebook:{
    color:'#4765A9',
  },
  text_Google:{
    color:'#DD4D44',
  },
  text_Apple:{
    color:'#363636',
  }
})
export default CustomButton