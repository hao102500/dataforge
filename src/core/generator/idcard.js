/**
 * 生成随机身份证号码
 * 18位身份证：
 * 6位地址码 + 8位出生日期 + 3位顺序码 + 1位校验码
 */
const areaCodes = [
  "110101",
  "110102",
  "110105",
  "120101",
  "310101",
  "320102",
  "330102",
  "410102",
  "420102",
  "430102",
  "440104",
  "500101",
  "510104",
  "610102",
  "610103",
  "610104",
  "610111",
  "610113",
  "610115",
];

const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];

const checkCodes = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad(value, length) {
  return String(value).padStart(length, "0");
}

/**
 * 生成出生日期
 */
function generateBirthday() {
  const year = randomInt(1970, 2005);
  const month = randomInt(1, 12);

  const maxDay = new Date(year, month, 0).getDate();

  const day = randomInt(1, maxDay);

  return year + pad(month, 2) + pad(day, 2);
}

/**
 * 根据前17位计算身份证校验码
 */
function generateCheckCode(id17) {
  let sum = 0;

  for (let i = 0; i < 17; i++) {
    sum += Number(id17.charAt(i)) * weights[i];
  }

  return checkCodes[sum % 11];
}

/**
 * 生成身份证
 */
export function generateIdCard() {
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];

  const birthday = generateBirthday();

  // 顺序码
  const sequence = pad(randomInt(1, 999), 3);

  const id17 = areaCode + birthday + sequence;

  const checkCode = generateCheckCode(id17);

  return id17 + checkCode;
}

export function validateIdCard(idCard) {
  if (typeof idCard !== "string" || !/^\d{17}[\dXx]$/.test(idCard)) {
    return false;
  }

  const id = idCard.toUpperCase();

  let sum = 0;

  for (let i = 0; i < 17; i++) {
    sum += Number(id.charAt(i)) * weights[i];
  }

  const checkCode = checkCodes[sum % 11];

  return checkCode === id.charAt(17);
}
