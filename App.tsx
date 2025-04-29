import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SoundManager from './src/utils/SoundManager';

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
  const [coins, setCoins] = useState(100);
  const [purchasedSkins, setPurchasedSkins] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<string>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  // Initialize sound manager
  useEffect(() => {
    const initSound = async () => {
      const soundManager = SoundManager.getInstance();
      await soundManager.loadSounds();
      soundManager.setMusicEnabled(musicEnabled);
      soundManager.setSoundEnabled(soundEnabled);
    };
    initSound();
    return () => {
      SoundManager.getInstance().cleanup();
    };
  }, [musicEnabled, soundEnabled]);

  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedSound, savedMusic, savedSkin] = await Promise.all([
          AsyncStorage.getItem('soundEnabled'),
          AsyncStorage.getItem('musicEnabled'),
          AsyncStorage.getItem('selectedSkin')
        ]);
        
        if (savedSound !== null) setSoundEnabled(savedSound === 'true');
        if (savedMusic !== null) setMusicEnabled(savedMusic === 'true');
        if (savedSkin) setSelectedSkin(savedSkin);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Save sound settings when changed
  useEffect(() => {
    AsyncStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    AsyncStorage.setItem('musicEnabled', musicEnabled.toString());
  }, [musicEnabled]);

  const handleSoundToggle = useCallback((enabled: boolean) => {
    setSoundEnabled(enabled);
    SoundManager.getInstance().setSoundEnabled(enabled);
  }, []);

  const handleMusicToggle = useCallback((enabled: boolean) => {
    setMusicEnabled(enabled);
    SoundManager.getInstance().setMusicEnabled(enabled);
  }, []);


  const goToHome = useCallback(async () => {
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

  const handleFishPurchased = useCallback((fishId: string) => {
    setPurchasedSkins(prev => [...prev, fishId]);
  }, []);

  // Load saved data on startup
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [savedSkins, savedSelectedSkin] = await Promise.all([
          AsyncStorage.getItem('purchasedSkins'),
          AsyncStorage.getItem('selectedSkin')
        ]);
        
        if (savedSkins) {
          setPurchasedSkins(JSON.parse(savedSkins));
        }
        if (savedSelectedSkin) {
          setSelectedSkin(savedSelectedSkin);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };
    loadSavedData();
  }, []);

  // Save purchased skins when updated
  useEffect(() => {
    AsyncStorage.setItem('purchasedSkins', JSON.stringify(purchasedSkins));
  }, [purchasedSkins]);

  // Save selected skin when updated
  useEffect(() => {
    AsyncStorage.setItem('selectedSkin', selectedSkin);
  }, [selectedSkin]);

  const handleSkinSelection = useCallback((skinId: string) => {
    setSelectedSkin(skinId);
    setCurrentScreen('start');
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
            selectedMode={selectedMode}
          />
        )}
        {currentScreen === 'game' && (
          <GameScreen
            onGameOver={endGame}
            coins={coins}
            setCoins={setCoins}
            selectedMode={selectedMode}
            selectedSkin={selectedSkin}
          />
        )}
        {currentScreen === 'gameOver' && (
          <GameOverScreen
            score={score}
            coins={coins}
            onRestart={restartGame}
            onHome={goToHome}
            onPlay={startGame}
          />
        )}
        {currentScreen === 'mode' && (
          <ModeScreen
            onBack={goToHome}
            onModeSelected={mode => {
              console.log(`Modus gekozen in App: ${mode}`);
              setSelectedMode(mode);
              setCurrentScreen('start');
            }}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen
            onBack={goToHome}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onSoundToggle={handleSoundToggle}
            onMusicToggle={handleMusicToggle}
          />
        )}
        {currentScreen === 'shop' && (
          <ShopScreen
            onBack={goToHome}
            onFishPurchased={handleFishPurchased}
            coins={coins}
            setCoins={setCoins}
          />
        )}
        {currentScreen === 'skins' && (
          <SkinsScreen
            onBack={goToHome}
            purchasedSkins={purchasedSkins}
            onSkinSelected={handleSkinSelection}
            currentSkin={selectedSkin}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });

export default App;