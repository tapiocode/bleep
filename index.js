/**
 * Copyright (c) 2022 tapiocode
 * https://github.com/tapiocode
 * MIT License
 */

import { levenshtein } from './js-levenshtein.js';
import { alphabetGroups, alphabetMap } from './alphabetGroups.js';
import { beepChar, delayCharGap, registerBeepListener, defaultAudioParams, setAudioParams, delay } from './audio.js';

const STORAGE_KEY_APP_PARAMS = 'appParams';

let allowPlaying = true;

const lang = navigator.language;

const defaultParams = {
  exercise: {
    numberOfWords: 3,
    wordLengthBase: 4,
    wordLengthVar: 2,
  },
  playback: {
    startDelay: 500,
  },
  audio: { ...defaultAudioParams },
};

const storedAppParams = getStorage(STORAGE_KEY_APP_PARAMS);
const appParams = storedAppParams || JSON.parse(JSON.stringify(defaultParams));
if (!storedAppParams) {
  storeAppParams();
}
setAudioParams(appParams.audio);

registerBeepListener(function(newVal) {
  (newVal ? setMode : unsetMode)('is-beeping');
});

const setParam = (groupName, paramName, newVal) => {
  const val = parseInt(newVal, 10);
  setParamFormElems(paramName, val);
  appParams[groupName][paramName] = val;
  storeAppParams();
  if (groupName === 'audio') {
    setAudioParams(appParams.audio);
  }
};
document.querySelectorAll('input[type=range]').forEach(function(elem) {
  elem.addEventListener('change', function(event) {
    setParam(event.target.form.name, event.target.name, this.value);
  });
});
updateParamFormElemsAll();

{ // Determine, initialize active page
  const searchParams = new URL(globalThis.location).search;
  const selectedPage = new URLSearchParams(searchParams).get('page') || 'home';
  document.querySelectorAll(`#page-${selectedPage}, .menu a[href$='=${selectedPage}']`)
    .forEach((node) => node.classList.add('active'))
};

{ // Characters
  globalThis.singleCharPlayer.addEventListener('keyup', (event) => {
    const char = event.key;
    if (alphabetMap.has(char)) {
      transmitStr(char, true, true);
    }
    globalThis.singleCharPlayer.value = '';
  });
  alphabetGroups.forEach(function(group) {
    const chars = Object.keys(group.chars);
    chars.sort((a, b) => a < b ? -1 : (a === b ? 0 : 1));

    const buttons = document.createElement('div');
    buttons.classList.add('char-buttons');

    globalThis.characters.insertAdjacentHTML('beforeend', `<h3>${group.name}</h3>`);
    chars.forEach((char) => {
      let paramChar = getCharParam(char);
      let displayChar = getDisplayChar(char);
      buttons.insertAdjacentHTML('beforeend',
        `<button onclick="clickPlay('${paramChar}')" class="char-button">${displayChar}</button>`);
    });
    globalThis.characters.append(buttons);
  });

  function getCharParam(char) {
    switch (char) {
      case '\'': return '\\\'';
      case '"': return '&quot;';
      default: return char;
    }
  }
};

globalThis.clickPlay = function(char) {
  transmitStr(char, true, true);
}

globalThis.clickStop = function() {
  allowPlaying = false;
}

globalThis.clickTransmitString = function() {
  const input = globalThis.userInput.value.trim().toLowerCase();
  transmitStr(input, true);
}

globalThis.clickResetDefaultParams = function(groupName) {
  if (groupName in appParams) {
    appParams[groupName] = { ...defaultParams[groupName] };
  }
  updateParamFormElemsAll();
  storeAppParams();
}

globalThis.resetApp = function() {
  localStorage.clear();
  window.location.href = '?page=reset';
}

{ // Exercise
  let sent;

  globalThis.startExercise = async function() {
    if (hasMode()) {
      return;
    }
    const { wordLengthBase, wordLengthVar, numberOfWords } = appParams.exercise;
    const wordLenMin = Math.max(1, wordLengthBase - wordLengthVar);
    const wordLenMax = wordLengthBase + wordLengthVar;
    const words = numberOfWords;
    const chars = Object.keys(alphabetGroups[0].chars);
    const getRandChar = () => chars[Math.floor(Math.random() * chars.length)];
    const getRandWordLen = () => wordLenMin + Math.round(Math.random() * (wordLenMax - wordLenMin));
    const getArr = (len) => Array(len).fill('');
    const outStr = getArr(words).map(() =>
      getArr(getRandWordLen()).map(() => getRandChar()).join('')
    ).join(' ');

    console.info('Sending:', outStr);

    globalThis.exerciseCheck.style.display = 'none';
    globalThis.exerciseInput.value = '';
    globalThis.exerciseWordsInput.textContent = '';
    globalThis.exerciseWordsOutput.textContent = '';
    globalThis.exerciseResult.textContent = '';
    sent = '';
    await transmitStr(outStr);
    sent = outStr.toUpperCase();
    globalThis.exerciseCheck.style.display = 'initial';
  }

  globalThis.checkExercise = function() {
    if (hasMode() || !sent) {
      return;
    }
    const received = globalThis.exerciseInput.value.toUpperCase().trim();
    const lev = levenshtein(sent, received);
    const match = (sent.length - lev)/sent.length;
    const percentCorrect = (match * 100).toFixed(1);
    const result = `${percentCorrect}% correct, Levenshtein distance ${lev}`;
    console.info('sent    ', sent);
    console.info('received', received);
    console.info('lev', lev);
    console.info('match', match);

    globalThis.exerciseWordsOutput.textContent = `Sent:     ${sent}`;
    globalThis.exerciseWordsInput.textContent  = `Received: ${received}`;
    globalThis.exerciseResult.textContent      = `Result:   ${result}`;
  }
};

async function transmitStr(str, displayChar, skipStartDelay) {
  if (hasMode() || !str) {
    return;
  }
  const charArr = str.split('');
  const totalLength = charArr.length;
  allowPlaying = true;
  setMode('is-transmitting');
  if (!skipStartDelay) {
    setMode('is-starting');
    let i = 0;
    const tickMs = 50;
    const step = 1 / (appParams.playback.startDelay / tickMs);
    while (allowPlaying && i < 1) {
      await delay(tickMs);
      setProgress(i);
      i += step;
    }
    unsetMode('is-starting');
  }
  setProgress(1.0);
  while (allowPlaying && charArr.length > 0) {
    const char = charArr.shift();
    if (displayChar) {
      globalThis.currentChar.innerHTML = `${getDisplayChar(char)}`;
    }
    await beepChar(char);
    globalThis.currentChar.innerHTML = '';
    if (charArr.length > 0) {
      await delayCharGap();
    }
    setProgress(charArr.length/totalLength);
  }
  setProgress(0);
  unsetMode('is-transmitting');
}

function getDisplayChar(char) {
  switch (char) {
    case ' ': return '_';
    case 'ß': return char;
    default: return char.toUpperCase();
  }
}

function setMode(mode) {
  document.body.classList.add(mode);
}

function unsetMode(mode) {
  document.body.classList.remove(mode);
}

function hasMode() {
  return document.body.classList.length > 0;
}

function setProgress(newVal) {
  document.documentElement.style.setProperty('--transmitting-progress', newVal);
}

function setParamFormElems(paramName, value) {
  let displayStr;
  if (paramName === 'startDelay') {
    displayStr = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      .format(value / 1000);
  } else {
    displayStr = (value).toLocaleString(lang);
  }
  document.querySelector(`output[for=${paramName}]`).value = displayStr;
  globalThis[paramName].value = value;
}

function updateParamFormElemsAll() {
  Object.entries(appParams).forEach(([, params]) => {
    Object.entries(params).forEach(([paramName, value]) => {
      setParamFormElems(paramName, value);
    });
  });
}

function storeAppParams() {
  const storeItem = JSON.stringify(appParams);
  localStorage.setItem(STORAGE_KEY_APP_PARAMS, storeItem);
}

function getStorage(key) {
  const item = localStorage.getItem(key);
  const parsedItem = JSON.parse(item);
  return parsedItem;
}
