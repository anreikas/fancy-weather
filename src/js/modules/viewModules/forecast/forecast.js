import { createElementWithClass } from '../../../utils';
import { appClasses } from '../../../constants';
import { GeoInfo, ForecastInfo } from '..';

export default class Forecast {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    this.el = createElementWithClass('div', appClasses.forecast);
    this.wrapper = createElementWithClass('div', appClasses.currInfo);
    this.geoInfo = new GeoInfo(data);
    this.forecastInfo = new ForecastInfo(data);

    this.wrapper.append(this.geoInfo.el, this.forecastInfo.el);
    this.el.append(this.wrapper);
  }
}
