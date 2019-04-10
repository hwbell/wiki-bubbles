

const fetch = require('node-fetch');
const { getCode } = require('country-list');

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

// this function converts bucket counts in string form 
// to the mid-range of the bucket in number form
// useful for the response from pageviews by country
const getMidRangeFromBucket = (bucketStr) => {
  let strings = bucketStr.split('-');
  let numbers = strings.map((str) => {
    return Number(str);
  });

  return (numbers[0] + numbers[1]) / 2;
}

const getPopulation = (country, countryData) => {

  // console.log(country);

  for (let i = 0; i < countryData.length; i++) {
    let thisCountry = countryData[i].country;
    if (thisCountry === country) {
      // console.log(countryData[i].population)
      return countryData[i].population;
    }

  }
}

module.exports = {
  getMidRangeFromBucket,
  getSearchFormatDate,
  getPopulation
}