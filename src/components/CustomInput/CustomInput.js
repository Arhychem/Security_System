/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 30/07/2023 - 12:48:59
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 30/07/2023
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/
import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, {useState} from 'react'
import { Controller } from 'react-hook-form'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {Input} from 'react-native-elements'

const CustomInput = ({control, name, rules={}, placeholder, secureTextEntry}) => {
  
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  
  if(name=="email"){
    return (
      // <View style={styles.container}>
      //   <TextInput 
      //     placeholder={placeholder} 
      //     onChangeText={setValue}
      //     style={styles.input}
      //     secureTextEntry={secureTextEntry}
      //   />
      // </View>
      <Controller
          control={control}
          name={name}
          rules={rules}
          render={({field: {value, onChange, onBlur}, fieldState:{error}}) =>(
          <>
          <View 
          style = {[styles.container, {borderColor: error ? 'red': '#e8e8e8'}]}>
          <Input 
              value={value} 
              onChangeText={onChange} 
              onBlur={onBlur} 
              placeholder={placeholder}
              style={[styles.input]}
              secureTextEntry={secureTextEntry}
              leftIcon={
                <FontAwesome5 name={'envelope'} solid color='red' size={24}/>
              }
          />
          </View>
          {error && (
            <Text style={{color: 'red'}}>{error.message || 'Error'}</Text>
          )}
          </>
          )}
          
        />
    )
    }
    if(name=="code"){
    return (
      // <View style={styles.container}>
      //   <TextInput 
      //     placeholder={placeholder} 
      //     onChangeText={setValue}
      //     style={styles.input}
      //     secureTextEntry={secureTextEntry}
      //   />
      // </View>
      <Controller
          control={control}
          name={name}
          rules={rules}
          render={({field: {value, onChange, onBlur}, fieldState:{error}}) =>(
          <>
          <View 
          style = {[styles.container, {borderColor: error ? 'red': '#e8e8e8'}]}>
          <Input 
              value={value} 
              onChangeText={onChange} 
              onBlur={onBlur} 
              placeholder={placeholder}
              style={[styles.input]}
              secureTextEntry={secureTextEntry}
              leftIcon={
                <FontAwesome5 name={'lock'} solid color='red' size={24}/>
              }
          />
          </View>
          {error && (
            <Text style={{color: 'red'}}>{error.message || 'Error'}</Text>
          )}
          </>
          )}
          
        />
    )
    }
  if(name=="password" || name=="password-repeat"){
  return (
    // <View style={styles.container}>
    //   <TextInput 
    //     placeholder={placeholder} 
    //     onChangeText={setValue}
    //     style={styles.input}
    //     secureTextEntry={secureTextEntry}
    //   />
    // </View>
    <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {value, onChange, onBlur}, fieldState:{error}}) =>(
        <>
        <View 
        style = {[styles.container, {borderColor: error ? 'red': '#e8e8e8'}]}>
        <Input 
            value={value} 
            onChangeText={onChange} 
            onBlur={onBlur} 
            placeholder={placeholder}
            style={[styles.input]}
            secureTextEntry={isPasswordVisible? false: true}
            leftIcon={
              <FontAwesome5 name={'lock'} solid color='red' size={24}/>
            }
            rightIcon={
              <FontAwesome5
                    name={isPasswordVisible ? 'eye-slash' : 'eye'}
                    solid
                    color='red'
                    size={24}
                    onPress={togglePasswordVisibility}
              />
            }
        />
        </View>
        {error && (
          <Text style={{color: 'red'}}>{error.message || 'Error'}</Text>
        )}
        </>
        )}
        
      />
  )
  }
  if(name=="username"){
  return (
    // <View style={styles.container}>
    //   <TextInput 
    //     placeholder={placeholder} 
    //     onChangeText={setValue}
    //     style={styles.input}
    //     secureTextEntry={secureTextEntry}
    //   />
    // </View>
    <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {value, onChange, onBlur}, fieldState:{error}}) =>(
        <>
        <View 
        style = {[styles.container, {borderColor: error ? 'red': '#e8e8e8'}]}>
        <Input 
            value={value} 
            onChangeText={onChange} 
            onBlur={onBlur} 
            placeholder={placeholder}
            style={[styles.input]}
            secureTextEntry={secureTextEntry}
            leftIcon={
              <FontAwesome5 name={'user'} solid color='red' size={24}/>
            }
        />
        </View>
        {error && (
          <Text style={{color: 'red'}}>{error.message || 'Error'}</Text>
        )}
        </>
        )}
        
      />
  )
  }
  if(name=="phone"){
  return (
    // <View style={styles.container}>
    //   <TextInput 
    //     placeholder={placeholder} 
    //     onChangeText={setValue}
    //     style={styles.input}
    //     secureTextEntry={secureTextEntry}
    //   />
    // </View>
    <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {value, onChange, onBlur}, fieldState:{error}}) =>(
        <>
        <View 
        style = {[styles.container, {borderColor: error ? 'red': '#e8e8e8'}]}>
        <Input 
            value={value} 
            onChangeText={onChange} 
            onBlur={onBlur} 
            placeholder={placeholder}
            style={[styles.input]}
            secureTextEntry={secureTextEntry}
            leftIcon={
              <FontAwesome5 name={'phone'} solid color='red' size={24}/>
            }
        />
        </View>
        {error && (
          <Text style={{color: 'red'}}>{error.message || 'Error'}</Text>
        )}
        </>
        )}
        
      />
  )
  }
  if(name=="address"){
  return (
    // <View style={styles.container}>
    //   <TextInput 
    //     placeholder={placeholder} 
    //     onChangeText={setValue}
    //     style={styles.input}
    //     secureTextEntry={secureTextEntry}
    //   />
    // </View>
    <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {value, onChange, onBlur}, fieldState:{error}}) =>(
        <>
        <View 
        style = {[styles.container, {borderColor: error ? 'red': '#e8e8e8'}]}>
        <Input 
            value={value} 
            onChangeText={onChange} 
            onBlur={onBlur} 
            placeholder={placeholder}
            style={[styles.input]}
            secureTextEntry={secureTextEntry}
            leftIcon={
              <FontAwesome5 name={'map-marker'} solid color='red' size={24}/>
            }
        />
        </View>
        {error && (
          <Text style={{color: 'red'}}>{error.message || 'Error'}</Text>
        )}
        </>
        )}
        
      />
  )
  }
  if(name=="id"){
  return (
    // <View style={styles.container}>
    //   <TextInput 
    //     placeholder={placeholder} 
    //     onChangeText={setValue}
    //     style={styles.input}
    //     secureTextEntry={secureTextEntry}
    //   />
    // </View>
    <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {value, onChange, onBlur}, fieldState:{error}}) =>(
        <>
        <View 
        style = {[styles.container, {borderColor: error ? 'red': '#e8e8e8'}]}>
        <Input 
            value={value} 
            onChangeText={onChange} 
            onBlur={onBlur} 
            placeholder={placeholder}
            style={[styles.input]}
            secureTextEntry={secureTextEntry}
            leftIcon={
              <FontAwesome5 name={'id-card'} solid color='red' size={24}/>
            }
        />
        </View>
        {error && (
          <Text style={{color: 'red'}}>{error.message || 'Error'}</Text>
        )}
        </>
        )}
        
      />
  )
  }
}

const styles= StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',

        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,

        paddingHorizontal: 10,
        marginVertical: 5,
    },
    input:{
      fontSize: 10,
    },
})

export default CustomInput