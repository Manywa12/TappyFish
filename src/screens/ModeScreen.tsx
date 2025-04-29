import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

type ModeScreenProps = {
  onBack: () => void;
  onModeSelected: (mode: string) => void; // Optioneel: om de gekozen modus door te geven
};

const ModeScreen: React.FC<ModeScreenProps> = ({ onBack, onModeSelected }) => {
  const handleMode = (mode: string) => {
    console.log(`Modus geselecteerd: ${mode}`);
    if (onModeSelected) {
      onModeSelected(mode);
    }
    onBack(); // Ga terug naar het startscherm na selectie (of pas dit aan)
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')} // Zorg ervoor dat het pad correct is
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Kies een Modus</Text>
        <View style={styles.modesContainer}>
          <TouchableOpacity style={styles.modeButton} onPress={() => handleMode('Easy')}>
            <Text style={styles.modeText}>Easy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeButton} onPress={() => handleMode('Medium')}>
            <Text style={styles.modeText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeButton} onPress={() => handleMode('Hard')}>
            <Text style={styles.modeText}>Hard</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Terug</Text>
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
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 30,
    color: '#F7F7F7',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  modesContainer: {
    width: '70%',
    alignItems: 'center',
    gap: 15,
    backgroundColor: 'rgba(30, 61, 89, 0.8)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  modeButton: {
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modeText: {
    color: '#F7F7F7',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(30, 61, 89, 0.8)',
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
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: '60%',
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
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 110, 64, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default ModeScreen;