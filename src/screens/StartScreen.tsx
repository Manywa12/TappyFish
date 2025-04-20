import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/fishtestANDimage.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={onStart}
          >
            <Text style={styles.buttonText}>START</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>MODE{'\n'}MEDIUM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: height * 0.15,
    paddingBottom: height * 0.1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: width * 2,
    height: width * 0.8,
  },
  buttonContainer: {
    alignItems: 'center',
    gap: height * 0.02,
  },
  button: {
    backgroundColor: 'rgba(70, 130, 180, 0.8)',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.15,
    borderRadius: width * 0.05,
    borderWidth: 2,
    borderColor: '#FFF',
    marginVertical: height * 0.01,
  },
  buttonText: {
    color: '#FFF',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
});

export default StartScreen;