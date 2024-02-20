import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Carousel from 'react-native-snap-carousel';

import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


import { useNavigation } from '@react-navigation/native';

const items = [
    {
      image: require('../../../assets/secu9.png'),
      description: 'Avec un système contrôlable par téléphone, vous pouvez armer et désarmer votre système de sécurité à distance, ce qui est pratique lorsque vous avez oublié de le faire en partant de chez vous.',
      link: 'lien_vers_une_autre_page_1'
    },
    {
      image: require('../../../assets/secu0.jpeg'),
      description: "La visualisation en direct des caméras de sécurité sur votre téléphone vous permet de surveiller votre maison en temps réel, ce qui peut dissuader les intrus et vous offrir une tranquillité d'esprit supplémentaire",
      link: 'lien_vers_une_autre_page_2'
    },
    {
      image: require('../../../assets/secu1.jpeg'),
      description: "La capacité de verrouiller et déverrouiller les portes à distance via votre téléphone vous permet de contrôler l'accès à votre maison, même lorsque vous n'êtes pas physiquement présent",
      link: 'lien_vers_une_autre_page_2'
    },
    {
      image: require('../../../assets/secu2.jpeg'),
      description: "En cas d'urgence, comme une intrusion ou un incendie, pouvoir déclencher l'alarme ou contacter les services d'urgence directement depuis votre téléphone peut sauver des vies et limiter les dommages.",
      link: 'lien_vers_une_autre_page_2'
    },
    {
      image: require('../../../assets/secu3.jpeg'),
      description: "Les systèmes de sécurité contrôlables par téléphone offrent souvent des fonctionnalités avancées telles que la gestion des codes d'accès pour les visiteurs ou les prestataires de services, ce qui vous permet de contrôler qui entre dans votre maison.",
      link: 'lien_vers_une_autre_page_2'
    },
    {
      image: require('../../../assets/secu4.jpeg'),
      description: 'La possibilité de contrôler votre système de sécurité à domicile via votre téléphone vous offre un accès facile et pratique à distance, vous permettant de surveiller et de gérer la sécurité de votre maison où que vous soyez.',
      link: 'lien_vers_une_autre_page_2'
    },
    {
      image: require('../../../assets/secu5.jpeg'),
      description: "Recevoir des notifications en temps réel sur votre téléphone en cas d'activité suspecte ou d'urgence vous permet de réagir rapidement et de prendre les mesures nécessaires pour assurer la sécurité de votre domicile.",
      link: 'lien_vers_une_autre_page_2'
    },
    {
      image: require('../../../assets/secu6.jpeg'),
      description: "La connectivité mobile permet également de recevoir des alertes en cas de coupure de courant ou de dysfonctionnement du système, vous permettant de prendre des mesures correctives rapidement",
      link: 'lien_vers_une_autre_page_2'
    },
    {
      image: require('../../../assets/secu7.jpeg'),
      description: "En intégrant des capteurs intelligents à votre système de sécurité contrôlable par téléphone, vous pouvez surveiller des aspects spécifiques de votre maison, comme la température, l'humidité ou la qualité de l'air",
      link: 'lien_vers_une_autre_page_2'
    },
    {
      image: require('../../../assets/secu8.jpeg'),
      description: "Enfin, un système de sécurité à domicile que vous pouvez gérer avec votre téléphone offre une flexibilité et une personnalisation accrues, vous permettant d'adapter le système à vos besoins spécifiques et d'améliorer la sécurité globale de votre maison",
      link: 'lien_vers_une_autre_page_2'
    },
];

export default function StartScreen() {
    const navigation = useNavigation();
    
    const renderItem = ({ item }) => (
        <View className="h-100 w-full" style={{ backgroundColor: 'rgba(255,255,255,0.4)',borderRadius: 10 }}>
        <Image style={{ height: '50%', width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} source={item.image} blurRadius={1} />
        <View style={{ height: '30%', width: '100%', backgroundColor: 'transparent', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black',fontSize: 18 }}>{item.description}</Text>
        </View>
        </View>
    );
    const styles = {
      button: {
        backgroundColor: '#1E40AF', // Couleur bleue
        borderRadius: 8, // Coins arrondis
        padding: 12, // Espacement intérieur
        paddingLeft:50,
        paddingRight:50,
        margin: 2, // Marge extérieure
        shadowColor: '#000', // Couleur de l'ombre
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Effet d'élévation pour l'ombre sur Android
      },
      buttonText: {
        color: 'black', // Couleur du texte
        fontSize: 20
      },
      image: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
    };
    

    return (
        <View className="flex-1 bg-white" style={{ alignItems: 'center',position: 'absolute',
        width: '100%',
        height: '94%',}}>
        <Image
        source={require('../../../assets/background.png')}
        style={styles.image}
        blurRadius={40}
      />
        <Carousel
            data={items}
            renderItem={renderItem}
            sliderWidth={400}
            itemWidth={400}
            autoplay
            autoplayInterval={5000}
            loop
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('SignIn'); }}>
                <Text style={styles.buttonText}>SignIn </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}  onPress={() => {navigation.navigate('SignUp'); }}>
                <Text style={styles.buttonText}>SignUp</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}
