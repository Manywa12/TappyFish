import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const OBSTACLE_WIDTH = width * 0.15;

type ObstacleProps = {
  position: { x: number; y: number };
  isTop: boolean;
};

const Obstacle: React.FC<ObstacleProps> = ({ position, isTop }) => {
  return (
    <View
      style={[
        styles.obstacle,
        {
          left: position.x,
          top: isTop ? 0 : position.y,
          height: isTop ? position.y : undefined,
          bottom: isTop ? undefined : 0,
        },
      ]}
    >
      <View style={styles.highlightLine} />
      <View style={styles.shadowLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  obstacle: {
    width: OBSTACLE_WIDTH,
    position: 'absolute',
    backgroundColor: '#1a1a2e', // Darker blue color
    borderRadius: OBSTACLE_WIDTH / 6,
    borderWidth: 2,
    borderColor: '#16213e', // Even darker blue for border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  highlightLine: {
    position: 'absolute',
    left: OBSTACLE_WIDTH / 6,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  shadowLine: {
    position: 'absolute',
    right: OBSTACLE_WIDTH / 6,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});

export default Obstacle;