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
          <Text style={styles.coins}>Coins: {coins}</Text> {/* Toon de coins */}
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    backgroundColor: 'rgba(52, 73, 94, 0.95)',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.05,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: height * 0.02,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  score: {
    fontSize: width * 0.06,
    color: '#FFF',
    marginBottom: height * 0.03,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  coins: {
    fontSize: width * 0.06,
    color: '#FFF',
    marginBottom: height * 0.03,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: width * 0.05,
  },
  button: {
    backgroundColor: '#8E44AD',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  buttonIcon: {
    color: '#FFF',
    fontSize: width * 0.08,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default GameOverScreen;
