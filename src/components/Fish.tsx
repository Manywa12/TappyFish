import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const FISH_SIZE = width * 0.2; // Increased from 0.15 to 0.2

type FishProps = {
  position: { x: number; y: number };
};

const Fish: React.FC<FishProps> = ({ position }) => {
  return (
    <Image
      source={require('../../assets/images/fish.png')}
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