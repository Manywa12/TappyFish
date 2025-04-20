import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COIN_SIZE = width * 0.12; // Increased from 0.08 to 0.12

type CoinProps = {
  position: { x: number; y: number };
};

const Coin: React.FC<CoinProps> = ({ position }) => {
  return (
    <View
      style={[
        styles.coin,
        {
          left: position.x,
          top: position.y,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  coin: {
    width: COIN_SIZE,
    height: COIN_SIZE,
    borderRadius: COIN_SIZE / 2,
    backgroundColor: '#FFD700',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFA500',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Coin;