const prefixes = [
  "130",
  "131",
  "132",
  "133",
  "135",
  "136",
  "137",
  "138",
  "139",
  "150",
  "151",
  "152",
  "155",
  "156",
  "157",
  "158",
  "159",
  "166",
  "170",
  "171",
  "172",
  "173",
  "175",
  "176",
  "177",
  "178",
  "180",
  "181",
  "182",
  "183",
  "184",
  "185",
  "186",
  "187",
  "188",
  "189",
  "191",
  "193",
  "195",
  "196",
  "197",
  "198",
  "199",
];

function randomNumber() {
  return Math.floor(Math.random() * 10);
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateChinesePhone() {
  const prefix = randomItem(prefixes);

  let suffix = "";

  for (let i = 0; i < 8; i++) {
    suffix += randomNumber();
  }

  return prefix + suffix;
}
