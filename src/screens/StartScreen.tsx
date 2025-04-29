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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 20,
    width: '100%',
  },
  logo: {
    width: 600,
    height: 240,
    resizeMode: 'contain',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginVertical: 8,
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#F5B971',
    width: 200,
  },
  buttonText: {
    color: '#F7F7F7',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 15,
  },
  iconContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconButton: {
    backgroundColor: 'rgba(30, 61, 89, 0.9)',
    padding: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center',
  },
  shopIcon: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  settingsIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  skinsIcon: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
});

export default StartScreen;