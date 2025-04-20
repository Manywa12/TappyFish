import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';

type SkinsScreenProps = {
  onBack: () => void;
  purchasedSkins: string[];
  onSkinSelected: (skinId: string) => void; // Callback om de geselecteerde skin door te geven
};

const SkinsScreen: React.FC<SkinsScreenProps> = ({ onBack, purchasedSkins, onSkinSelected }) => {
  const [selectedSkin, setSelectedSkin] = useState<string | null>(null);

  const handleSkinPress = useCallback((skinId: string) => {
    setSelectedSkin(skinId);
  }, []);

  const handleSelectSkin = useCallback(() => {
    if (selectedSkin) {
      onSkinSelected(selectedSkin);
    }
  }, [selectedSkin, onSkinSelected]);

  const renderItem = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity style={[styles.gridItem, selectedSkin === item && styles.selectedGridItem]} onPress={() => handleSkinPress(item)}>
      <Image source={getFishImage(item)} style={styles.gridImage} resizeMode="contain" />
      {/* Je zou hier de naam van de skin kunnen toevoegen als je wilt */}
    </TouchableOpacity>
  ), [selectedSkin, handleSkinPress]);

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')} // Zorg ervoor dat het pad correct is
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Mijn Skins</Text>

        {purchasedSkins.length > 0 ? (
          <>
            <FlatList
              data={purchasedSkins}
              keyExtractor={(item) => item}
              renderItem={renderItem}
              numColumns={3} // Of een ander aantal kolommen dat goed past
              contentContainerStyle={styles.gridContainer}
            />

            {selectedSkin && (
              <View style={styles.detailContainer}>
                <Text style={styles.detailTitle}>Geselecteerde Skin:</Text>
                <Image source={getFishImage(selectedSkin)} style={styles.detailImage} resizeMode="contain" />
                <Text style={styles.detailName}>{selectedSkin}</Text> {/* Toon de naam van de skin */}
                <TouchableOpacity style={styles.selectButton} onPress={handleSelectSkin}>
                  <Text style={styles.selectButtonText}>Selecteren</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.emptyText}>Je hebt nog geen skins gekocht.</Text>
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

// Functie om de afbeelding van de vis te krijgen (dezelfde als in je originele code)
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
    width: '100%',
    height: '100%',
    justifyContent: 'space-between', // Verdeelt de verticale ruimte
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2 },
  gridContainer: { paddingBottom: 20 },
  gridItem: {
    width: 100,
    height: 100,
    margin: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedGridItem: {
    borderColor: '#007bff',
    borderWidth: 3,
  },
  gridImage: { width: 80, height: 80 },
  detailContainer: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 },
  detailImage: { width: 150, height: 150, marginBottom: 10 },
  detailName: { fontSize: 16, color: '#fff', marginBottom: 15, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 },
  selectButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  selectButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 },
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0, 123, 255, 0.8)', // Blauwe kleur van de ShopScreen
    paddingVertical: 15, // Iets meer verticale padding
    borderRadius: 10, // Afgeronde hoeken zoals de andere blauwe knop
    width: '90%', // Dezelfde breedte als de "Terug naar Start" knop in de ShopScreen
    alignItems: 'center',
    elevation: 3, // Voeg een subtiele schaduw toe
  },
  backButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 }, // Grotere tekst en subtiele schaduw
  emptyText: { fontSize: 18, color: '#fff', marginTop: 50, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 },
});

export default SkinsScreen;