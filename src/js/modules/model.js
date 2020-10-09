import {
  EventEmitter, openCageUrlConstructor, getGeoFormateDate, darkSkyUrlConstructor,
  getFormateForecastDate, getFlickerUrlVariants, getRandFlickerImgLink,
  getLocStgItem, yandexUrlConstructor, cloneObjectCorrect, tempConverter,
} from '../utils';

import {
  langs, tempUnits, siteLocalization, voc, borderOfMonthName,
} from '../constants';


export default class Model extends EventEmitter {
  constructor() {
    super();
    this.lang = langs.en;
    this.geoDate = null;
    this.forecastDate = null;
    this.tempUnit = tempUnits.cel;
  }

  async _getUserCoords() {
    const geo = new Promise((res) => navigator.geolocation.getCurrentPosition(res));

    const result = geo.then((pos) => {
      const { coords: { latitude: lat, longitude: lng } } = pos;
      return {
        lat,
        lng,
      };
    });

    return result;
  }

  async _getGeoDate(cityName) {
    const coords = await this._getUserCoords();
    const requestData = cityName || coords;
    const url = openCageUrlConstructor(requestData);
    return fetch(url)
      .then((resp) => resp.json())
      .then((obj) => {
        const [dataObj] = obj.results;
        if (!dataObj) return false;
        if (typeof requestData === 'object') {
          this.geoDate = getGeoFormateDate(dataObj, coords);
        } else {
          this.geoDate = getGeoFormateDate(dataObj);
        }
        return true;
      });
  }

  async _getForecastDate(coords) {
    const url = darkSkyUrlConstructor(coords);
    return fetch(url)
      .then((resp) => resp.json())
      .then((date) => {
        this.forecastDate = getFormateForecastDate(date, this.geoDate.nextDaysIndexes);
      });
  }

  async _getBgUrl() {
    const {
      specificUrl, usualUrl, specificQuery, usualQuery,
    } = getFlickerUrlVariants(this.geoDate, this.forecastDate);

    console.log(`Sending img query: ${specificQuery.replace(/%20/g, ' ')}`);

    let result = await fetch(specificUrl)
      .then((resp) => resp.json())
      .then((resp) => resp.photos.photo);

    if (result.length === 0) {
      result = await fetch(usualUrl)
        .then((response) => response.json())
        .then((response) => response.photos.photo);
      console.log(`Sending another img query without place name: ${usualQuery.replace(/%20/g, ' ')}`);
    }

    this.arrOfBgs = result.filter((item) => item.url_h);
    this.bgUrl = getRandFlickerImgLink(this.arrOfBgs);
  }

  async _getLocalization() {
    const localization = cloneObjectCorrect(siteLocalization[this.lang]);
    let { place, country } = this.geoDate;
    const { dayIndex, nextDaysIndexes, monthIndex } = this.geoDate;
    let { current: { summary } } = this.forecastDate;
    const month = voc[this.lang].month[monthIndex];
    const day = voc[this.lang].days[dayIndex].slice(0, borderOfMonthName);
    const days = nextDaysIndexes.map((index) => voc[this.lang].days[index]);

    if (this.lang !== langs.en) {
      const query = `${place},${country},${summary.replace(/\s/g, '-')}`;
      await fetch(yandexUrlConstructor(query, this.lang))
        .then((resp) => resp.json())
        .then((resp) => {
          const { text: [translated] } = resp;
          const respStrToArr = translated.split(',');
          [place, country, summary] = respStrToArr;
          summary = summary.replace(/-/g, ' ');
        });
    }

    Object.assign(localization, {
      place, country, summary, month, day, days,
    });

    this.localization = localization;
  }

  _setRightTempValues() {
    const { current: { feelsLike, temperature }, future } = this.forecastDate;
    this.forecastDate.current.feelsLike = tempConverter(feelsLike, this.tempUnit);
    this.forecastDate.current.temperature = tempConverter(temperature, this.tempUnit);
    future.forEach((obj) => {
      const futureForecastElem = obj;
      const { temperature: temp } = futureForecastElem;
      futureForecastElem.temperature = tempConverter(temp, this.tempUnit);
    });
  }

  returnData() {
    return {
      ...{
        geoData: this.geoDate,
        forecast: this.forecastDate,
        localization: this.localization,
        bgUrl: this.bgUrl,
        tempUnits: this.tempUnit,
        lang: this.lang,
      },
    };
  }

  async getDate(cityName) {
    this.lang = getLocStgItem('lang') || this.lang;
    this.tempUnit = getLocStgItem('tempUnit') || this.tempUnit;
    let result;
    if (cityName) {
      result = await this._getGeoDate(cityName);
    } else {
      result = await this._getGeoDate();
    }

    if (!result) return false;

    await this._getForecastDate(this.geoDate.coords);
    await this._getBgUrl();
    await this._getLocalization();
    if (this.tempUnit !== tempUnits.cel) {
      await this._setRightTempValues();
    }

    return this.returnData();
  }

  async translate() {
    await this._getLocalization();
    return this.returnData();
  }

  async convertTemp() {
    await this._setRightTempValues();
    return this.returnData();
  }

  getBgUrl() {
    this.bgUrl = getRandFlickerImgLink(this.arrOfBgs);
    return this.bgUrl;
  }

  async changePlace(placeName) {
    const placeInEn = await fetch(yandexUrlConstructor(placeName, langs.en))
      .then((resp) => resp.json())
      .then((resp) => {
        const { text: [translated] } = resp;
        return translated;
      });

    const result = await this.getDate(placeInEn);
    if (!result) return false;
    return result;
  }

  getForecastText() {
    const {
      today, degrees: deg, ms, feelsLike: feels, wind, humidity: hum, summary,
    } = this.localization;
    const {
      current: {
        feelsLike, humidity, temperature, windSpeed,
      },
    } = this.forecastDate;
    return `${today} ${temperature} ${deg},${feels} ${feelsLike} ${deg}.
            ${wind} ${windSpeed} ${ms}. ${hum} ${humidity}. ${summary}`;
  }

  async init() {
    await this.getDate();
    return this.returnData();
  }
}
