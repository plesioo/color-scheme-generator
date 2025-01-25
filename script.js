const colorAmount = 4;
const storedSeedColor = localStorage.getItem('seedColor')

function init() {
  document.getElementById('get-scheme-btn').addEventListener('click', renderColorScheme);
  document.getElementById('toggle-mode').addEventListener('click', toggleMode);
  setRandomColorScheme();
}

function setRandomColorScheme() {
  const seedColor =  storedSeedColor || getRandomHexColor();
  document.getElementById('seed-color').value = seedColor;
  renderColorScheme();
}

function getRandomHexColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function getColorScheme() {
  const colorMode = document.getElementById('color-mode').value;
  const selectedColor = document.getElementById('seed-color').value;
  const seedColor = storedSeedColor === selectedColor ? storedSeedColor : selectedColor;

  return fetch(`https://www.thecolorapi.com/scheme?hex=${seedColor.slice(1)}&mode=${colorMode}&count=${colorAmount}`)
    .then(response => response.json())
    .then(data => {
      const hexValues = data.colors.map(color => color.hex.value);
      hexValues.unshift(seedColor);
      return hexValues;
    });
}

function renderColorScheme() {
  getColorScheme()
    .then(hexValues => {
      const colorSchemesEl = document.getElementById('color-schemes');
      colorSchemesEl.innerHTML = '';

      hexValues.forEach(hexValue => {
        colorSchemesEl.appendChild(createColorSchemeEl(hexValue));
      });

      localStorage.setItem('seedColor', hexValues[0]);
    })
}

function createColorSchemeEl(hexValue) {
  const item = document.createElement('div');
  item.className = 'flex al-c text-m pointer color-schemes__item';

  const scheme = document.createElement('div');
  scheme.className = 'color-schemes__scheme';
  scheme.style.backgroundColor = hexValue;

  const hexEl = document.createElement('span');
  hexEl.className = 'pointer color-schemes__span';
  hexEl.innerText = hexValue;

  item.addEventListener('click', (e) => {
    const spanElement = e.currentTarget.querySelector('.color-schemes__span');
    copyToClipboard(spanElement, hexValue);
  });

  item.appendChild(scheme);
  item.appendChild(hexEl);

  return item;
}

function toggleMode() {
  document.documentElement.classList.toggle('white-mode');
  document.getElementsByClassName('fa-circle-half-stroke')[0].classList.toggle('fa-flip-horizontal');
}

function copyToClipboard(target, hexValue) {
  navigator.clipboard.writeText(hexValue);
  target.innerText = `Copied!`
  setTimeout(() => {
    target.innerText = hexValue;
  }, 650)
}

init()