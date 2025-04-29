import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Animated, Easing, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: any;
}

const shopItems: ShopItem[] = [
  { id: 'fish1', name: 'Gouden Vis', price: 50, image: require('../../assets/images/fish_gold.png') },
  { id: 'fish2', name: 'Blauwe Vin', price: 75, image: require('../../assets/images/fish_blue.png') },
  { id: 'fish3', name: 'Oranje Streep', price: 100, image: require('../../assets/images/fish_orange.png') },
];

type ShopScreenProps = {
  onBack: () => void;
  onFishPurchased: (fishId: string) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
};

const ShopScreen: React.FC<ShopScreenProps> = ({ onBack, onFishPurchased, coins: propCoins, setCoins: setPropCoins }) => {
  const [localCoins, setLocalCoins] = useState(propCoins);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [purchasedSkins, setPurchasedSkins] = useState<string[]>([]);
  const currentItem = shopItems[currentIndex];

  const arrowLeftAnimation = useState(new Animated.Value(1))[0];
  const arrowRightAnimation = useState(new Animated.Value(1))[0];
  const buyButtonAnimation = useState(new Animated.Value(1))[0];

  useEffect(() => {
    setLocalCoins(propCoins);
  }, [propCoins]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSkins = await AsyncStorage.getItem('purchasedSkins');
        if (storedSkins !== null) setPurchasedSkins(JSON.parse(storedSkins));
      } catch (error) {
        console.error('Fout bij laden van data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('purchasedSkins', JSON.stringify(purchasedSkins));
  }, [purchasedSkins]);

  const animateArrowPress = (animationValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animationValue, { toValue: 0.8, duration: 50, useNativeDriver: true }),
      Animated.timing(animationValue, { toValue: 1, duration: 150, easing: Easing.bounce, useNativeDriver: true }),
    ]).start();
  };

  const animateBuyButtonPress = () => {
    Animated.sequence([
      Animated.timing(buyButtonAnimation, { toValue: 0.9, duration: 50, useNativeDriver: true }),
      Animated.timing(buyButtonAnimation, { toValue: 1, duration: 100, easing: Easing.ease, useNativeDriver: true }),
    ]).start();
  };

  const goToPrevious = useCallback(() => {
    animateArrowPress(arrowLeftAnimation);
    setCurrentIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : shopItems.length - 1));
  }, []);

  const goToNext = useCallback(() => {
    animateArrowPress(arrowRightAnimation);
    setCurrentIndex(prevIndex => (prevIndex < shopItems.length - 1 ? prevIndex + 1 : 0));
  }, []);

  const handlePurchase = useCallback((item: ShopItem) => {
    if (purchasedSkins.includes(item.id)) return;
    animateBuyButtonPress();
    if (localCoins >= item.price) {
      Alert.alert(
        'Aankoop bevestigen',
        `Wil je de ${item.name} kopen voor ${item.price} coins?`,
        [
          { text: 'Annuleren', style: 'cancel' },
          {
            text: 'Kopen',
            onPress: () => {
              setLocalCoins(currentCoins => currentCoins - item.price);
              if (setPropCoins) {
                setPropCoins(currentCoins => currentCoins - item.price);
                AsyncStorage.setItem('coins', (localCoins - item.price).toString());
              }
              setPurchasedSkins(prevSkins => [...prevSkins, item.id]);
              onFishPurchased(item.id);
              Alert.alert('Aankoop gelukt', `Je hebt de ${item.name} gekocht!`);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert('Niet genoeg coins', 'Je hebt niet genoeg coins om deze vis te kopen.', [{ text: 'Oké' }]);
    }
  }, [localCoins, purchasedSkins, onFishPurchased, animateBuyButtonPress, setPropCoins]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/background.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <View style={styles.coinsCard}>
            <Text style={styles.coinsCardText}>{localCoins}</Text>
            <TouchableOpacity style={styles.plusButton}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemDisplay}>
            <TouchableOpacity style={styles.arrowButton} onPress={goToPrevious}>
              <Animated.Text style={[styles.arrow, { transform: [{ scale: arrowLeftAnimation }] }]}>{'<'}</Animated.Text>
            </TouchableOpacity>

            <View style={styles.itemContainer}>
              {currentItem && (
                <>
                  <View style={styles.fishContainer}>
                    <Image source={currentItem.image} style={styles.fishImage} resizeMode="contain" />
                  </View>
                  <Text style={styles.itemName}>{currentItem.name}</Text>
                  <Text style={styles.itemPrice}>{currentItem.price} <Text style={{ fontSize: 14 }}>💰</Text></Text>
                </>
              )}
            </View>

            <TouchableOpacity style={styles.arrowButton} onPress={goToNext}>
              <Animated.Text style={[styles.arrow, { transform: [{ scale: arrowRightAnimation }] }]}>{'>'}</Animated.Text>
            </TouchableOpacity>
          </View>

          {currentItem && (
            <TouchableOpacity
              style={[styles.buyButton, purchasedSkins.includes(currentItem.id) && styles.boughtButton]}
              onPress={() => handlePurchase(currentItem)}
              disabled={purchasedSkins.includes(currentItem.id)}
            >
              <Animated.Text style={[styles.buyButtonText, purchasedSkins.includes(currentItem.id) && styles.boughtButtonText]}>
                {purchasedSkins.includes(currentItem.id) ? 'Gekocht' : 'Kopen'}
              </Animated.Text>
            </TouchableOpacity>
          )}

          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>Terug</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 61, 89, 0.92)',
  },
  itemDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 80,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  arrowButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    color: '#F7F7F7',
    textShadowColor: 'rgba(30, 61, 89, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    textAlign: 'center',
    lineHeight: 20,
  },
  itemContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    flex: 1,
  },
  fishContainer: {
    width: 140,
    height: 140,
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#F5B971',
    backgroundColor: 'rgba(255, 110, 64, 0.1)',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fishImage: {
    width: 100,
    height: 100,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F7F7F7',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 15,
    color: '#F5B971',
    marginBottom: 8,
    fontWeight: '700',
    textShadowColor: 'rgba(23, 183, 148, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  buyButton: {
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginTop: 10,
    width: 160,
  },
  buyButtonText: {
    color: '#F7F7F7',
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(30, 61, 89, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  boughtButton: {
    backgroundColor: 'rgba(30, 61, 89, 0.8)',
  },
  boughtButtonText: {
    color: '#F5B971',
    opacity: 0.8,
  },
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
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
  coinsCard: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  coinsCardText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5B971',
    marginRight: 8,
    textShadowColor: 'rgba(255, 110, 64, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  plusButton: {
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  plusText: {
    color: '#F7F7F7',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(30, 61, 89, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 18,
  },
});

export default ShopScreen;
