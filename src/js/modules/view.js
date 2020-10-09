import { EventEmitter } from '../utils';
import {
  App, Preloader, SpeechRecognizer, SpeechSynthesis,
} from './viewModules';
import { enterKeyCode, pronControlPhrases } from '../constants';


export default class View extends EventEmitter {
  constructor() {
    super();
    this.app = null;
    this.preloader = new Preloader();
    this.speechRecognizer = new SpeechRecognizer();
    this.speechSynth = new SpeechSynthesis();
  }

  changeLang(e) {
    const lang = this.app.controls.langsMenu.getLang(e);
    if (!lang) return false;
    this.emmit('changeLang', lang);
    return true;
  }

  changeTempUnit(e) {
    const resp = this.app.controls.getTemUnits(e);
    if (!resp) return false;
    const [tempUnit, target] = resp;
    this.emmit('changeTempUnit', [tempUnit, target]);
    return true;
  }

  changeBg() {
    this.emmit('changeBg');
  }

  changePlace() {
    const place = this.app.controls.search.searchInput.value;
    if (place.length === 0) return false;

    this.emmit('changePlace', place);
    return false;
  }

  onKeyboardKeyDown(e) {
    const { keyCode } = e;
    if (keyCode === enterKeyCode) {
      e.preventDefault();
      this.changePlace();
    }
  }

  controlsRecognitionState(e) {
    const isSpeechBtn = this.app.controls.search.isSpeechBtn(e);
    if (!isSpeechBtn) return false;
    const isSpeechBtnActive = this.app.controls.search.isSpeechBtnActive(e);
    if (isSpeechBtnActive) {
      this.speechRecognizer.abort();
    } else {
      this.speechRecognizer.start();
    }

    return false;
  }

  onRecognitionResult(e) {
    const word = this.speechRecognizer.getRecognized(e);
    if (pronControlPhrases.forecast.includes(word.toLowerCase())) {
      this.speechRecognizer.abort();
      this.app.controls.search.changeSpeechBtnState();
      this.emmit('speakForecast');
      return true;
    }
    if (pronControlPhrases.louder.includes(word.toLowerCase())) {
      this.speechRecognizer.abort();
      this.app.controls.search.changeSpeechBtnState();
      this.speechSynth.louder();
      return true;
    }
    if (pronControlPhrases.quiter.includes(word.toLowerCase())) {
      this.speechRecognizer.abort();
      this.app.controls.search.changeSpeechBtnState();
      this.speechSynth.quiter();
      return true;
    }
    this.app.controls.search.changeSpeechBtnState();
    this.speechRecognizer.abort();
    this.emmit('changePlace', word);
    return true;
  }

  speakForecast() {
    this.emmit('speakForecast');
  }

  showPopUp() {
    this.app.popup.showHide();
  }

  addEventListeners() {
    this.speechRecognizer.recognizer.addEventListener('result', this.onRecognitionResult.bind(this));
    this.app.controls.langsMenu.buttons.addEventListener('click', this.changeLang.bind(this));
    this.app.controls.el.addEventListener('click', this.changeTempUnit.bind(this));
    this.app.controls.reloadBg.el.addEventListener('click', this.changeBg.bind(this));
    this.app.controls.search.searchBtn.el.addEventListener('click', this.changePlace.bind(this));
    this.app.controls.search.speechBtn.el.addEventListener('click', this.controlsRecognitionState.bind(this));
    this.app.controls.play.el.addEventListener('click', this.speakForecast.bind(this));
    this.app.controls.info.el.addEventListener('click', this.showPopUp.bind(this));
    document.body.addEventListener('keydown', this.onKeyboardKeyDown.bind(this));
  }

  init(data) {
    const { lang } = data;
    this.app = new App(data);
    document.body.append(this.app.el);
    this.addEventListeners();
    this.speechRecognizer.setLang(lang);
  }
}
