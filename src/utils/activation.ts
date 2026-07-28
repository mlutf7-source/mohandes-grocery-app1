import { Device } from '@capacitor/device';

const TRIAL_DAYS = 30;
const STORAGE_KEY = 'bakala-activation';

interface ActivationData {
  installDate: string;
  activated: boolean;
  activationCode: string;
}

export async function getDeviceId(): Promise<string> {
  try {
    const info = await Device.getId();
    return info.identifier;
  } catch {
    return 'web-browser';
  }
}

export async function getActivationData(): Promise<ActivationData> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw);
  }
  const data: ActivationData = {
    installDate: new Date().toISOString(),
    activated: false,
    activationCode: '',
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
    data.activated = true;
    data.activationCode = code;
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
