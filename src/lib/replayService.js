/**
 * 训练回放服务
 * 记录和回放训练过程
 */

import { storage } from "./utils";

const REPLAY_KEY = "training_replays";
const MAX_REPLAYS = 20;

/**
 * 开始记录回放
 */
export function startReplayRecording(sessionId) {
  const replay = {
    sessionId,
    startTime: Date.now(),
    events: [],
  };
  storage.set(`replay_${sessionId}`, replay);
  return replay;
}

/**
 * 记录回放事件
 */
export function recordReplayEvent(sessionId, event) {
  const key = `replay_${sessionId}`;
  const replay = storage.get(key, null);
  if (!replay) {return;}

  replay.events.push({
    ...event,
    timestamp: Date.now(),
    relativeTime: Date.now() - replay.startTime,
  });

  storage.set(key, replay);
}

/**
 * 结束记录并保存
 */
export function stopReplayRecording(sessionId, summary) {
  const key = `replay_${sessionId}`;
  const replay = storage.get(key, null);
  if (!replay) {return null;}

  replay.endTime = Date.now();
  replay.duration = replay.endTime - replay.startTime;
  replay.summary = summary;

  // 保存到列表
  const replays = storage.get(REPLAY_KEY, []);
  replays.unshift({
    sessionId,
    startTime: replay.startTime,
    duration: replay.duration,
    summary,
  });

  if (replays.length > MAX_REPLAYS) {
    // 删除最旧的回放数据
    const toRemove = replays.splice(MAX_REPLAYS);
    for (const r of toRemove) {
      storage.remove(`replay_${r.sessionId}`);
    }
  }

  storage.set(REPLAY_KEY, replays);
  return replay;
}

/**
 * 获取回放列表
 */
export function getReplayList(limit = 20) {
  const replays = storage.get(REPLAY_KEY, []);
  return replays.slice(0, limit);
}

/**
 * 获取回放数据
 */
export function getReplayData(sessionId) {
  return storage.get(`replay_${sessionId}`, null);
}

/**
 * 删除回放
 */
export function deleteReplay(sessionId) {
  storage.remove(`replay_${sessionId}`);
  const replays = storage.get(REPLAY_KEY, []);
  const filtered = replays.filter((r) => r.sessionId !== sessionId);
  storage.set(REPLAY_KEY, filtered);
}

/**
 * 格式化回放时长
 */
export function formatReplayDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes === 0) {return `${remaining}秒`;}
  return `${minutes}分${remaining}秒`;
}

export default {
  startReplayRecording,
  recordReplayEvent,
  stopReplayRecording,
  getReplayList,
  getReplayData,
  deleteReplay,
  formatReplayDuration,
};
