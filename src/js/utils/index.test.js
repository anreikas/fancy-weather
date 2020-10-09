import {
  createElementWithClass, getModifiers, openCageUrlConstructor, _getTimeOfYear,
  _getTimeOfDay, tempConverter, createFullElem, _getNextTreeDayInd, toPercent,
  darkSkyUrlConstructor,
} from '.';
import {
  ocDataApiKey, tempUnits, darkSkyApiKey, proxyUrl,
} from '../constants';


describe('Check openCage Url Constructor', () => {
  const coords = {
    lat: 54.5,
    lng: 27.3,
  };
  const etholoneLink = `https://api.opencagedata.com/geocode/v1/json?q=54.5+27.3&key=${ocDataApiKey}&language=en&pretty=1`;

  it('should be defined', () => {
    expect(openCageUrlConstructor(coords)).toBeDefined();
  });

  it('should return string', () => {
    expect(typeof openCageUrlConstructor(coords)).toBe('string');
  });

  it('should equal to etholoneLink', () => {
    expect(openCageUrlConstructor(coords)).toBe(etholoneLink);
  });
});

describe('Create Element With class or classes function', () => {
  let elem;
  const tagName = 'div';
  const firstClass = 'container';
  const secondClass = 'container--fluid';

  beforeEach(() => {
    elem = createElementWithClass(tagName, firstClass, secondClass);
  });

  it('should be instance of HTMLDivElement', () => {
    expect(elem).toBeInstanceOf(HTMLDivElement);
  });

  it('should be contain first css class', () => {
    expect(elem.classList.contains(firstClass)).toBe(true);
  });

  it('should be contain second css class', () => {
    expect(elem.classList.contains(secondClass)).toBe(true);
  });
});

describe('Get elements bem modifiers', () => {
  const classes = {
    main: 'site-btn',
    clear: 'site-btn--clear',
    search: 'site-btn--search',
    keyboard: 'site-btn--keyboard',
  };
  const expected = ['site-btn--clear', 'site-btn--clear'];
  const modifiersArr = ['search', 'clear'];
  let result;

  beforeEach(() => {
    result = getModifiers(modifiersArr, classes);
  });


  it('should return instance of array', () => {
    expect(result).toBeInstanceOf(Array);
  });

  it('should contain all classes with passed modifiers', () => {
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});

describe('Get right time of year', () => {
  it('should be defined', () => {
    expect(_getTimeOfYear(3)).toBeDefined();
  });

  it('should return string', () => {
    expect(typeof _getTimeOfYear(3)).toBe('string');
  });


  it('should equal to spring', () => {
    expect(_getTimeOfYear(4)).toBe('spring');
  });
  it('should equal to summer', () => {
    expect(_getTimeOfYear(7)).toBe('summer');
  });
  it('should equal to winter', () => {
    expect(_getTimeOfYear(0)).toBe('winter');
  });
  it('should equal to autumn', () => {
    expect(_getTimeOfYear(10)).toBe('autumn');
  });
});

describe('Get right time of day', () => {
  it('should be defined', () => {
    expect(_getTimeOfDay(8)).toBeDefined();
  });

  it('should return string', () => {
    expect(typeof _getTimeOfDay(3)).toBe('string');
  });

  it('should equal to morning', () => {
    expect(_getTimeOfDay(10)).toBe('morning');
  });
  it('should equal to daytime', () => {
    expect(_getTimeOfDay(12)).toBe('daytime');
  });
  it('should equal to evening', () => {
    expect(_getTimeOfDay(17)).toBe('evening');
  });
  it('should equal to night', () => {
    expect(_getTimeOfDay(23)).toBe('night');
  });
});

describe('Get right temp units', () => {
  it('should be defined', () => {
    expect(tempConverter(12, tempUnits.fah)).toBeDefined();
  });

  it('should return number', () => {
    expect(typeof tempConverter(12, tempUnits.fah)).toBe('number');
  });

  it('10 degrees of celsius should equal to 50 degrees of fahrenheit', () => {
    expect(tempConverter(10, tempUnits.fah)).toBe(50);
  });

  it('50 degrees of fahrenheit  should equal to 10 degrees of celsius ', () => {
    expect(tempConverter(10, tempUnits.fah)).toBe(50);
  });
});

describe('Create Element With class or classes and content', () => {
  let elem;
  const tagName = 'span';
  const firstClass = 'text';
  const secondClass = 'text--green';
  const cont = 'Hello';

  beforeEach(() => {
    elem = createFullElem(cont, tagName, firstClass, secondClass);
  });

  it('should be instance of HTMLSpanElement', () => {
    expect(elem).toBeInstanceOf(HTMLSpanElement);
  });

  it('should be contain first css class', () => {
    expect(elem.classList.contains(firstClass)).toBe(true);
  });

  it('should be contain second css class', () => {
    expect(elem.classList.contains(secondClass)).toBe(true);
  });

  it('should be contain content', () => {
    expect(elem.textContent).toBe(cont);
  });
});

describe('Get next three days array', () => {
  const nextDays = _getNextTreeDayInd(0);
  it('should be defined', () => {
    expect(_getNextTreeDayInd(0)).toBeDefined();
  });

  it('should return object', () => {
    expect(typeof _getNextTreeDayInd(0)).toBe('object');
  });

  it('first elem should be equal to 1', () => {
    expect(nextDays[0]).toBe(1);
  });
});

describe('convert fractions to percents  ', () => {
  it('should be defined', () => {
    expect(toPercent(0.40)).toBeDefined();
  });

  it('should return number', () => {
    expect(typeof toPercent(0.1)).toBe('number');
  });

  it('should return 50', () => {
    expect(toPercent(0.4)).toBe(40);
  });
});

describe('Check openCage Url Constructor', () => {
  const coords = {
    lat: 54.5,
    lng: 27.3,
  };
  const etholoneLink = `${proxyUrl}https://api.darksky.net/forecast/${darkSkyApiKey}/54.5,27.3?units=si&lang=en`;

  it('should be defined', () => {
    expect(darkSkyUrlConstructor(coords)).toBeDefined();
  });

  it('should return string', () => {
    expect(typeof darkSkyUrlConstructor(coords)).toBe('string');
  });

  it('should equal to etholoneLink', () => {
    expect(darkSkyUrlConstructor(coords)).toBe(etholoneLink);
  });
});
