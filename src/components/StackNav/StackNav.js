/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 25/01/2024 - 15:35:41
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 25/01/2024
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/

import { DrawerActions, useNavigation } from "@react-navigation/native";
import AllIntrusions from "../../screens/AllIntrusions/AllIntrusions";
import ConfigSystem from "../../screens/ConfigSystem/ConfigSystem";
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from 'react-native-vector-icons/Entypo'
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../DrawerContent/DrawerContent";
import AuthProvider from "../AuthProvider";
import SignInScreen from "../../screens/SignInScreen";
import SignUpScreen from "../../screens/SignUpScreen/SignUpScreen";
import ForgotPassword from "../../screens/ForgotPassword";
import ConfigurationUpScreen from "../../screens/ConfigurationUpScreen/ConfigurationUpScreen";
import RecentIntrusion from "../../screens/RecentIntrusion/RecentIntrusion";
import Streaming from "../../screens/Streaming/Streaming";
import Parametres from "../../screens/Parametres/Parametres";
const StackNav = () => {
    const Drawer = createDrawerNavigator();
    const navigation = useNavigation();
    return (
      <AuthProvider>
      <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#191970',
        },
        cardStyle: {backgroundColor: 'white'},
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Drawer.Screen 
        name="SignIn" 
        component={SignInScreen} 
        options={{ headerShown: false }}
      />
        <Drawer.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ headerShown: false }}
        />
        <Drawer.Screen 
          name="ForgotPassword" 
          component={ForgotPassword} 
          options={{ headerShown: false }}
        />
        <Drawer.Screen 
          name="ConfigUp" 
          component={ConfigurationUpScreen} 
          options={{ headerShown: false }}
        />
        <Drawer.Screen 
          name="DrawerContent" 
          component={DrawerContent} 
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: true,
          }}
        />
        <Drawer.Screen
          name="ConfigSystem"
          component={ConfigSystem}
          options={{
            headerShown: true,
          }}
        />
        <Drawer.Screen 
          name="AllIntrusions" 
          component={AllIntrusions} 
          options={{
            headerShown: true,
          }}
        />
        <Drawer.Screen 
          name="RecentIntrusion" 
          component={RecentIntrusion} 
          options={{
            headerShown: true,
          }}
        />
        <Drawer.Screen 
          name="Streaming" 
          component={Streaming} 
          options={{
            headerShown: true,
          }}
        />
        <Drawer.Screen 
          name="Parametres" 
          component={Parametres} 
          options={{
            headerShown: true,
          }}
        />
      </Drawer.Navigator>
      </AuthProvider>
    );
  };
  export default StackNav