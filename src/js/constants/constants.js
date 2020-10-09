const ocDataApiKey = process.env.OPENCAGE_KEY;
const darkSkyApiKey = process.env.DARKSKY_KEY;
const flickerApiKey = process.env.FLICKER_KEY;
const yandexKey = process.env.YANDEX_TRANSLATE_KEY;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

const langs = {
  en: 'en',
  ru: 'ru',
  be: 'be',
};

const tempUnits = {
  cel: 'celsius',
  fah: 'fahrenheit',
};

const borderOfMonthName = 3;
const iconPath = 'assets/img/svg/weather-icons/';
const iconEx = '.svg';
const enterKeyCode = 13;

const langCodes = {
  en: 'en-US',
  ru: 'ru-RU',
  be: 'be-Be',
};

const pronControlPhrases = {
  forecast: ['weather', 'погода'],
  quiter: ['quiter', 'тише'],
  louder: ['louder', 'громче'],
};

export {
  ocDataApiKey, darkSkyApiKey, proxyUrl, flickerApiKey, yandexKey, langs, tempUnits,
  borderOfMonthName, iconPath, iconEx, enterKeyCode, langCodes, pronControlPhrases,
};
