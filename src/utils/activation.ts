import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';

const TRIAL_DAYS = 30;
const STORAGE_KEY = 'bakala-activation';

interface ActivationData {
  installDate: string;
  activated: boolean;
  activationCode: string;
  deviceId: string;
}

async function getDeviceId(): Promise<string> {
  if (Capacitor.isNativePlatform()) {
    try {
      const info = await Device.getId();
      return info.identifier;
    } catch {
      return 'unknown-device';
    }
  }
  return localStorage.getItem('bakala-device-id') || `web-${Date.now()}`;
}

export async function getActivationData(): Promise<ActivationData> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw);
  }
  const deviceId = await getDeviceId();
  if (!Capacitor.isNativePlatform()) {
    localStorage.setItem('bakala-device-id', deviceId);
  }
  const data: ActivationData = {
    installDate: new Date().toISOString(),
    activated: false,
    activationCode: '',
    deviceId: deviceId,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export async function isTrialExpired(): Promise<boolean> {
  const data = await getActivationData();
  if (data.activated) return false;
  const installDate = new Date(data.installDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= TRIAL_DAYS;
}

export async function getRemainingDays(): Promise<number> {
  const data = await getActivationData();
  if (data.activated) return -1;
  const installDate = new Date(data.installDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - diffDays);
}

export async function activateApp(code: string): Promise<boolean> {
  const validCodes = JSON.parse(localStorage.getItem('bakala-admin-codes') || '[]');
  if (validCodes.includes(code)) {
    const data = await getActivationData();
    const deviceId = await getDeviceId();
    data.activated = true;
    data.activationCode = code;
    data.deviceId = deviceId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // إزالة الكود من قائمة الرموز الصالحة (استخدام مرة واحدة)
    const updatedCodes = validCodes.filter((c: string) => c !== code);
    localStorage.setItem('bakala-admin-codes', JSON.stringify(updatedCodes));
    // تخزين الكود مع معرف الجهاز للسماح بإعادة التثبيت
    const usedCodes = JSON.parse(localStorage.getItem('bakala-used-codes') || '{}');
    usedCodes[code] = deviceId;
    localStorage.setItem('bakala-used-codes', JSON.stringify(usedCodes));
    return true;
  }
  // التحقق من الرموز المستخدمة مسبقاً على نفس الجهاز
  const deviceId = await getDeviceId();
  const usedCodes = JSON.parse(localStorage.getItem('bakala-used-codes') || '{}');
  if (usedCodes[code] === deviceId) {
    const data = await getActivationData();
    data.activated = true;
    data.activationCode = code;
    data.deviceId = deviceId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  }
  return false;
}

export async function isActivated(): Promise<boolean> {
  const data = await getActivationData();
  return data.activated;
}

// ========== دوال المسؤول ==========

export function generateActivationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) code += '-';
  }
  return code;
}

export function addActivationCode(code: string): void {
  const codes = JSON.parse(localStorage.getItem('bakala-admin-codes') || '[]');
  if (!codes.includes(code)) {
    codes.push(code);
    localStorage.setItem('bakala-admin-codes', JSON.stringify(codes));
  }
}

export function removeActivationCode(code: string): void {
  const codes = JSON.parse(localStorage.getItem('bakala-admin-codes') || '[]');
  const updated = codes.filter((c: string) => c !== code);
  localStorage.setItem('bakala-admin-codes', JSON.stringify(updated));
}

export function getActivationCodes(): string[] {
  return JSON.parse(localStorage.getItem('bakala-admin-codes') || '[]');
    }
