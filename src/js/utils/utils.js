import {
  ocDataApiKey, darkSkyApiKey, proxyUrl, flickerApiKey, yandexKey,
  tempUnits,
} from '../constants';

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, listener) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(listener);
  }

  emmit(type, arg) {
    if (this.events[type]) {
      this.events[type].forEach((listener) => listener(arg));
    }
  }
}

function openCageUrlConstructor(data) {
  const urlBegin = 'https://api.opencagedata.com/geocode/v1/json?q=';
  const urlEnd = `&key=${ocDataApiKey}&language=en&pretty=1`;

  if (typeof data === 'object') {
    return `${urlBegin}${data.lat}+${data.lng}${urlEnd}`;
  }

  return `${urlBegin}${data}${urlEnd}`;
}

function _getDateObj(offsetInSec) {
  const msInSecond = 1000;
  const secInMinute = 60;
  const msInMinute = secInMinute * msInSecond;
  const offsetToMs = offsetInSec * msInSecond;
  const localDateObj = new Date();
  const currentTimeInMs = localDateObj.getTime();
  const localUtcOffsetInMs = localDateObj.getTimezoneOffset() * msInMinute;
  const ms = currentTimeInMs + offsetToMs + localUtcOffsetInMs;
  const currentDate = new Date(ms);
  return [currentDate, ms];
}

function _getTimeOfDay(currentTime) {
  const time = parseInt(currentTime, 10);
  let result;
  if (time >= 3 && time <= 11) { result = 'morning'; }
  if (time >= 11 && time <= 15) { result = 'daytime'; }
  if (time >= 15 && time <= 22) { result = 'evening'; }
  if (time <= 3 || time >= 22) { result = 'night'; }

  return result;
}

function _getTimeOfYear(index) {
  let result;
  if (index >= 3 && index <= 5) { result = 'spring'; }
  if (index >= 6 && index <= 8) { result = 'summer'; }
  if (index >= 9 && index < 11) { result = 'autumn'; }
  if (index <= 1 || index === 11) { result = 'winter'; }

  return result;
}

function _getNextTreeDayInd(curIndex) {
  const result = [];
  const lastIndOfDaysArr = 6;

  for (let i = 1; i <= 5; i += 1) {
    const current = curIndex + i;
    if (current > lastIndOfDaysArr) {
      result.push((current % lastIndOfDaysArr) - 1);
    } else {
      result.push(current);
    }
  }

  return result;
}

function detailedCoords(coords) {
  const { lat, lng } = coords;
  const latDeg = Math.trunc(lat);
  const latMin = Math.trunc((lat - latDeg) * 100);
  const lngDeg = Math.trunc(lng);
  const lngMin = Math.trunc((lng - lngDeg) * 100);

  return {
    latDeg,
    latMin,
    lngDeg,
    lngMin,
  };
}


function getGeoFormateDate(obj, userCoords) {
  const { annotations: { timezone: { offset_sec: timeZone } }, components: { country } } = obj;
  const [dateObj, ms] = _getDateObj(timeZone);
  const timeOfDay = _getTimeOfDay(dateObj.getHours());
  const timeOfYear = _getTimeOfYear(dateObj.getMonth());
  const dayIndex = dateObj.getDay();
  const dayNumber = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const coords = userCoords || obj.geometry;
  const {
    latDeg, latMin, lngDeg, lngMin,
  } = detailedCoords(coords);
  const place = obj.components.town || obj.components.city || obj.components.state;
  const nextDaysIndexes = _getNextTreeDayInd(dayIndex);

  return {
    country,
    place,
    coords,
    dateObj,
    timeOfDay,
    timeOfYear,
    monthIndex,
    dayIndex,
    nextDaysIndexes,
    dayNumber,
    ms,
    latDeg,
    latMin,
    lngDeg,
    lngMin,
  };
}

function darkSkyUrlConstructor(geoOptions) {
  const darkSkyUrlBeginning = `https://api.darksky.net/forecast/${darkSkyApiKey}/`;
  const darkSkyUrlTail = `${geoOptions.lat},${geoOptions.lng}?units=si&lang=en`;
  return `${proxyUrl}${darkSkyUrlBeginning}${darkSkyUrlTail}`;
}

function _roundVal(val) {
  return Math.round(val);
}

function toPercent(val) {
  const maxPercents = 100;
  const result = val * maxPercents;
  return +result.toFixed(0);
}

function _extractCurrentForecast(currentForecastObj) {
  const {
    apparentTemperature: feelsLike, humidity, icon, temperature, windSpeed, summary,
  } = currentForecastObj;

  return {
    feelsLike: _roundVal(feelsLike),
    temperature: _roundVal(temperature),
    windSpeed: _roundVal(windSpeed),
    humidity: toPercent(humidity),
    icon,
    summary,
  };
}

function _extractFutureForecast(index, weekForecast) {
  const { icon, apparentTemperatureMax, apparentTemperatureLow } = weekForecast[index];
  const averageTemp = (apparentTemperatureMax + apparentTemperatureLow) / 2;
  return {
    temperature: _roundVal(averageTemp),
    icon,
  };
}

function getFormateForecastDate(date, nextDaysIndexes) {
  const { currently } = date;
  const { daily: { data: weekForecast } } = date;
  const current = _extractCurrentForecast(currently);
  const future = nextDaysIndexes.map((index) => _extractFutureForecast(index, weekForecast));

  return {
    current,
    future,
  };
}


function _flickerUrlConstructor(queryStr) {
  const query = `&media=photos&extras=url_l&text=${queryStr}&extras=url_h&content_type=1&has_geo=1`;
  const urlBegin = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1?&api_key=';

  return `${urlBegin}${flickerApiKey}${query}`;
}

function getFlickerUrlVariants(geoDate, forecastDate) {
  const divider = '%20';
  const { place, timeOfDay, timeOfYear } = geoDate;
  const { current: { icon: summary } } = forecastDate;
  const specificQuery = `${place}${divider}${timeOfYear}${divider}${timeOfDay}${divider}${summary.replace(/-/g, divider)}`;
  const usualQuery = `${timeOfYear}${divider}${timeOfDay}${divider}${summary.replace(/-/g, divider)}`;
  const specificUrl = _flickerUrlConstructor(specificQuery);
  const usualUrl = _flickerUrlConstructor(usualQuery);

  return {
    specificUrl,
    usualUrl,
    specificQuery,
    usualQuery,
  };
}

function getRandFlickerImgLink(arr) {
  const propName = 'url_h';
  const max = arr.length - 1;
  const min = 0;
  const randIndex = Math.floor(Math.random() * (max - min + 1) + min);

  return arr[randIndex][propName];
}

function setLocStgItem(key, value) {
  localStorage.setItem(key, value);
}

function getLocStgItem(key) {
  return localStorage.getItem(key);
}

function yandexUrlConstructor(str, lang) {
  const beginUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=';
  const endUrl = `&text=${str}&lang=en-${lang}`;

  return `${beginUrl}${yandexKey}${endUrl}`;
}

function cloneObjectCorrect(obj) {
  const newObj = JSON.parse(JSON.stringify(obj));
  return newObj;
}


function tempConverter(value, units) {
  if (units === tempUnits.fah) {
    return _roundVal((value * (9 / 5) + 32));
  }

  if (units === tempUnits.cel) {
    return _roundVal((value - 32) / (9 / 5));
  }

  return false;
}

function createElementWithClass(tagName, ...cls) {
  const elem = document.createElement(tagName);
  if (arguments.length > 1) {
    elem.classList.add(...cls);
  } else {
    elem.classList.add(cls);
  }
  return elem;
}

function getModifiers(mod, classObj) {
  return mod.reduce((acc, item) => {
    if (classObj[item]) {
      acc.push(classObj[item]);
    }

    return acc;
  }, []);
}

function createFullElem(content, tagName, ...cls) {
  const elem = createElementWithClass(tagName, ...cls);
  elem.append(content);
  return elem;
}

export {
  EventEmitter, openCageUrlConstructor, getGeoFormateDate, darkSkyUrlConstructor,
  getFormateForecastDate, getFlickerUrlVariants, getRandFlickerImgLink, setLocStgItem,
  getLocStgItem, yandexUrlConstructor, cloneObjectCorrect, tempConverter, createElementWithClass,
  getModifiers, createFullElem, _getTimeOfYear, _getTimeOfDay, _getNextTreeDayInd, toPercent,
};
