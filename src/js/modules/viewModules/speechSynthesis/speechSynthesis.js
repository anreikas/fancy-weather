/* eslint-disable prefer-destructuring */
import { langs, langCodes } from '../../../constants';

export default class SpeechSynthesis {
  constructor() {
    this.init();
    this.volumeVal = 1;
    this.step = 0.4;
    this.rate = 0.9;
  }

  louder() {
    const newVolumeVal = this.volumeVal + this.step;
    this.volumeVal = newVolumeVal;
    this.utterance.volume = this.volumeVal;
  }

  quiter() {
    const newVolumeVal = this.volumeVal - this.step;
    this.volumeVal = newVolumeVal;
    this.utterance.volume = this.volumeVal;
  }

  clearUtter() {
    this.utterance.text = null;
  }

  pronounce(lang, utter) {
    const currLang = (lang === langs.be) ? langs.ru : lang;
    const voice = this.voices.find((voiceObj) => langCodes[currLang] === voiceObj.lang);
    this.utterance.text = utter;
    this.utterance.voice = voice;
    this.utterance.lang = voice.lang;
    this.utterance.rate = this.rate;
    this.synth.speak(this.utterance);

  }

  init() {
    this.synth = window.speechSynthesis;
    setTimeout(() => {
      this.voices = this.synth.getVoices();
      this.utterance = new SpeechSynthesisUtterance();
      this.voices = this.voices.filter((voice) => Object.values(langCodes).includes(voice.lang));
    }, 500);
  }
}
