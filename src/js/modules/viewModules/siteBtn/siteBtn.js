import { createElementWithClass, getModifiers } from '../../../utils';
import { appClasses } from '../../../constants';

const main = 'site-btn';

const classes = {
  main,
  reloadBg: `${main}--reloadBg`,
  fahrenheit: `${main}--fahrenheit`,
  celsius: `${main}--celsius`,
  speech: `${main}--speech`,
  activeSpeech: `${main}--activeSpeech`,
  search: `${main}--search`,
  temp: `${main}--temp`,
  activeTemp: `${main}--activeTemp`,
  play: `${main}--play`,
  en: `${main}--en`,
  ru: `${main}--ru`,
  be: `${main}--be`,
  info: `${main}--info`,
  close: `${main}--close`,
};

export default class SiteBtn {
  constructor(text, ...mod) {
    this.ownCls = classes;
    this.mod = mod;
    this.cls = appClasses.btn;
    this.parentModifieres = null;
    this.ownModifieres = null;
    this.init(text);
  }

  updateTextContent(text) {
    this.el.textContent = text;
  }

  setAttr(attr, value) {
    this.el.setAttribute(attr, value);
  }

  setType(type) {
    this.el.type = type;
  }

  addClass(cls) {
    this.el.classList.add(cls);
  }

  addListener(type, cb) {
    this.el.addEventListener(type, cb);
  }

  removeListener(type, cb) {
    this.el.removeEventListener(type, cb);
  }

  _setModifieres() {
    const parentMod = getModifiers(this.mod, this.cls);
    const ownMod = getModifiers(this.mod, this.ownCls);
    this.parentModifieres = (parentMod.length > 0) ? parentMod : '';
    this.ownModifieres = (ownMod.length > 0) ? ownMod : '';
  }

  init(text) {
    this._setModifieres();
    this.el = createElementWithClass(
      'button', this.cls.btn, ...this.parentModifieres, this.ownCls.main, ...this.ownModifieres,
    );
    this.el.textContent = text;
  }
}
