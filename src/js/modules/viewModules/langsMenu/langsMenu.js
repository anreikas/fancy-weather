import { createElementWithClass } from '../../../utils';
import { appClasses, langs } from '../../../constants';
import { SiteBtn } from '..';

const main = 'langs';

const classes = {
  main,
  currLang: `${main}__current-lang`,
  buttons: `${main}__buttons`,
  btn: `${main}__btn`,
};

export default class LangsMenu {
  constructor(data) {
    this.init(data);
  }

  getLang(e) {
    const { target } = e;
    const isLangButton = target.classList.contains(classes.btn);
    if (!isLangButton) return false;
    e.preventDefault();

    return target.getAttribute('data-lang');
  }

  _createBtn(lang) {
    this[lang] = new SiteBtn(lang, lang);
    this[lang].setAttr('data-lang', lang);
    this[lang].addClass(classes.btn);
  }

  _createButtons() {
    Object.values(langs).forEach(this._createBtn.bind(this));
    this.buttons.append(this.en.el, this.ru.el, this.be.el);
  }

  update(data) {
    const { lang } = data;
    this.currLang.textContent = lang;
  }

  init(data) {
    this.el = createElementWithClass('div', appClasses.langs, classes.main);
    this.currLang = createElementWithClass('div', appClasses.currLang, classes.currLang);
    this.buttons = createElementWithClass('div', appClasses.langsBtns, classes.buttons);
    this._createButtons();
    this.update(data);
    this.el.append(this.currLang, this.buttons);
  }
}
