import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StartScreen from './screens/StartScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';

type Screen = 'start' | 'game' | 'gameOver';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [score, setScore] = useState(0);

  const goToHome = useCallback(() => {
    setScore(0);
    setCurrentScreen('start');
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setCurrentScreen('game');
  }, []);

  const endGame = useCallback((finalScore: number) => {
    setScore(finalScore);
    setCurrentScreen('gameOver');
  }, []);

  const restartGame = useCallback(() => {
    setScore(0);
    setCurrentScreen('game');
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        {currentScreen === 'start' && (
          <StartScreen onStart={startGame} />
        )}
        {currentScreen === 'game' && (
          <GameScreen onGameOver={endGame} />
        )}
        {currentScreen === 'gameOver' && (
          <GameOverScreen 
            score={score}
            onRestart={restartGame}
            onHome={goToHome}
            onPlay={startGame}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;