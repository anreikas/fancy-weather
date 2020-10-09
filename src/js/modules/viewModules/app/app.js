import { createElementWithClass } from '../../../utils';
import { appClasses } from '../../../constants';
import {
  Controls, Content, Ticker, Popup,
} from '..';

export default class App {
  constructor(data) {
    this.init(data);
  }

  setBackground(url) {
    this.el.style.backgroundImage = `url(${url})`;
  }

  init(data) {
    const { bgUrl } = data;

    this.el = createElementWithClass('div', appClasses.main);
    this.wrapper = createElementWithClass('div', appClasses.wrapper);
    this.setBackground(bgUrl);

    this.controls = new Controls(data);
    this.content = new Content(data);
    this.ticker = new Ticker(data);
    this.popup = new Popup();

    this.wrapper.append(this.controls.el, this.content.el, this.ticker.el);
    this.el.append(this.wrapper);
  }
}
