/**
 * Copyright (c) 2022 tapiocode
 * https://github.com/tapiocode
 * MIT License
 */

export const alphabetGroups = Object.freeze([
  {
    name: 'Latin letters',
    chars: {
      'a': '.-',
      'b': '-...',
      'c': '-.-.',
      'd': '-..',
      'e': '.',
      'f': '..-.',
      'g': '--.',
      'h': '....',
      'i': '..',
      'j': '.---',
      'k': '-.-',
      'l': '.-..',
      'm': '--',
      'n': '-.',
      'o': '---',
      'p': '.--.',
      'q': '--.-',
      'r': '.-.',
      's': '...',
      't': '-',
      'u': '..-',
      'v': '...-',
      'w': '.--',
      'x': '-..-',
      'y': '-.--',
      'z': '--..',
    }
  },
  {
    name: 'Punctuation',
    chars: {
      '/': '-..-.',
      '+': '.-.-.',
      '=': '-...-',
      '?': '..--..',
      '.': '.-.-.-',
      ',': '--..--',
      ':': '---...',
      '(': '-.--.',
      ')': '-.--.-',
      '@': '.--.-.',
      '-': '-....-',
      '"': '.-..-.',
      '!': '..--.',
      '$': '...-..-',
      '\'': '.----.',
      '`': '.-----.',
      '&': '. ...',
      '-': '-....-',
      ';': '-.-.-.',
    }
  },
  {
    name: 'Numbers',
    chars: {
      '1': '.----',
      '2': '..---',
      '3': '...--',
      '4': '....-',
      '5': '.....',
      '6': '-....',
      '7': '--...',
      '8': '---..',
      '9': '----.',
      '0': '-----',
    }
  },
  {
    name: 'Non-latin letters',
    chars: {
      'ä': '.-.-',
      'ß': '...--..',
      'à': '.--.-',
      'á': '.--.-',
      'â': '.-',
      'ã': '.-',
      'å': '.--.-',
      'æ': '.-.-',
      'ç': '-.-..',
      'è': '..-..',
      'é': '..-..',
      'ê': '.',
      'ë': '.',
      'ì': '.---.',
      'í': '..',
      'î': '..',
      'ï': '..',
      'ð': '..--.',
      'ñ': '--.--',
      'ò': '---',
      'ó': '---',
      'ô': '---',
      'õ': '---',
      'ö': '---.',
      'ø': '---.',
      'ù': '..-',
      'ú': '..-',
      'û': '..-',
      'ü': '..--',
      'ý': '-.--',
      'þ': '.--..',
      'ÿ': '-.--',
      'ā': '.-',
      'ă': '.-',
      'ą': '.-',
      'ć': '-.-.',
      'ĉ': '-.-..',
      'ċ': '-.-.',
      'č': '-.-.',
      'ď': '-..',
      'đ': '-..',
      'ē': '.',
      'ĕ': '.',
      'ė': '.',
      'ę': '.',
      'ě': '.',
      'ĝ': '--.-.',
      'ğ': '--.',
      'ġ': '--.',
      'ģ': '--.',
      'ĥ': '----',
      'ħ': '....',
      'ĩ': '..',
      'ī': '..',
      'ĭ': '..',
      'į': '..',
      'ı': '..',
      'ĳ': '.. .---',
      'ĵ': '.---.',
      'ķ': '-.-',
      'ĸ': '-.-',
      'ĺ': '.-..',
      'ļ': '.-..',
      'ľ': '.-..',
      'ŀ': '.-..',
      'ł': '.-..',
      'ń': '-.',
      'ņ': '-.',
      'ň': '-.',
      'ŉ': '-.',
      'ŋ': '-.',
      'ō': '---',
      'ŏ': '---',
      'ő': '---',
      'œ': '---.',
      'ŕ': '.-.',
      'ŗ': '.-.',
      'ř': '.-.',
      'ś': '...',
      'ŝ': '...-.',
      'ş': '...',
      'š': '...',
      'ţ': '-',
      'ť': '-',
      'ŧ': '-',
      'ũ': '..-',
      'ū': '..-',
      'ŭ': '..--',
      'ů': '..-',
      'ű': '..-',
      'ų': '..-',
      'ŵ': '.--',
      'ŷ': '-.--',
      'Ÿ': '-.--',
      'ź': '--..',
      'ż': '--..',
      'ž': '--..',
      'ſ': '...',
    }
  },
]);

export const alphabetMap = new Map();
alphabetGroups.forEach(function(group) {
  Object.entries(group.chars).forEach(function([char, sequence]) {
    alphabetMap.set(char, sequence);
  });
});