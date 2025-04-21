import React,{useState,useCallback,useEffect} from 'react';
import {SafeAreaView,StyleSheet} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StartScreen from './src/screens/StartScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ShopScreen from './src/screens/ShopScreen';
import SkinsScreen from './src/screens/SkinsScreen';
import ModeScreen from './src/screens/ModeScreen';

type Screen='start'|'game'|'gameOver'|'settings'|'shop'|'skins'|'mode';

const App=()=>{
  const[currentScreen,setCurrentScreen]=useState<Screen>('start');
  const[score,setScore]=useState(0);
  const[coins,setCoins]=useState(0);
  const[purchasedSkins,setPurchasedSkins]=useState<string[]>([]);
  const[selectedMode,setSelectedMode]=useState<string|null>(null);

  useEffect(()=>{
    AsyncStorage.clear();
  });
  const goToHome=useCallback(async()=>{
    setScore(0);
    try{
      const storedCoins=await AsyncStorage.getItem('coins');
      setCoins(storedCoins?parseInt(storedCoins):100);
    }catch(error){
      console.error('Fout bij het laden van coins bij terug naar home:',error);
    }
    setCurrentScreen('start');
  },[]);

  const startGame=useCallback(()=>{
    setScore(0);
    setCurrentScreen('game');
  },[]);

  const endGame=useCallback((finalScore:number)=>{
    setScore(finalScore);
    setCurrentScreen('gameOver');
  },[]);

  const restartGame=useCallback(()=>{
    setScore(0);
    setCurrentScreen('game');
  },[]);

  const handleFishPurchased=useCallback((fishId:string)=>{
    setPurchasedSkins(prev=>[...prev,fishId]);
  },[]);

  useEffect(()=>{
    AsyncStorage.setItem('purchasedSkins',JSON.stringify(purchasedSkins));
  },[purchasedSkins]);

  const handleSkinSelection=useCallback((skinId:string)=>{
    console.log(`Skin geselecteerd met ID: ${skinId}`);
  },[]);

  return(
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light"/>
      <SafeAreaView style={styles.container}>
        {currentScreen==='start'&&(
          <StartScreen
            onStart={startGame}
            onOpenSettings={()=>setCurrentScreen('settings')}
            onOpenShop={()=>setCurrentScreen('shop')}
            onOpenSkins={()=>setCurrentScreen('skins')}
            onOpenModeSelect={()=>setCurrentScreen('mode')}
            selectedMode={selectedMode}
          />
        )}
        {currentScreen==='game'&&(
          <GameScreen
            onGameOver={endGame}
            coins={coins}
            setCoins={setCoins}
            selectedMode={selectedMode}
          />
        )}
        {currentScreen==='gameOver'&&(
          <GameOverScreen
            score={score}
            coins={coins}
            onRestart={restartGame}
            onHome={goToHome}
            onPlay={startGame}
          />
        )}
        {currentScreen==='mode'&&(
          <ModeScreen
            onBack={goToHome}
            onModeSelected={mode=>{
              console.log(`Modus gekozen in App: ${mode}`);
              setSelectedMode(mode);
              setCurrentScreen('start');
            }}
          />
        )}
        {currentScreen==='settings'&&(
          <SettingsScreen onBack={goToHome}/>
        )}
        {currentScreen==='shop'&&(
          <ShopScreen
            onBack={goToHome}
            onFishPurchased={handleFishPurchased}
            coins={coins}
            setCoins={setCoins}
          />
        )}
        {currentScreen==='skins'&&(
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

const styles=StyleSheet.create({container:{flex:1}});

export default App;
