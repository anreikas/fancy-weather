import { appClasses, pronControlPhrases } from '../../../constants';
import { SiteBtn } from '..';
import { createElementWithClass } from '../../../utils';

const main = 'popup';
const classes = {
  main,
  wrapper: `${main}__wrapper`,
  list: `${main}__list`,
  btn: `${main}__btn`,
  paragraph: `${main}__paragraph`,
  inActive: `${main}--inActive`,
};

export default class Popup {
  constructor() {
    this.init();
  }


  showHide() {
    this.el.classList.toggle(classes.inActive);
  }

  addContent() {
    const { quiter, louder, forecast } = pronControlPhrases;
    const [forecastEn, forecastRu] = forecast;
    const [quiterEn, quiterRu] = quiter;
    const [louderEn, louderRu] = louder;
    this.wrapper.innerHTML = `
    <p class="${classes.paragraph}">Voice commands when app in English</p>
    <ul class="${classes.list}">
      <li>${forecastEn}</li>
      <li>${quiterEn}</li>
      <li>${louderEn}</li>
    </ul>
    <p class="${classes.paragraph}">Голосовые команды когда приложение на Беларусском или Русском</p>
    <ul class="${classes.list}">
      <li>${forecastRu}</li>
      <li>${quiterRu}</li>
      <li>${louderRu}</li>
    </ul>
    `;
  }

  init() {
    this.el = createElementWithClass('div', appClasses.popup, classes.main, classes.inActive);
    this.wrapper = createElementWithClass('div', classes.wrapper);
    this.closeBtn = new SiteBtn('', 'close');
    this.closeBtn.addClass(classes.btn);
    this.addContent();

    this.wrapper.append(this.closeBtn.el);
    this.el.append(this.wrapper);
    document.body.append(this.el);
    this.closeBtn.el.addEventListener('click', this.showHide.bind(this));
  }
}
