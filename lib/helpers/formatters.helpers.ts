export const formatToMoney = (
  amount: string | number,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = Number(amount) < 0 ? "-" : "";

    const i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
      10
    ).toString();

    const j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(Number(amount) - Number(i))
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {}
};

export const formatToMoneyWithCurrency = (
  amount: string | number,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) => {
  let cleanAmount = amount?.toString().replace(",", "").trim();
  try {
    return `$${formatToMoney(cleanAmount, decimalCount, decimal, thousands)}`;
  } catch (e) {}
};

export const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const formatUCTtoISO = (uctDate: string) => {
  try {
    const date = new Date(uctDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dt = date.getDate();

    let mString = "";
    let dString = "";

    if (dt < 10) {
      dString = "0" + dt;
    } else {
      dString = dt.toString();
    }

    if (month < 10) {
      mString = "0" + month;
    } else {
      mString = month.toString();
    }

    const isoDate = year + "/" + mString + "/" + dString;

    return isoDate;
  } catch (error) {
    return uctDate;
  }
};

export const getTimeFromDate = (uctDate: string) => {
  try {
    const date = new Date(uctDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    let hoursString = hours.toString();
    let minutesString = minutes.toString();

    if (hours < 10) hoursString = `0${hours}`;
    if (minutes < 10) minutesString = `0${minutes}`;

    const time = hoursString + ":" + minutesString;

    return time;
  } catch (error) {
    return "__:__";
  }
};

export const formatStringTo4CharSplit = (text: string) => {
  let formattedNumber = text.match(/.{1,4}/g);

  if (formattedNumber) return formattedNumber.join(" ");
};

export const formatStringTo3CharSplit = (text: string) => {
  let formattedNumber = text.match(/.{1,3}/g);

  if (formattedNumber) return formattedNumber.join(" ");
};

export const onlyUnique = (value: any, index: number, self: any) => {
  return self.indexOf(value) === index;
};
