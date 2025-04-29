import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type GameOverScreenProps = {
  score: number;
  coins: number;  // Voeg de coins toe als prop
  onRestart: () => void;
  onHome: () => void;
  onPlay: () => void;
};

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, coins, onRestart, onHome, onPlay }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.menuContainer}>
          <Text style={styles.title}>GAME OVER</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.score}>Coins: {score}</Text>


          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onPlay}>
              <Text style={styles.buttonIcon}>▶</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onRestart}>
              <Text style={styles.buttonIcon}>↺</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onHome}>
              <Text style={styles.buttonIcon}>⌂</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 61, 89, 0.92)',
  },
  menuContainer: {
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.12,
    borderRadius: width * 0.04,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: width * 0.09,
    fontWeight: '800',
    color: '#F7F7F7',
    marginBottom: height * 0.03,
    textTransform: 'uppercase',
    letterSpacing: 3,
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  score: {
    fontSize: width * 0.07,
    color: '#F5B971',
    marginBottom: height * 0.02,
    fontWeight: '700',
    textShadowColor: 'rgba(23, 183, 148, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  coins: {
    fontSize: width * 0.07,
    color: '#F5B971',
    marginBottom: height * 0.03,
    fontWeight: '700',
    textShadowColor: 'rgba(23, 183, 148, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: width * 0.06,
    marginTop: height * 0.02,
  },
  button: {
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    width: width * 0.16,
    height: width * 0.16,
    borderRadius: width * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    color: '#F7F7F7',
    fontSize: width * 0.08,
    textShadowColor: 'rgba(30, 61, 89, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default GameOverScreen;
