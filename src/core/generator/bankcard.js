const prefixes = [
  "621700",
  "621661",
  "621226",
  "621284",
  "621558",
  "622202",
  "622848",
  "622700",
  "623058",
];

function randomNumber() {
  return Math.floor(Math.random() * 10);
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 计算 Luhn 校验码
 *
 * @param {String} number 前面的数字
 * @returns {Number} 校验码
 */
function generateCheckDigit(number) {
  let sum = 0;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = Number(number.charAt(i));

    const position = number.length - 1 - i;

    if (position % 2 === 0) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  return (10 - (sum % 10)) % 10;
}

/**
 * 生成银行卡号
 *
 * @param {Number} length 卡号长度
 * @returns {String}
 */
export function generateBankCard(length) {
  length = Number(length);

  // 银行卡号限制在 16～19 位
  if (length < 16) {
    length = 16;
  }

  if (length > 19) {
    length = 19;
  }

  const prefix = randomItem(prefixes);

  // 先生成前 length - 1 位
  let number = prefix;

  while (number.length < length - 1) {
    number += randomNumber();
  }

  // 最后一位生成 Luhn 校验码
  const checkDigit = generateCheckDigit(number);

  return number + checkDigit;
}

/**
 * 验证银行卡号
 *
 * @param {String} cardNumber
 * @returns {Boolean}
 */
export function validateBankCard(cardNumber) {
  if (typeof cardNumber !== "string") {
    return false;
  }

  // 只允许16～19位数字
  if (!/^\d{16,19}$/.test(cardNumber)) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = Number(cardNumber.charAt(i));

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;

    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
