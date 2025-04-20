import React, { useState, useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Fish from '../components/Fish';
import Coin from '../components/Coin';
import Obstacle from '../components/Obstacle';

const { width, height } = Dimensions.get('window');
const GAME_SPEED = 3;
const FISH_SIZE = width * 0.2;
const MIN_GAP = height * 0.8; // Set minimum gap to 80% of screen height for very wide, easily passable spaces
const BUFFER_ZONE = FISH_SIZE * 1.5;

type GameScreenProps = {
  onGameOver: (score: number) => void;
  coins: number; // Aangepaste prop voor de coin-teller
  setCoins: React.Dispatch<React.SetStateAction<number>>; // Functie om coins buiten dit component bij te werken
};

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, coins, setCoins }) => {
  const [score, setScore] = useState(0);
  const [gameEngine, setGameEngine] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
    setCoins(0); // Reset coins bij herstart
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

    fish.velocity.y += height * 0.0008;
    fish.position.y += fish.velocity.y;
    fish.renderer = <Fish position={fish.position} />;

    touches.filter((t: any) => t.type === 'press').forEach(() => {
      fish.velocity.y = -height * 0.012;
    });

    coin.position.x -= GAME_SPEED;
    topObstacle.position.x -= GAME_SPEED;
    bottomObstacle.position.x -= GAME_SPEED;

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
      setCoins((prev) => prev + 1);  // Update coin count
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
          <Text style={styles.coins}>Coins: {coins}</Text>
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
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  coins: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
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
  },
  tapToStartText: {
    color: '#FFF',
    fontSize: width * 0.08,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  pauseMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pauseBox: {
    backgroundColor: 'rgba(52, 73, 94, 0.95)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  pauseTitle: {
    color: '#FFF',
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  pauseButtons: {
    flexDirection: 'row',
  },
  pauseButton: {
    backgroundColor: '#3498db',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  pauseButtonText: {
    color: '#FFF',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  pauseButtonFixed: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default GameScreen;
