import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/bkgrnd.jpg')} style={styles.backgroundImage}>
      <Image style={styles.image} source={require("./assets/bird.png")}/>
      <Text style={styles.title}>Dendroica App</Text>
      <Text style={styles.subtitle}>Coming Soon.....</Text>
      </ImageBackground>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
  title: {
    fontWeight: "700",
    letterSpacing: 4,
    fontSize: 20,
  },
  subtitle:{
    marginTop: 40,

  },
  backgroundImage:{
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
    height:'100%'
  },

});
