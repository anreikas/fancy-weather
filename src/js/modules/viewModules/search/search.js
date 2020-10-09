import { createElementWithClass } from '../../../utils';
import { appClasses } from '../../../constants';

import { SiteBtn } from '..';

const main = 'search';

const classes = {
  main,
  input: `${main}__input`,
};

export default class Search {
  constructor(data) {
    this.init(data);
  }

  isSpeechBtn(e) {
    const { speech: speechBtnClass } = this.speechBtn.ownCls;
    const { target } = e;
    return target.classList.contains(speechBtnClass);
  }

  changeSpeechBtnState() {
    const { activeSpeech } = this.speechBtn.ownCls;
    if (this.speechBtn.el.classList.contains(activeSpeech)) {
      this.speechBtn.el.classList.remove(activeSpeech);
      return true;
    }

    this.speechBtn.el.classList.add(activeSpeech);
    return false;
  }

  isSpeechBtnActive() {
    return this.changeSpeechBtnState();
  }

  update(data) {
    const { localization: { search, searchInpPlaceholder } } = data;
    this.searchBtn.updateTextContent(search);
    this.searchInput.placeholder = searchInpPlaceholder;
  }

  init(data) {
    this.el = createElementWithClass('div', appClasses.search, classes.main);
    this.searchInput = createElementWithClass('input', appClasses.searchInput, classes.input);
    this.searchBtn = new SiteBtn('', 'search');
    this.speechBtn = new SiteBtn('', 'speech');

    this.update(data);

    this.el.append(this.searchInput, this.searchBtn.el, this.speechBtn.el);
  }
}
