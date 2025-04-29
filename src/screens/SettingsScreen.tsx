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
        trackColor={{ false: 'rgba(30, 61, 89, 0.9)', true: 'rgba(255, 110, 64, 0.9)' }}
        thumbColor={soundEnabled ? '#F5B971' : '#17B794'}
        ios_backgroundColor="rgba(30, 61, 89, 0.9)"
        onValueChange={toggleSound}
        value={soundEnabled}
        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
      />
    </View>

    <View style={styles.settingItem}>
      <Text style={styles.settingText}>Muziek</Text>
      <Switch
        trackColor={{ false: 'rgba(30, 61, 89, 0.9)', true: 'rgba(255, 110, 64, 0.9)' }}
        thumbColor={musicEnabled ? '#F5B971' : '#17B794'}
        ios_backgroundColor="rgba(30, 61, 89, 0.9)"
        onValueChange={toggleMusic}
        value={musicEnabled}
        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
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
    padding: 25,
    backgroundColor: 'rgba(30, 61, 89, 0.92)',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 35,
    color: '#F7F7F7',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    paddingHorizontal: 35,
    paddingVertical: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  settingsContainer: {
    width: '85%',
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    padding: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 110, 64, 0.15)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  settingText: {
    fontSize: 22,
    color: '#F7F7F7',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 110, 64, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    paddingVertical: 18,
    paddingHorizontal: 45,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  backButtonText: {
    color: '#F7F7F7',
    fontSize: 22,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 110, 64, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default SettingsScreen;