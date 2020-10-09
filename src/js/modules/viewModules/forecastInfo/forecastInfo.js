import { createElementWithClass, createFullElem } from '../../../utils';
import { appClasses, iconPath, iconEx } from '../../../constants';

const main = 'cur-forecast';
const classes = {
  main,
  currTemp: `${main}__temp`,
  summary: `${main}__summary`,
  weatherIcon: `${main}__weather-icon`,
  weatherType: `${main}__weather-type`,
  sensation: `${main}__sensation`,
  text: `${main}__text`,
  name: `${main}__name`,
  sensationValue: `${main}__sensation-value`,
  wind: `${main}__wind`,
  windValue: `${main}__wind-value`,
  humidity: `${main}__wind`,
  humidityValue: `${main}__humidity-value`,
};

const sub = 'fut-forecast';
const subClasses = {
  sub,
  item: `${sub}__item`,
  first: `${sub}__item--first`,
  second: `${sub}__item--second`,
  third: `${sub}__item--third`,
  day: `${sub}__day`,
  icon: `${sub}__icon`,
  temp: `${sub}__temp`,
};

export default class ForecastInfo {
  constructor(data) {
    this.itemMod = ['first', 'second', 'third'];
    this.init(data);
  }

  _createSummary() {
    this.summary = createElementWithClass('div', appClasses.currSummary, classes.summary);
    this.weatherIcon = createElementWithClass('div', appClasses.currIcon, classes.weatherIcon);
    this.weatherType = createElementWithClass('div', classes.weatherType);

    this.sensation = createElementWithClass('div', classes.sensation);
    this.sensationText = createElementWithClass('span', classes.name);
    this.sensationValue = createElementWithClass('span', classes.sensationValue);
    this.sensation.append(this.sensationText, this.sensationValue);

    this.wind = createElementWithClass('div', classes.wind);
    this.windText = createElementWithClass('span', classes.name);
    this.windValue = createElementWithClass('span', classes.windValue);
    this.windUnits = createElementWithClass('span', classes.text);
    this.wind.append(this.windText, this.windValue, this.windUnits);

    this.humidity = createElementWithClass('div', classes.humidity);
    this.humidityText = createElementWithClass('span', classes.name);
    this.humidityValue = createElementWithClass('span', classes.humidityValue);
    this.humidityUnits = createFullElem('%', 'span', classes.text);
    this.humidity.append(this.humidityText, this.humidityValue, this.humidityUnits);

    this.summary.append(
      this.weatherIcon, this.weatherType, this.sensation, this.wind, this.humidity,
    );
  }

  _createCurrentForecast() {
    this.currTemp = createElementWithClass('div', appClasses.currTemp, classes.currTemp);
    this._createSummary();
  }

  _createFutureItem() {
    this.itemMod.forEach((mod) => {
      this[`${mod}FutItem`] = createElementWithClass('li', appClasses.futItem, subClasses.item, subClasses[mod]);
      this[`${mod}Day`] = createElementWithClass('div', subClasses.day);
      this[`${mod}Temp`] = createElementWithClass('div', subClasses.temp);
      this[`${mod}Icon`] = createElementWithClass('div', subClasses.icon);
      this[`${mod}FutItem`].append(this[`${mod}Day`], this[`${mod}Temp`], this[`${mod}Icon`]);
    });
  }

  _createFutureForecast() {
    this.future = createElementWithClass('ul', appClasses.futForecast, subClasses.sub);
    this._createFutureItem();
    this.future.append(this.firstFutItem, this.secondFutItem, this.thirdFutItem);
  }

  update(data) {
    const {
      forecast:
      {
        current: {
          feelsLike, humidity, icon, temperature, windSpeed,
        }, future,
      },
    } = data;
    const {
      localization:
      {
        feelsLike: feels, humidity: hum, wind, windUnits, summary, days,
      },
    } = data;
    this.currTemp.textContent = temperature;
    this.weatherIcon.style.backgroundImage = `url(${iconPath}${icon}${iconEx})`;
    this.weatherType.textContent = summary;
    this.sensationText.textContent = feels;
    this.sensationValue.textContent = feelsLike;
    this.windText.textContent = wind;
    this.windValue.textContent = windSpeed;
    this.windUnits.textContent = windUnits;
    this.humidityText.textContent = hum;
    this.humidityValue.textContent = humidity;

    [...this.future.children].forEach((child, ind) => {
      this[`${this.itemMod[ind]}Day`].textContent = days[ind];
      this[`${this.itemMod[ind]}Temp`].textContent = future[ind].temperature;
      this[`${this.itemMod[ind]}Icon`].style.backgroundImage = `url(${iconPath}${future[ind].icon}${iconEx})`;
    });
  }

  init(data) {
    this.el = createElementWithClass('div', appClasses.currForecast, classes.main);
    this._createCurrentForecast();
    this._createFutureForecast();
    this.update(data);

    this.el.append(this.currTemp, this.summary, this.future);
  }
}
