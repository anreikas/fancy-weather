import { createElementWithClass } from '../../../utils';
import { appClasses } from '../../../constants';

const main = 'geo-info';

const classes = {
  main,
  place: `${main}__place`,
  city: `${main}__city-name`,
  adressDivider: `${main}__adress-divider`,
  country: `${main}__country`,
  day: `${main}__day`,
  date: `${main}__date`,
  number: `${main}__number`,
  month: `${main}__month`,
  hour: `${main}__hour`,
  dateDivider: `${main}__date-divider`,
  minutes: `${main}__minutes`,
  seconds: `${main}__seconds`,
};

export default class GeoInfo {
  constructor(data) {
    this.init(data);
  }

  update(data) {
    const {
      localization:
      {
        country, day, place, month,
      },
      geoData:
      {
        dayNumber,
      },
    } = data;
    this.city.textContent = place;
    this.country.textContent = country;
    this.day.textContent = day;
    this.number.textContent = dayNumber;
    this.month.textContent = month;
  }

  updateClocks(data) {
    const { geoData: { ms } } = data;
    this.hour.textContent = '';
    this.minutes.textContent = '';
    this.seconds.textContent = '';
    clearInterval(this.interval);
    this._clock(ms);
  }

  _createPlace() {
    this.place = createElementWithClass('div', appClasses.place, classes.place);

    this.city = createElementWithClass('span', classes.city);
    this.country = createElementWithClass('span', classes.country);
    this.place.append(this.city, ' , ', this.country);
  }

  _clock(ms) {
    let millseconds = ms;
    this.interval = setInterval(() => {
      const dateObj = new Date(millseconds);
      // eslint-disable-next-line no-unused-expressions
      this.hour.textContent = (dateObj.getHours() < 10) ? `0${dateObj.getHours()}` : dateObj.getHours();
      this.minutes.textContent = (dateObj.getMinutes() < 10) ? `0${dateObj.getMinutes()}` : dateObj.getMinutes();
      this.seconds.textContent = (dateObj.getSeconds() < 10) ? `0${dateObj.getSeconds()}` : dateObj.getSeconds();
      millseconds += 1000;
    }, 1000);
  }


  _createDate() {
    this.date = createElementWithClass('div', appClasses.date, classes.date);
    this.day = createElementWithClass('span', classes.day);
    this.number = createElementWithClass('span', classes.number);
    this.month = createElementWithClass('span', classes.month);
    this.hour = createElementWithClass('span', classes.hour);
    this.minutes = createElementWithClass('span', classes.minutes);
    this.seconds = createElementWithClass('span', classes.seconds);

    this.date.append(this.day, this.number, this.month, this.hour, ':', this.minutes, ':', this.seconds);
  }

  init(data) {
    this.el = createElementWithClass('div', appClasses.geoInfo, classes.main);
    this._createPlace();
    this._createDate();
    this.updateClocks(data);
    this.update(data);
    this.el.append(this.place, this.date);
  }
}
