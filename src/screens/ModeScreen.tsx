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
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between', // Verdeelt de ruimte tussen de elementen
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  modesContainer: {
    width: '80%',
    alignItems: 'center',
  },
  modeButton: {
    backgroundColor: 'rgba(139, 0, 139, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 3,
  },
  modeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
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

export default ModeScreen;