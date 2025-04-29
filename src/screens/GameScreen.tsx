import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Fish from '../components/Fish';
import Coin from '../components/Coin';
import Obstacle from '../components/Obstacle';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const FISH_SIZE = width * 0.2;
const MIN_GAP = height * 0.8;
const BUFFER_ZONE = FISH_SIZE * 1.5;

type GameScreenProps = {
  onGameOver: (score: number) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  selectedMode?: string | null;
};

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, coins, setCoins, selectedMode }) => {
  const [score, setScore] = useState(0);
  const [gameEngine, setGameEngine] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(3);
  const [sessionCoins, setSessionCoins] = useState(0);


  useEffect(() => {
    switch (selectedMode) {
      case 'easy':
        setGameSpeed(2);
        break;
      case 'medium':
        setGameSpeed(6);
        break;
      case 'hard':
        setGameSpeed(12);
        break;
      default:
        setGameSpeed(3);
    }
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
    const obstacleHeight = height * 0.25;
    const centerY = height / 2;
    const gapSize = height * 0.4;
    return {
      top: centerY - (gapSize / 2),
      bottom: centerY + (gapSize / 2),
    };
  };

  const entities = {
    fish: {
      position: { x: width * 0.2, y: height / 10 },
      velocity: { x: 0, y: 0 },
      renderer: <Fish position={{ x: width * 0.2, y: height / 10 }} />,
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
    if (!isPlaying || isPaused) {
      touches.filter((t: any) => t.type === 'press').forEach(() => {
        if (!isPaused) setIsPlaying(true);
      });
      return entities;
    }
  
    let fish = entities.fish;
    let coin = entities.coin;
    let topObstacle = entities.topObstacle;
    let bottomObstacle = entities.bottomObstacle;
  
    // Dynamische zwaartekracht op basis van score
    const baseGravity = height * 0.0008;
    const gravityFactor = 1 + score * 0.03; // elke punt verhoogt zwaartekracht met 3%
    const gravity = baseGravity * gravityFactor;
  
    fish.velocity.y += gravity;
    fish.position.y += fish.velocity.y;
    fish.renderer = <Fish position={fish.position} />;
  
    touches.filter((t: any) => t.type === 'press').forEach(() => {
      fish.velocity.y = -height * 0.012;
    });
  
    coin.position.x -= gameSpeed;
    topObstacle.position.x -= gameSpeed;
    bottomObstacle.position.x -= gameSpeed;
  
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
      setScore((prev) => prev + 1);
      coin.position.x = width;
      const { top, bottom } = generateObstaclePositions();
      coin.position.y = (top + (height - bottom)) / 2;
    }
  
    const hasCollided =
      fish.position.y < BUFFER_ZONE / 2 ||
      fish.position.y > height - FISH_SIZE - BUFFER_ZONE / 2 ||
      (topObstacle.position.x < fish.position.x + FISH_SIZE * 0.8 &&
        topObstacle.position.x + 20 > fish.position.x &&
        fish.position.y < topObstacle.position.y) ||
      (bottomObstacle.position.x < fish.position.x + FISH_SIZE * 0.8 &&
        bottomObstacle.position.x + 20 > fish.position.x &&
        fish.position.y + FISH_SIZE * 0.6 > bottomObstacle.position.y);
  
    if (hasCollided) {
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
          running={!isPaused}
        />
        {!isPlaying && (
          <View style={styles.tapToStart}>
            <Text style={styles.tapToStartText}>TAP TO START</Text>
          </View>
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
    padding: 10,
  },
  score: {
    color: '#F7F7F7',
    fontSize: 28,
    fontWeight: '700',
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(30, 61, 89, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
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
    fontSize: 28,
    fontWeight: '700',
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(30, 61, 89, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
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
    backgroundColor: 'rgba(30, 61, 89, 0.4)',
  },
  tapToStartText: {
    color: '#F7F7F7',
    fontSize: width * 0.08,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    backgroundColor: 'rgba(30, 61, 89, 0.9)',
    paddingHorizontal: 35,
    paddingVertical: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
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
  },
  pauseBox: {
    backgroundColor: 'rgba(30, 61, 89, 0.95)',
    padding: 35,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5B971',
    shadowColor: '#17B794',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  pauseTitle: {
    color: '#F7F7F7',
    fontSize: width * 0.09,
    fontWeight: '800',
    marginBottom: 25,
    textTransform: 'uppercase',
    letterSpacing: 3,
    textShadowColor: '#FF6E40',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  pauseButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  pauseButton: {
    backgroundColor: 'rgba(255, 110, 64, 0.9)',
    padding: 18,
    margin: 5,
    borderRadius: 20,
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
    fontSize: width * 0.07,
    fontWeight: '700',
    textShadowColor: 'rgba(30, 61, 89, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  pauseButtonFixed: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default GameScreen;
