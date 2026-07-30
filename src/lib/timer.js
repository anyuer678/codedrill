/**
 * 计时器工具
 * 提供精确计时、倒计时、限时模式
 */

export class Timer {
  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.pausedTime = 0;
    this.pauseStart = null;
    this.isRunning = false;
    this.isPaused = false;
    this.callbacks = [];
  }

  start() {
    this.startTime = performance.now();
    this.endTime = null;
    this.pausedTime = 0;
    this.isRunning = true;
    this.isPaused = false;
    return this;
  }

  pause() {
    if (this.isRunning && !this.isPaused) {
      this.pauseStart = performance.now();
      this.isPaused = true;
    }
    return this;
  }

  resume() {
    if (this.isRunning && this.isPaused) {
      this.pausedTime += performance.now() - this.pauseStart;
      this.isPaused = false;
    }
    return this;
  }

  stop() {
    if (this.isRunning) {
      this.endTime = performance.now();
      this.isRunning = false;
      if (this.isPaused) {
        this.pausedTime += performance.now() - this.pauseStart;
        this.isPaused = false;
      }
    }
    return this;
  }

  getElapsed() {
    if (!this.startTime) {return 0;}

    const end = this.endTime || (this.isPaused ? this.pauseStart : performance.now());
    return (end - this.startTime - this.pausedTime) / 1000;
  }

  getElapsedMs() {
    return this.getElapsed() * 1000;
  }

  reset() {
    this.startTime = null;
    this.endTime = null;
    this.pausedTime = 0;
    this.pauseStart = null;
    this.isRunning = false;
    this.isPaused = false;
    return this;
  }
}

/**
 * 倒计时器
 */
export class CountdownTimer {
  constructor(durationSeconds, onTick, onComplete) {
    this.duration = durationSeconds;
    this.remaining = durationSeconds;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.interval = null;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.remaining = this.duration;
    this.onTick?.(this.remaining);

    this.interval = setInterval(() => {
      this.remaining--;
      this.onTick?.(this.remaining);

      if (this.remaining <= 0) {
        this.stop();
        this.onComplete?.();
      }
    }, 1000);

    return this;
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    return this;
  }

  pause() {
    this.stop();
    return this;
  }

  resume() {
    if (!this.isRunning && this.remaining > 0) {
      this.start();
    }
    return this;
  }

  getRemaining() {
    return this.remaining;
  }

  getElapsed() {
    return this.duration - this.remaining;
  }

  reset(newDuration) {
    this.stop();
    this.duration = newDuration || this.duration;
    this.remaining = this.duration;
    return this;
  }
}

/**
 * 格式化时间（秒 -> mm:ss）
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * 格式化时间（毫秒 -> mm:ss.SSS）
 */
export function formatTimeMs(ms) {
  const totalSeconds = ms / 1000;
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  const msPart = Math.floor(ms % 1000);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${msPart.toString().padStart(3, "0")}`;
}

/**
 * 计算速度评级
 */
export function getSpeedRating(timeSpent, difficulty) {
  const baselines = {
    1: { fast: 5, normal: 15, slow: 30 },
    2: { fast: 10, normal: 25, slow: 45 },
    3: { fast: 15, normal: 35, slow: 60 },
    4: { fast: 25, normal: 50, slow: 90 },
    5: { fast: 35, normal: 70, slow: 120 },
  };

  const baseline = baselines[difficulty] || baselines[1];

  if (timeSpent <= baseline.fast) {return "S";}
  if (timeSpent <= baseline.normal) {return "A";}
  if (timeSpent <= baseline.slow) {return "B";}
  return "C";
}

export default {
  Timer,
  CountdownTimer,
  formatTime,
  formatTimeMs,
  getSpeedRating,
};
