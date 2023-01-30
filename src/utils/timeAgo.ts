// https://gist.github.com/pomber/6195066a9258d1fb93bb59c206345b38

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

export default function getTimeAgo(date: Date) {
  const secondsAgo = Math.round((Date.now() - Number(date)) / 1000);

  if (secondsAgo < MINUTE) {
    return `${secondsAgo} second${secondsAgo !== 1 ? "s" : ""} ago`;
  }

  let divisor;
  let unit = "";

  if (secondsAgo < HOUR) {
    [divisor, unit] = [MINUTE, "m"];
  } else if (secondsAgo < DAY) {
    [divisor, unit] = [HOUR, "h"];
  } else if (secondsAgo < WEEK) {
    [divisor, unit] = [DAY, "d"];
  } else if (secondsAgo < MONTH) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  const count = Math.floor(secondsAgo / (divisor || 60));
  return `${count}${unit} ago`;
}
