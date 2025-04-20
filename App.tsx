import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import StartScreen from './src/screens/StartScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ShopScreen from './src/screens/ShopScreen';
import SkinsScreen from './src/screens/SkinsScreen';
import ModeScreen from './src/screens/ModeScreen';

type Screen = 'start' | 'game' | 'gameOver' | 'settings' | 'shop' | 'skins' | 'mode';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0); // Nieuwe state voor coins
  const [purchasedSkins, setPurchasedSkins] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const goToHome = useCallback(() => {
    setScore(0);
    setCoins(0); // Reset de coins naar 0 bij terug naar de start
    setCurrentScreen('start');
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setCoins(0); // Reset de coins bij het starten van het spel
    setCurrentScreen('game');
  }, []);

  const endGame = useCallback((finalScore: number) => {
    setScore(finalScore);
    setCurrentScreen('gameOver');
  }, []);

  const restartGame = useCallback(() => {
    setScore(0);
    setCoins(100); // Reset de coins bij herstart
    setCurrentScreen('game');
  }, []);

  const handleFishPurchased = useCallback((fishId: string) => {
    setPurchasedSkins((prevSkins) => [...prevSkins, fishId]);
  }, []);

  const handleSkinSelection = useCallback((skinId: string) => {
    console.log(`Skin geselecteerd met ID: ${skinId}`);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        {currentScreen === 'start' && (
          <StartScreen
            onStart={startGame}
            onOpenSettings={() => setCurrentScreen('settings')}
            onOpenShop={() => setCurrentScreen('shop')}
            onOpenSkins={() => setCurrentScreen('skins')}
            onOpenModeSelect={() => setCurrentScreen('mode')}
            selectedMode={selectedMode} // ✅ Gekozen modus doorgeven
          />
        )}
        {currentScreen === 'game' && (
          <GameScreen
            onGameOver={endGame}
            coins={coins} // De coins doorgeven aan GameScreen
            setCoins={setCoins} // De functie om coins bij te werken
          />
        )}
        {currentScreen === 'gameOver' && (
          <GameOverScreen
            score={score}
            coins={coins}  // Geef de coins door naar de GameOverScreen
            onRestart={restartGame}
            onHome={goToHome}
            onPlay={startGame}
          />
        )}


        {currentScreen === 'mode' && (
          <ModeScreen
            onBack={goToHome}
            onModeSelected={(mode) => {
              console.log(`Modus gekozen in App: ${mode}`);
              setSelectedMode(mode);
              setCurrentScreen('start');
            }}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen onBack={goToHome} />
        )}
        {currentScreen === 'shop' && (
          <ShopScreen
            onBack={goToHome}
            onFishPurchased={handleFishPurchased}
          />
        )}
        {currentScreen === 'skins' && (
          <SkinsScreen
            onBack={goToHome}
            purchasedSkins={purchasedSkins}
            onSkinSelected={handleSkinSelection}
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
