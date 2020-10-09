import { langCodes } from '../../../constants';

export default class Recognizer {
  constructor() {
    this.lang = 'en-US';
    this.init();
  }

  onEnd() {
    this.start();
  }

  setLang(lang) {
    this.recognizer.lang = langCodes[lang];
  }

  start() {
    this.recognizer.start();
  }

  stop() {
    this.recognizer.stop();
  }

  abort() {
    this.recognizer.removeEventListener('end', this.onEnd);
    this.recognizer.abort();
  }

  getRecognized(e) {
    const { results } = e;
    return Array.from(results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');
  }

  init() {
    // eslint-disable-next-line new-cap
    // eslint-disable-next-line no-undef
    this.recognizer = new webkitSpeechRecognition();
    this.recognizer.lang = this.lang;
    this.recognizer.addEventListener('end', this.onEnd);
  }
}
