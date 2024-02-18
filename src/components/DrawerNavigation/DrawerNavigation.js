/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 25/01/2024 - 09:09:53
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 25/01/2024
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/
import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../DrawerContent/DrawerContent';
import StackNav from '../StackNav/StackNav';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        cardStyle: {backgroundColor: 'white'},
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Drawer.Screen
        name="Home"
        component={StackNav}
        options={{gestureEnabled: false}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
