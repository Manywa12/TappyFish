import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const FISH_SIZE = width * 0.2; // Increased from 0.15 to 0.2

type FishProps = {
  position: { x: number; y: number };
  skinId?: string;
};

const getFishImage = (skinId: string = 'default') => {
  switch (skinId) {
    case 'fish1':
      return require('../../assets/images/fish_gold.png');
    case 'fish2':
      return require('../../assets/images/fish_blue.png');
    case 'fish3':
      return require('../../assets/images/fish_orange.png');
    default:
      return require('../../assets/images/fish.png');
  }
};

const Fish: React.FC<FishProps> = ({ position, skinId = 'default' }) => {
  return (
    <Image
      source={getFishImage(skinId)}
      style={[
        styles.fish,
        {
          left: position.x,
          top: position.y,
        },
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  fish: {
    width: FISH_SIZE,
    height: FISH_SIZE * 0.6,
    position: 'absolute',
  },
});

export default Fish;