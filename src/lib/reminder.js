/**
 * 训练提醒服务
 * 浏览器通知提醒每日训练
 */

import { storage } from "./utils";

const REMINDER_KEY = "training_reminder";

/**
 * 请求通知权限
 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  const result = await Notification.requestPermission();
  return result;
}

/**
 * 获取提醒设置
 */
export function getReminderSettings() {
  return storage.get(REMINDER_KEY, {
    enabled: false,
    time: "20:00",
    lastNotified: null,
  });
}

/**
 * 保存提醒设置
 */
export function saveReminderSettings(settings) {
  storage.set(REMINDER_KEY, settings);
}

/**
 * 切换提醒开关
 */
export function toggleReminder(enabled) {
  const settings = getReminderSettings();
  settings.enabled = enabled;
  saveReminderSettings(settings);
  return settings;
}

/**
 * 设置提醒时间
 */
export function setReminderTime(time) {
  const settings = getReminderSettings();
  settings.time = time;
  saveReminderSettings(settings);
  return settings;
}

/**
 * 检查是否需要发送提醒
 */
export function shouldNotify() {
  const settings = getReminderSettings();
  if (!settings.enabled) {return false;}

  const now = new Date();
  const [hours, minutes] = settings.time.split(":").map(Number);

  // 检查是否到了提醒时间
  if (now.getHours() !== hours || now.getMinutes() !== minutes) {
    return false;
  }

  // 检查今天是否已经提醒过
  const today = now.toISOString().split("T")[0];
  if (settings.lastNotified === today) {
    return false;
  }

  return true;
}

/**
 * 发送提醒通知
 */
export function sendNotification() {
  const settings = getReminderSettings();
  const today = new Date().toISOString().split("T")[0];

  // 更新最后通知时间
  settings.lastNotified = today;
  saveReminderSettings(settings);

  // 发送通知
  if (Notification.permission === "granted") {
    new Notification("CodeDrill 训练提醒", {
      body: "今天还没有训练哦，快来练习吧！",
      icon: "/icon.png",
      tag: "training-reminder",
    });
  }
}

/**
 * 初始化提醒系统
 */
export function initReminder() {
  const settings = getReminderSettings();
  if (!settings.enabled) {return;}

  // 每分钟检查一次
  setInterval(() => {
    if (shouldNotify()) {
      sendNotification();
    }
  }, 60000);
}

export default {
  requestNotificationPermission,
  getReminderSettings,
  saveReminderSettings,
  toggleReminder,
  setReminderTime,
  shouldNotify,
  sendNotification,
  initReminder,
};
