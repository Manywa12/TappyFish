import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.title}>Kies een Modus</Text>
      <TouchableOpacity style={styles.modeButton} onPress={() => handleMode('Easy')}>
        <Text style={styles.modeText}>Easy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modeButton} onPress={() => handleMode('Medium')}>
        <Text style={styles.modeText}>Medium</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modeButton} onPress={() => handleMode('Hard')}>
        <Text style={styles.modeText}>Hard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Terug</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: height * 0.05,
  },
  modeButton: {
    backgroundColor: 'rgba(70, 130, 180, 0.8)',
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.05,
    marginBottom: height * 0.03,
  },
  modeText: {
    color: '#FFF',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: height * 0.05,
    backgroundColor: '#555',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.03,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default ModeScreen;