import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';

type SkinsScreenProps = {
  onBack: () => void;
  purchasedSkins: string[];
  onSkinSelected: (skinId: string) => void;
  currentSkin: string;
};

const SkinsScreen: React.FC<SkinsScreenProps> = ({ onBack, purchasedSkins, onSkinSelected, currentSkin }) => {
  const [selectedSkin, setSelectedSkin] = useState<string>(currentSkin);

  const handleSkinPress = useCallback((skinId: string) => {
    setSelectedSkin(skinId);
  }, []);

  const handleConfirm = useCallback(() => {
    onSkinSelected(selectedSkin);
    onBack();
  }, [selectedSkin, onSkinSelected, onBack]);

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Mijn Skins</Text>

        <View style={styles.topPreview}>
          <Text style={styles.currentSkinText}>Huidige Skin:</Text>
          <View style={styles.selectedFishContainer}>
            <Image
              source={
                selectedSkin === 'default'
                  ? require('../../assets/images/fish.png')
                  : selectedSkin
                  ? getFishImage(selectedSkin)
                  : require('../../assets/images/fish.png')
              }
              style={styles.selectedFishImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.bottomPreviews}>
          <TouchableOpacity
            style={[styles.previewPlaceholder, selectedSkin === 'default' && styles.selectedPlaceholder]}
            onPress={() => handleSkinPress('default')}
          >
            <Image source={require('../../assets/images/fish.png')} style={styles.previewImage} resizeMode="contain" />
          </TouchableOpacity>
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.previewPlaceholder,
                  purchasedSkins[index] === selectedSkin && styles.selectedPlaceholder,
                ]}
                onPress={() => {
                  if (purchasedSkins[index]) {
                    handleSkinPress(purchasedSkins[index]);
                  }
                }}
                disabled={!purchasedSkins[index]}
              >
                {purchasedSkins[index] && (
                  <Image
                    source={getFishImage(purchasedSkins[index])}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            ))}
        </View>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.confirmButton]} 
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Bevestig Selectie</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onBack}
          >
            <Text style={styles.buttonText}>Annuleren</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const getFishImage = (fishId: string) => {
  switch (fishId) {
    case 'fish1':
      return require('../../assets/images/fish_gold.png');
    case 'fish2':
      return require('../../assets/images/fish_blue.png');
    case 'fish3':
      return require('../../assets/images/fish_orange.png');
    default:
      return require('../../assets/images/fish_gold.png');
  }
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  overlay: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 61, 89, 0.92)',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
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
  topPreview: {
    alignItems: 'center',
    marginBottom: 25,
  },
  selectedFishContainer: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedFishImage: { 
    width: 110, 
    height: 110 
  },
  bottomPreviews: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    padding: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  previewPlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  previewImage: { 
    width: 50, 
    height: 50 
  },
  selectedPlaceholder: {
    borderColor: '#F5B971',
    borderWidth: 3,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  confirmButton: {
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    borderColor: '#F5B971',
    shadowColor: '#17B794',
  },
  cancelButton: {
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    borderColor: '#F5B971',
    shadowColor: '#17B794',
  },
  buttonText: {
    color: '#F7F7F7',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 110, 64, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  currentSkinText: {
    fontSize: 16,
    color: '#F7F7F7',
    marginBottom: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 110, 64, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  noSkinsText: {
    fontSize: 16,
    color: '#F7F7F7',
    marginTop: 40,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 110, 64, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default SkinsScreen;