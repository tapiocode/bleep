/**
 * Copyright (c) 2022 tapiocode
 * https://github.com/tapiocode
 * MIT License
 */
import { alphabetMap } from './alphabetGroups.js';

const audioContext = new AudioContext();
let params;

export const defaultAudioParams = Object.freeze({
  unitDurationMs: 100,
  frequency: 450,
  volume: 25,
});

export async function beepChar(char) {
  const timing = getCharTiming(char);
  while (timing.length > 0) {
    const duration = timing.shift();
    await (duration < 0 ? delay(-duration) : beep(duration));
  }
}

export async function delayCharGap() {
  await delay(params.unitDurationMs * 3);
}

let isBeeping;
export function registerBeepListener(fn) {
  isBeeping = fn;
}

export function setAudioParams(newParams) {
  params = newParams;
}

export function delay(duration) {
  return new Promise((resolve) => setTimeout(() => resolve(), duration));
}

function getCharTiming(char) {
  const unit = params.unitDurationMs;
  const timing = [];
  const bits = alphabetMap.get(char)?.split('');
  if (bits?.length) {
    for (let j = 0; j < bits.length; j++) {
      if (j > 0) {
        timing.push(-unit);
      }
      timing.push(unit * (bits[j] === '.' ? 1 : 3));
    }
  } else if (char === ' ') {
    const wordGap = unit * 4;
    timing.push(-wordGap);
  } else {
    console.error(`Unknown char: ${char}`);
  }
  return timing;
}

function beep(duration) {
  return new Promise((resolve, reject) => {
    try {
      const gainNode = audioContext.createGain();
      const oscillator = audioContext.createOscillator();
      oscillator.connect(gainNode);
      oscillator.frequency.value = params.frequency;
      oscillator.type = 'square';
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = params.volume / 100;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration * 0.001);
      isBeeping(true);
      oscillator.onended = () => {
        isBeeping(false);
        resolve();
      };
    } catch(error) {
      reject(error);
    }
  });
}
