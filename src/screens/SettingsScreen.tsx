import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const SettingsScreen = ({ onBack }: { onBack: () => void }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const toggleSound = () => {
    setSoundEnabled(previousState => !previousState);
    console.log('Geluid is nu:', !soundEnabled ? 'aan' : 'uit');
  };

  const toggleMusic = () => {
    setMusicEnabled(previousState => !previousState);
    console.log('Muziek is nu:', !musicEnabled ? 'aan' : 'uit');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.container}
    >
 <View style={styles.overlay}>
  <Text style={styles.title}>Instellingen</Text>

  {/* Nieuwe container voor de instellingen */}
  <View style={styles.settingsContainer}>
    <View style={styles.settingItem}>
      <Text style={styles.settingText}>Geluid</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={soundEnabled ? '#f4f3f4' : '#767577'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSound}
        value={soundEnabled}
      />
    </View>

    <View style={styles.settingItem}>
      <Text style={styles.settingText}>Muziek</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={musicEnabled ? '#f4f3f4' : '#767577'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleMusic}
        value={musicEnabled}
      />
    </View>
  </View>

  <View style={styles.bottomButtonContainer}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backButtonText}>Terug naar Start</Text>
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
  overlay: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between', // Houdt de titel en knop aan de uiteinden
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  settingsContainer: {
    width: '80%',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Houdt nu de ruimte tussen de instellingen
  },
  settingText: {
    fontSize: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0, 123, 255, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default SettingsScreen;