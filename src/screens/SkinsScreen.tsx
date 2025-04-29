import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';

type SkinsScreenProps = {
  onBack: () => void;
  purchasedSkins: string[];
  onSkinSelected: (skinId: string) => void;
};

const SkinsScreen: React.FC<SkinsScreenProps> = ({ onBack, purchasedSkins, onSkinSelected }) => {
  const [selectedSkin, setSelectedSkin] = useState<string | null>('default');

  const handleSkinPress = useCallback((skinId: string) => {
    setSelectedSkin(skinId);
  }, []);

  const handleSelectSkin = useCallback(() => {
    if (selectedSkin) {
      onSkinSelected(selectedSkin);
    }
  }, [selectedSkin, onSkinSelected]);

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Mijn Skins</Text>

        <View style={styles.topPreview}>
          <Text style={styles.currentSkinText}>Huidige Skin:</Text>
     <TouchableOpacity style={styles.selectedFishContainer} onPress={() => {}}>
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
          </TouchableOpacity>
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

        {purchasedSkins.length === 0 && (
          <Text style={styles.noSkinsText}>Je hebt nog geen skins gekocht.</Text>
        )}

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Terug naar Start</Text>
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
  container: { flex: 1 },
  overlay: {
    flex: 1,
    padding: 25,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 61, 89, 0.92)',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 25,
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
  topPreview: {
    alignItems: 'center',
    marginBottom: 35,
  },
  selectedFishContainer: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    borderRadius: 25,
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
  selectedFishImage: { width: 150, height: 150 },
  emptySelectedFishContainer: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(30, 61, 89, 0.8)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
  },
  emptyText: {
    color: '#F7F7F7',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  selectButton: {
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  selectButtonText: {
    color: '#F7F7F7',
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(30, 61, 89, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomPreviews: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 25,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
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
  previewPlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    borderRadius: 15,
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
  previewImage: { width: 70, height: 70 },
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
    marginBottom: 25,
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
  currentSkinText: {
    fontSize: 22,
    color: '#F7F7F7',
    marginBottom: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 110, 64, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
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
  noSkinsText: {
    fontSize: 22,
    color: '#F7F7F7',
    marginTop: 50,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 110, 64, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    padding: 20,
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