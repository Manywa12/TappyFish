import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';

type StartScreenProps = {
  onStart: () => void;
  onOpenSettings: () => void;
  onOpenShop: () => void;
  onOpenSkins: () => void;
  onOpenModeSelect: () => void;
  selectedMode?: string | null; // ✅ toegevoegd
};

const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  onOpenSettings,
  onOpenShop,
  onOpenSkins,
  onOpenModeSelect,
  selectedMode,
}) => {
  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/fishtestANDimage.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onStart}>
            <Text style={styles.buttonText}>START</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onOpenModeSelect}>
            <Text style={styles.buttonText}>
              MODE{'\n'}
              {selectedMode ? selectedMode.toUpperCase() : 'KIES'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={[styles.iconButton, styles.shopIcon]}
          onPress={onOpenShop}
        >
          <Text style={styles.iconText}>🛒</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, styles.settingsIcon]}
          onPress={onOpenSettings}
        >
          <Text style={styles.iconText}>⚙️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, styles.skinsIcon]}
          onPress={onOpenSkins}
        >
          <Text style={styles.iconText}>👚</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start', // Wijzigen naar flex-start om items bovenaan te plaatsen
    alignItems: 'center',
    paddingTop: 120, // Verhoog de paddingTop om de content meer naar beneden te duwen (minder hoog)
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40, 
  },
  logo: {
    width: 800,
    height: 320, 
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: 'rgba(70, 130, 180, 0.8)',
    paddingVertical: 15, 
    paddingHorizontal: 140, 
    borderRadius: 25, 
    borderWidth: 2,
    borderColor: '#FFF',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18, // Iets grotere tekst
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  iconContainer: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    bottom: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconButton: {
    backgroundColor: 'rgba(70, 130, 180, 0.8)',
    padding: 16,
    borderRadius: 32,
  },
  iconText: {
    color: '#FFF',
    fontSize: 28,
  },
  shopIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  settingsIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  skinsIcon: {
    position: 'absolute',
    bottom: 5,
    left: 5,
  },
});

export default StartScreen;