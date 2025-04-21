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
                  <View style={[styles.fishContainer, { backgroundColor: 'transparent' }]}>
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
              <Text style={styles.backButtonText}>Terug naar Start</Text>
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
    justifyContent: 'space-between',
  },
  header: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  coinsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  itemDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    elevation: 5,
    marginBottom: 20,
    marginTop: 70,
  },
  arrowButton: {
    padding: 15,
  },
  arrow: {
    fontSize: 36,
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  itemContainer: {
    alignItems: 'center',
    flex: 1,
  },
  fishContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  fishImage: {
    width: 180,
    height: 180,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  itemPrice: {
    fontSize: 18,
    color: '#555',
    marginBottom: 15,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
    marginTop: 20,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  boughtButton: {
    backgroundColor: 'gray',
  },
  boughtButtonText: {
    color: '#eee',
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
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  coinsCard: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsCardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#daa520',
    marginRight: 10,
  },
  plusButton: {
    backgroundColor: '#007bff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ShopScreen;
