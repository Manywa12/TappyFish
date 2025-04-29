import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Fish from '../components/Fish';
import Coin from '../components/Coin';
import Obstacle from '../components/Obstacle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SoundManager from '../utils/SoundManager';

const { width, height } = Dimensions.get('window');
const FISH_SIZE = Math.min(width * 0.15, 80); // Cap maximum fish size
// Game difficulty parameters
const DIFFICULTY_SETTINGS = {
  easy: {
    speed: 3,
    gapSize: height * 0.5, // 50% of screen height - much easier to navigate
    gravityMultiplier: 0.6, // Much lower gravity
    bufferZone: FISH_SIZE * 1.6, // Very forgiving collisions
    scoreMultiplier: 0.5, // Lower score increase
  },
  medium: {
    speed: 6,
    gapSize: height * 0.35, // 35% of screen height - moderate difficulty
    gravityMultiplier: 1, // Normal gravity
    bufferZone: FISH_SIZE * 1.2, // Standard collisions
    scoreMultiplier: 1, // Normal score increase
  },
  hard: {
    speed: 9,
    gapSize: height * 0.2, // 20% of screen height - very challenging
    gravityMultiplier: 1.4, // Much higher gravity
    bufferZone: FISH_SIZE * 0.8, // Very strict collisions
    scoreMultiplier: 2, // Double score increase
  }
};

type GameScreenProps = {
  onGameOver: (score: number) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  selectedMode?: string | null;
  selectedSkin?: string;
};

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, coins, setCoins, selectedMode, selectedSkin = 'default' }) => {
  const [score, setScore] = useState(0);
  const [gameEngine, setGameEngine] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(3);
  const [sessionCoins, setSessionCoins] = useState(0);


  // Get current difficulty settings
  const getDifficultySettings = () => {
    switch (selectedMode) {
      case 'easy':
        return DIFFICULTY_SETTINGS.easy;
      case 'medium':
        return DIFFICULTY_SETTINGS.medium;
      case 'hard':
        return DIFFICULTY_SETTINGS.hard;
      default:
        return DIFFICULTY_SETTINGS.medium;
    }
  };

  useEffect(() => {
    const difficulty = getDifficultySettings();
    setGameSpeed(difficulty.speed);
  }, [selectedMode]);

  const handlePausePress = useCallback(() => {
    setIsPaused(true);
    if (gameEngine) {
      gameEngine.stop();
    }
  }, [gameEngine]);

  const handleResumePress = useCallback(() => {
    setIsPaused(false);
    if (gameEngine) {
      gameEngine.start();
    }
  }, [gameEngine]);

  const handleRestartPress = useCallback(() => {
    setIsPaused(false);
    setIsPlaying(false);
    setScore(0);
    setSessionCoins(0);
    if (gameEngine) {
      gameEngine.stop();
      gameEngine.start();
    }
  }, [gameEngine, setCoins]);

  const generateObstaclePositions = () => {
    const difficulty = getDifficultySettings();
    const obstacleHeight = height * 0.25;
    const centerY = height / 2;
    const gapSize = difficulty.gapSize;
    return {
      top: centerY - (gapSize / 2),
      bottom: centerY + (gapSize / 2),
    };
  };

  const entities = {
    fish: {
      position: { x: width * 0.2, y: height / 10 },
      velocity: { x: 0, y: 0 },
      skinId: selectedSkin,
      renderer: <Fish position={{ x: width * 0.2, y: height / 10 }} skinId={selectedSkin} />,
    },
    coin: {
      position: { x: width, y: Math.random() * (height - FISH_SIZE * 2) + FISH_SIZE },
      renderer: <Coin position={{ x: width, y: Math.random() * (height - FISH_SIZE * 2) + FISH_SIZE }} />,
    },
    ...(() => {
      const positions = generateObstaclePositions();
      return {
        topObstacle: {
          position: { x: width, y: positions.top },
          isTop: true,
          renderer: <Obstacle position={{ x: width, y: positions.top }} isTop={true} />,
        },
        bottomObstacle: {
          position: { x: width, y: positions.bottom },
          isTop: false,
          renderer: <Obstacle position={{ x: width, y: positions.bottom }} isTop={false} />,
        },
      };
    })(),
  };
  const physics = (entities: any, { touches, time, dispatch }: any) => {
    // Handle touch to start
    touches.filter((t: any) => t.type === 'press').forEach(() => {
      if (!isPaused && !isPlaying) {
        setIsPlaying(true);
      }
    });

    // Return early if game is paused or not started yet
    if (!isPlaying || isPaused) {
      return entities;
    }
  
    let fish = entities.fish;
    let coin = entities.coin;
    let topObstacle = entities.topObstacle;
    let bottomObstacle = entities.bottomObstacle;
    const difficulty = getDifficultySettings();
  
    // Apply difficulty-based gravity
    const baseGravity = height * 0.0008;
    const gravityFactor = (1 + score * 0.02) * difficulty.gravityMultiplier;
    const gravity = baseGravity * gravityFactor;
  
    fish.velocity.y += gravity;
    fish.position.y += fish.velocity.y;
    fish.renderer = <Fish position={fish.position} skinId={fish.skinId} />;
  
    touches.filter((t: any) => t.type === 'press').forEach(() => {
      // Adjust jump strength based on difficulty
      fish.velocity.y = -height * (0.012 / difficulty.gravityMultiplier);
      SoundManager.getInstance().playSound('jump');
    });
  
    // Apply difficulty-based speed
    coin.position.x -= difficulty.speed;
    topObstacle.position.x -= difficulty.speed;
    bottomObstacle.position.x -= difficulty.speed;
  
    coin.renderer = <Coin position={coin.position} />;
    topObstacle.renderer = <Obstacle position={topObstacle.position} isTop={true} />;
    bottomObstacle.renderer = <Obstacle position={bottomObstacle.position} isTop={false} />;
  
    if (coin.position.x < -20) {
      coin.position.x = width;
      const { top, bottom } = generateObstaclePositions();
      coin.position.y = (top + (height - bottom)) / 2;
    }
  
    if (topObstacle.position.x < -20) {
      const { top, bottom } = generateObstaclePositions();
      topObstacle.position.x = width;
      topObstacle.position.y = top;
      bottomObstacle.position.x = width;
      bottomObstacle.position.y = bottom;
    }
  
    if (
      Math.abs(fish.position.x + FISH_SIZE / 2 - (coin.position.x + FISH_SIZE / 4)) < FISH_SIZE * 0.6 &&
      Math.abs(fish.position.y + FISH_SIZE / 3 - coin.position.y) < FISH_SIZE * 0.6
    ) {
      setSessionCoins((prev) => prev + 1);
      // Apply difficulty-based scoring
      setScore((prev) => prev + difficulty.scoreMultiplier);
      SoundManager.getInstance().playSound('coin');
      coin.position.x = width;
      const { top, bottom } = generateObstaclePositions();
      coin.position.y = (top + (height - bottom)) / 2;
    }
  
    const hasCollided =
      fish.position.y < difficulty.bufferZone / 2 ||
      fish.position.y > height - FISH_SIZE - difficulty.bufferZone / 2 ||
      (topObstacle.position.x < fish.position.x + FISH_SIZE * 0.8 &&
        topObstacle.position.x + 20 > fish.position.x &&
        fish.position.y < topObstacle.position.y) ||
      (bottomObstacle.position.x < fish.position.x + FISH_SIZE * 0.8 &&
        bottomObstacle.position.x + 20 > fish.position.x &&
        fish.position.y + FISH_SIZE * 0.6 > bottomObstacle.position.y);
  
    if (hasCollided) {
      SoundManager.getInstance().playSound('crash');
      dispatch({ type: "game-over" });
    }
  
    return entities;
  };
  

  const renderPauseMenu = () => (
    <View style={styles.pauseMenu}>
      <View style={styles.pauseBox}>
        <Text style={styles.pauseTitle}>PAUSED</Text>
        <View style={styles.pauseButtons}>
          <TouchableOpacity style={styles.pauseButton} onPress={handleResumePress}>
            <Text style={styles.pauseButtonText}>▶</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pauseButton} onPress={handleRestartPress}>
            <Text style={styles.pauseButtonText}>↺</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')}
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.hud}>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.coins}>Coins: {sessionCoins}</Text>

        </View>
        <GameEngine
          ref={(ref) => setGameEngine(ref)}
          style={styles.gameContainer}
          systems={[physics]}
          entities={entities}
          onEvent={(e: any) => {
            if (e.type === "game-over") {
              if (gameEngine) {
                gameEngine.stop();
              }
              const totalCoins = coins + sessionCoins;
              AsyncStorage.setItem('coins', totalCoins.toString());
              setCoins(totalCoins);
              onGameOver(score);
            }
          }}
          running={isPlaying && !isPaused}
        />
        {!isPlaying && (
          <TouchableOpacity
            style={styles.tapToStart}
            onPress={() => {
              setIsPlaying(true);
              if (gameEngine) {
                gameEngine.start();
              }
            }}
          >
            <Text style={styles.tapToStartText}>TAP TO START</Text>
          </TouchableOpacity>
        )}
        {isPaused && renderPauseMenu()}
        <TouchableOpacity
          style={[styles.pauseButton, styles.pauseButtonFixed]}
          onPress={handlePausePress}
        >
          <Text style={styles.pauseButtonText}>II</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Math.min(width * 0.03, 15),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  score: {
    color: '#F7F7F7',
    fontSize: Math.min(width * 0.045, 22),
    fontWeight: '700',
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(30, 61, 89, 0.85)',
    paddingHorizontal: Math.min(width * 0.04, 20),
    paddingVertical: Math.min(width * 0.02, 10),
    borderRadius: Math.min(width * 0.04, 20),
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  coins: {
    color: '#F7F7F7',
    fontSize: Math.min(width * 0.045, 22),
    fontWeight: '700',
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(30, 61, 89, 0.85)',
    paddingHorizontal: Math.min(width * 0.04, 20),
    paddingVertical: Math.min(width * 0.02, 10),
    borderRadius: Math.min(width * 0.04, 20),
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gameContainer: {
    flex: 1,
  },
  tapToStart: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 61, 89, 0.6)',
  },
  tapToStartText: {
    color: '#F7F7F7',
    fontSize: Math.min(width * 0.07, 36), // Cap the max size
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    paddingHorizontal: Math.min(width * 0.1, 50), // Responsive padding
    paddingVertical: Math.min(width * 0.05, 25),
    borderRadius: Math.min(width * 0.06, 30),
    borderWidth: 3,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    textAlign: 'center',
    maxWidth: width * 0.8, // Prevent text from going off screen
  },
  pauseMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    zIndex: 2,
  },
  pauseBox: {
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    padding: Math.min(width * 0.06, 30),
    borderRadius: Math.min(width * 0.05, 25),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    maxWidth: width * 0.8,
  },
  pauseTitle: {
    color: '#F7F7F7',
    fontSize: Math.min(width * 0.06, 30),
    fontWeight: '800',
    marginBottom: Math.min(width * 0.05, 25),
    textTransform: 'uppercase',
    letterSpacing: 3,
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    textAlign: 'center',
  },
  pauseButtons: {
    flexDirection: 'row',
    gap: Math.min(width * 0.04, 20),
  },
  pauseButton: {
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    padding: Math.min(width * 0.035, 18),
    margin: Math.min(width * 0.01, 5),
    borderRadius: Math.min(width * 0.04, 20),
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pauseButtonText: {
    color: '#F7F7F7',
    fontSize: Math.min(width * 0.05, 24),
    fontWeight: '700',
    textShadowColor: 'rgba(30, 61, 89, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  pauseButtonFixed: {
    position: 'absolute',
    bottom: Math.min(height * 0.03, 20),
    right: Math.min(width * 0.04, 20),
    zIndex: 1,
  },
});

export default GameScreen;
