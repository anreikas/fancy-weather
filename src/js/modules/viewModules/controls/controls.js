import { createElementWithClass } from '../../../utils';
import { appClasses, tempUnits } from '../../../constants';

import { SiteBtn, LangsMenu, Search } from '..';

export default class Controls {
  constructor(data) {
    this.init(data);
  }

  getTemUnits(e) {
    const { target } = e;
    const isLangButton = target.classList.contains(appClasses.btn.temp);
    if (!isLangButton) return false;
    e.preventDefault();

    const tempUnit = target.getAttribute('data-temp');

    return [tempUnit, target];
  }

  setActiveTempBtn(newActive) {
    const activeCls = this.fahrenheit.ownCls.activeTemp;
    const activeBtn = this.el.querySelector(`.${activeCls}`);
    activeBtn.classList.remove(activeCls);
    newActive.classList.add(activeCls);
  }


  _createButtons(units) {
    this.reloadBg = new SiteBtn('', 'reloadBg');
    this.celsius = new SiteBtn('C', 'temp', tempUnits.cel);
    this.fahrenheit = new SiteBtn('F', 'temp', tempUnits.fah);
    this.play = new SiteBtn('', 'play');
    this.info = new SiteBtn('', 'info');
    this.celsius.setAttr('data-temp', 'celsius');
    this.fahrenheit.setAttr('data-temp', 'fahrenheit');

    if (units === tempUnits.fah) {
      this.fahrenheit.addClass(this.fahrenheit.ownCls.activeTemp);
    }

    if (units === tempUnits.cel) {
      this.celsius.addClass(this.celsius.ownCls.activeTemp);
    }
  }

  init(data) {
    const { tempUnits: units } = data;
    this.el = createElementWithClass('div', appClasses.controls);
    this._createButtons(units);
    this.langsMenu = new LangsMenu(data);
    this.search = new Search(data);

    this.el.append(
      this.reloadBg.el, this.langsMenu.el, this.fahrenheit.el,
      this.celsius.el, this.info.el, this.play.el, this.search.el,
    );
  }
}
