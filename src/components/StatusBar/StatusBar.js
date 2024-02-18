/**
    * @description      : 
    * @author           : EUROPEONLINE
    * @group            : 
    * @created          : 25/01/2024 - 18:21:58
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 25/01/2024
    * - Author          : EUROPEONLINE
    * - Modification    : 
**/
import { Pressable, StyleSheet, View, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const iconSize = 24;
const iconColor = "white";
const iconActive = "#efe";

export default function StatusBar({ listItems = [] }) {
  return (
    <View style={styles.NavContainer}>
      <View style={styles.NavBar}>
        {listItems.map((item, index) => (
          <View key={index}>
            <Pressable
              style={styles.IconBehave}
              android_ripple={{ borderless: true, radius: 50 }}
            >
              {item.color ? (
                <FontAwesome5
                  name={item.iconName}
                  size={iconSize}
                  color={item.color}
                  style={styles.iconStyle}
                />
              ) : (
                <FontAwesome5
                  name={item.iconName}
                  size={iconSize}
                  color={iconActive}
                  style={styles.iconStyle}
                />
              )}
              <Text style={styles.textActive}>{item.label}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    NavContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 0,
    },
    NavBar: {
        flexDirection: 'row',
        backgroundColor: '#5C80BC',
        width: '100%',
        justifyContent: 'space-evenly',
        borderRadius: 40,
        padding: 2
    },
    IconBehave: {
        padding: 14,
        alignItems: 'center'
    },
    text:{
        color: 'white'
    },
    textActive:{
        color: '#efe'
    },
    iconStyle: {
        margin: 4,
    }
})