/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 22/07/2023 - 03:21:45
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/07/2023
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/
import { View, Text } from 'react-native'
import React from 'react'
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
import SignInScreen from '../screens/SignInScreen/SignInScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import ConfigSystem from '../screens/ConfigSystem/ConfigSystem';
import AllIntrusions from '../screens/AllIntrusions/AllIntrusions';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import 'react-native-gesture-handler'
import AuthProvider from '../components/AuthProvider/AuthProvider';

/*const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="HomeScreen" component={StackNav} />
    </Drawer.Navigator>
  );
};*/
const Stack = createNativeStackNavigator();
const Navigation = () => {
  return ( 
    <>
    <NavigationContainer>
    <AuthProvider>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: true }}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: true }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true }}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: true }}/>
        <Stack.Screen name="ConfigSystem" component={ConfigSystem} options={{ headerShown: true }}/>
        <Stack.Screen name="AllIntrusions" component={AllIntrusions} options={{ headerShown: true }}/>
      </Stack.Navigator>
    </AuthProvider>
    </NavigationContainer>
    </>
  )
}

export default Navigation