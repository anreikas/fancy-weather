import { createElementWithClass } from '../../../utils';
import { appClasses } from '../../../constants';
import { Forecast, Atlas } from '..';

export default class Content {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    this.el = createElementWithClass('div', appClasses.content);
    this.forecast = new Forecast(data);
    this.atlas = new Atlas(data);

    this.el.append(this.forecast.el, this.atlas.el);
  }
}
