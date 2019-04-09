var country = require('countryjs');

// let query = {
//         name: 'String', //country name
//         capital: 'String',
//         currency: 'String',
//         region: 'String',
//         language: 'String',
//         ISO: 'String' //country ISO 3166-1 alpha-3 or alpha-2 code
// }
// countries(query); //to fetch all fields
// //or
// countries(query, 'provinces'); //or to get only 'provinces'

console.log(country.population('US')); // Defaults to ISO2


module.exports = {
  country
}