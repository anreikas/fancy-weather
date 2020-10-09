import { createElementWithClass } from '../../../utils';

const main = 'preloader';

const classes = {
  main,
};

export default class Preloader {
  constructor() {
    this.init();
  }

  add() {
    document.body.append(this.el);
  }

  remove() {
    this.el.remove();
  }

  _createPreloader() {
    this.el = createElementWithClass('div', classes.main);
    this.container = createElementWithClass('div', 'sk-folding-cube');
    for (let i = 1; i <= 4; i += 1) {
      const child = createElementWithClass('div', 'sk-cube', `sk-cube-${i}`);
      this.container.append(child);
    }
    this.el.append(this.container);
  }

  init() {
    this._createPreloader();
  }
}
