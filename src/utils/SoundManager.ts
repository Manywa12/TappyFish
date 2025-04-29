import { Audio, AVPlaybackStatus } from 'expo-av';

class SoundManager {
  private static instance: SoundManager;
  private backgroundMusic: Audio.Sound | null = null;
  private sounds: { [key: string]: Audio.Sound } = {};
  private isSoundEnabled: boolean = true;
  private isMusicEnabled: boolean = true;

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  async loadSounds() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Load background music
      this.backgroundMusic = new Audio.Sound();
      await this.backgroundMusic.loadAsync(require('../../assets/sounds/fire-inside-you-background.mp3'));
      await this.backgroundMusic.setIsLoopingAsync(true);
      await this.backgroundMusic.setVolumeAsync(0.5);

      // Load sound effects
      this.sounds.jump = new Audio.Sound();
      await this.sounds.jump.loadAsync(require('../../assets/sounds/jump-sound-14839.mp3'));
      await this.sounds.jump.setVolumeAsync(0.7);

      this.sounds.coin = new Audio.Sound();
      await this.sounds.coin.loadAsync(require('../../assets/sounds/coin-257878.mp3'));
      await this.sounds.coin.setVolumeAsync(0.7);

      this.sounds.crash = new Audio.Sound();
      await this.sounds.crash.loadAsync(require('../../assets/sounds/box-crash-106687.mp3'));
      await this.sounds.crash.setVolumeAsync(0.7);

      // Start playing background music if enabled
      if (this.isMusicEnabled) {
        await this.backgroundMusic.playAsync();
      }
    } catch (error) {
      console.log('Error initializing audio:', error);
    }
  }

  async setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
    try {
      const volume = enabled ? 0.7 : 0;
      for (const sound of Object.values(this.sounds)) {
        if (sound) {
          try {
            await sound.setVolumeAsync(volume);
          } catch (error) {
            // Ignore errors for individual sounds
          }
        }
      }
    } catch (error) {
      console.log('Error setting sound volume:', error);
    }
  }

  async setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    if (!this.backgroundMusic) return;

    try {
      if (enabled) {
        await this.backgroundMusic.setVolumeAsync(0.5);
        const status = await this.backgroundMusic.getStatusAsync();
        if ('isLoaded' in status && status.isLoaded && !status.isPlaying) {
          await this.backgroundMusic.playAsync();
        }
      } else {
        const status = await this.backgroundMusic.getStatusAsync();
        if ('isLoaded' in status && status.isLoaded) {
          await this.backgroundMusic.stopAsync();
        }
      }
    } catch (error) {
      console.log('Error controlling background music:', error);
    }
  }

  async playSound(soundName: 'jump' | 'coin' | 'crash') {
    if (!this.isSoundEnabled || !this.sounds[soundName]) {
      return;
    }

    try {
      const sound = this.sounds[soundName];
      const status = await sound.getStatusAsync();
      if ('isLoaded' in status && status.isLoaded) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
    } catch (error) {
      // Ignore errors when playing sounds
    }
  }

  async cleanup() {
    try {
      if (this.backgroundMusic) {
        try {
          const status = await this.backgroundMusic.getStatusAsync();
          if ('isLoaded' in status && status.isLoaded) {
            await this.backgroundMusic.unloadAsync();
          }
        } catch (error) {
          // Ignore errors when unloading background music
        }
      }

      for (const sound of Object.values(this.sounds)) {
        if (sound) {
          try {
            const status = await sound.getStatusAsync();
            if ('isLoaded' in status && status.isLoaded) {
              await sound.unloadAsync();
            }
          } catch (error) {
            // Ignore errors when unloading individual sounds
          }
        }
      }
    } catch (error) {
      console.log('Error cleaning up sounds:', error);
    }
  }
}

export default SoundManager;