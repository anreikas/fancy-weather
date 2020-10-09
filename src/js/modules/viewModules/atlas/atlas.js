import { createElementWithClass } from '../../../utils';
import { appClasses } from '../../../constants';


const main = 'atlas';

const classes = {
  main,
  map: `${main}__map`,
  text: `${main}__text`,
  coords: `${main}__coords`,
  lat: `${main}__latitude`,
  lng: `${main}__longitude`,
  minutes: `${main}__minutes`,
  degree: `${main}__degree`,
};

export default class Atlas {
  constructor(data) {
    this.init(data);
  }

  _createMap(data) {
    const { geoData: { coords: { lat, lng } } } = data;
    window.ymaps.ready(() => {
      this.yandexMap = new window.ymaps.Map('map', {
        center: [lat, lng],
        zoom: 10,
        controls: [],
      });

      const myPlacemark = new ymaps.Placemark(this.yandexMap.getCenter());
      this.yandexMap.geoObjects.add(myPlacemark);
    });
  }

  _createCoords() {
    this.coords = createElementWithClass('ul', appClasses.coords, classes.coords);
    this.lat = createElementWithClass('li', classes.lat);
    this.lng = createElementWithClass('li', classes.lng);

    this.latText = createElementWithClass('span', classes.text);
    this.latDeg = createElementWithClass('span', classes.degree);
    this.latMin = createElementWithClass('span', classes.minutes);
    this.lat.append(this.latText, this.latDeg, this.latMin);
    this.lngText = createElementWithClass('span', classes.text);
    this.lngDeg = createElementWithClass('span', classes.degree);
    this.lngMin = createElementWithClass('span', classes.minutes);
    this.lng.append(this.lngText, this.lngDeg, this.lngMin);

    this.coords.append(this.lat, this.lng);
  }

  update(data) {
    const {
      geoData:
      {
        latDeg, latMin, lngDeg, lngMin,
      },
      localization:
      {
        lat: latText, long,
      },
    } = data;

    this.latText.textContent = latText;
    this.latDeg.textContent = latDeg;
    this.latMin.textContent = latMin;
    this.lngText.textContent = long;
    this.lngDeg.textContent = lngDeg;
    this.lngMin.textContent = lngMin;
  }

  updateMap(data) {
    const { geoData: { coords: { lat, lng } } } = data;
    this.yandexMap.setCenter([lat, lng]);
    const myPlacemark = new ymaps.Placemark(this.yandexMap.getCenter());
    this.yandexMap.geoObjects.add(myPlacemark);
  }

  init(data) {
    this.el = createElementWithClass('div', appClasses.atlas, classes.main);
    this.map = createElementWithClass('div', appClasses.map, classes.map);
    this.map.setAttribute('id', 'map');
    this._createCoords();

    this.update(data);

    this.el.append(this.map, this.coords);
    this._createMap(data);
  }
}
