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
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    paddingVertical: 18,
    paddingHorizontal: 140,
    borderRadius: 30,
    marginVertical: 12,
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#F5B971',
  },
  buttonText: {
    color: '#F7F7F7',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 15,
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
    backgroundColor: 'rgba(30, 61, 89, 0.9)',
    padding: 20,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
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