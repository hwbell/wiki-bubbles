

// getSearchFormatDate(dateObj) takes a javascript Date obj and returns it in the wikipages 
// format - i.e. '2015100100' being 0ct 01, 2015, 0hrs
const getSearchFormatDate = (dateObj) => {

  // have to correct the month by 1 since it is 0-indexed
  let monthNum = dateObj.getMonth() + 1;
  let month = monthNum < 10 ? '0' + monthNum.toString() : monthNum.toString();

  let date = dateObj.getDate();
  let day = date < 10 ? '0' + date.toString() : date.toString();

  let year = dateObj.getFullYear().toString();

  return `${year}${month}${day}00`
}

module.exports = {
  getSearchFormatDate
}