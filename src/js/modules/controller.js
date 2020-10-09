import { setLocStgItem } from '../utils';

export default class Controller {
  constructor(view, model) {
    this.model = model;
    this.view = view;

    view.on('changeLang', this.changeLang.bind(this));
    view.on('changeTempUnit', this.changeTempUnit.bind(this));
    view.on('changeBg', this.changeBg.bind(this));
    view.on('changePlace', this.changePlace.bind(this));
    view.on('speakForecast', this.speakForecast.bind(this));
  }

  async changeLang(lang) {
    setLocStgItem('lang', lang);
    this.model.lang = lang;
    this.view.speechRecognizer.setLang(lang);
    const data = await this.model.translate();
    if (!data) {
      this.view.preloader.remove();
    }

    this.view.app.controls.langsMenu.update(data);
    this.view.app.controls.search.update(data);
    this.view.app.content.forecast.geoInfo.update(data);
    this.view.app.content.forecast.forecastInfo.update(data);
    this.view.app.content.atlas.update(data);
    this.view.app.ticker.update(data);
  }

  async changeTempUnit(arr) {
    const [tempUnit, target] = arr;
    if (this.model.tempUnit === tempUnit || !arr) return false;

    this.model.tempUnit = tempUnit;
    setLocStgItem('tempUnit', tempUnit);

    const data = await this.model.convertTemp();
    this.view.app.content.forecast.forecastInfo.update(data);
    this.view.app.ticker.update(data);
    this.view.app.controls.setActiveTempBtn(target);
    return true;
  }

  changeBg() {
    this.view.preloader.add();
    const url = this.model.getBgUrl();
    this.view.app.setBackground(url);

    setTimeout(() => {
      this.view.preloader.remove();
    }, 1500);
  }

  async changePlace(placeName) {
    this.view.preloader.add();
    const data = await this.model.changePlace(placeName);
    if (!data) {
      this.view.preloader.remove();
      alert('input correct query');
      return false;
    }

    const { bgUrl } = data;
    this.view.app.setBackground(bgUrl);
    this.view.app.content.forecast.geoInfo.update(data);
    this.view.app.content.forecast.geoInfo.updateClocks(data);
    this.view.app.content.forecast.forecastInfo.update(data);
    this.view.app.content.atlas.update(data);
    this.view.app.content.atlas.updateMap(data);
    setTimeout(() => {
      this.view.preloader.remove();
    }, 1500);
    return false;
  }

  speakForecast() {
    const { lang } = this.model;
    const text = this.model.getForecastText();
    this.view.speechSynth.pronounce(lang, text);
    this.view.speechSynth.clearUtter();
  }

  async init() {
    this.view.preloader.add();
    const data = await this.model.init();
    await this.view.init(data);

    setTimeout(() => {
      this.view.preloader.remove();
    }, 1500);
  }
}
