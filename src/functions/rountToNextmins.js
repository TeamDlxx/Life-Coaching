import moment from "moment";

export default function rountToNextmins(mins) {
  let start = moment();
  let remainder = mins - (start.minute() % mins);
  if (remainder < mins) {
    return moment(start).add(remainder, 'minutes').toDate();
  } else {
    return moment(start).toDate();
  }
}
