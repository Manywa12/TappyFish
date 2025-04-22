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
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2 },

  topPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedFishContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedFishImage: { width: 120, height: 120 },
  emptySelectedFishContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { color: '#fff', fontSize: 16 },
  selectButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  selectButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 },

  bottomPreviews: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  previewPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: { width: 60, height: 60 },
  selectedPlaceholder: {
    borderColor: '#007bff',
    borderWidth: 2,
  },

  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0, 123, 255, 0.8)',
    paddingVertical: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    elevation: 3,
  },
  currentSkinText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  backButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 },
  noSkinsText: { fontSize: 18, color: '#fff', marginTop: 50, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 },
});

export default SkinsScreen;