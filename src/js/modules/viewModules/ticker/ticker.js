import { createElementWithClass } from '../../../utils';
import { appClasses } from '../../../constants';

const main = 'ticker';

const classes = {
  main,
  wrapper: `${main}__wrapper`,
  item: `${main}__item`,
  day: `${main}__day`,
  temp: `${main}__temp`,
};

export default class Ticker {
  constructor(data) {
    this.init(data);
  }

  createItem(dayName, tempVal) {
    const item = createElementWithClass('div', classes.item);
    const day = createElementWithClass('span', classes.day);
    const temp = createElementWithClass('span', classes.temp);
    day.textContent = dayName;
    temp.textContent = tempVal;
    item.append(day, temp);

    return item;
  }

  update(data) {
    this.wrapper.innerHTML = '';
    const { forecast: { future }, localization: { days } } = data;
    days.forEach((dayName, index) => {
      const item = this.createItem(dayName, future[index].temperature);
      this.wrapper.append(item);
    });
  }

  init(data) {
    this.el = createElementWithClass('div', appClasses.ticker, main);
    this.wrapper = createElementWithClass('div', appClasses.wrapper, classes.wrapper);
    this.update(data);
    this.el.append(this.wrapper);
  }
}
