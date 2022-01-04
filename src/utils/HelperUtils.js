/**
@class
* */
class HelperUtils {
  static DEFAULT_FILTERS = {
    page: 1,
    limit: 10,
    startDate: new Date(1920, 0, 1, 24).toISOString(),
    endDate: new Date().toISOString(),
    order: ['createdAt:DESC'], // Sort by latest
  };

  /**
   * @param {Object} query
   * @returns Object
   */
  static mapAsFilter(query) {
    const userFilters = query;
    this.DEFAULT_FILTERS.endDate = new Date().toISOString();
    
    Object.keys(userFilters).forEach((param) => {
      if (userFilters[param].includes(',')) {
        userFilters[param] = userFilters[param]
          .split(',')
          .map((eachValue) => eachValue.trim())
          .filter(value => value !== '');
      }
      else if (param === 'startDate' || param === 'endDate') {
        const [date, month, year] = userFilters[param].split('/');
        // console.log(date, month - 1, year);
        userFilters[param] = new Date(year, month - 1, date, 24).toISOString();
      }
      else if (userFilters[param].match(/\d+/g) && param !== 'search'){
        userFilters[param] = parseInt(userFilters[param], 10);
      }
    });
    // Merge Default filters and user filters
    const filters = { ...this.DEFAULT_FILTERS, ...userFilters };
    // console.log(filters);
    return filters;
  }

  static generateRandomCharacters(length) {
    const CHARACTERS =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
    let randomChar = '';
    while (length-- > 0) {
      let index = Math.round(Math.random() * CHARACTERS.length);
      randomChar += CHARACTERS.charAt(index);
    }

    return randomChar;
  }

  /**
   * @param {string} string
   * @returns string
   */
  static capitalizeFirstLetters(string) {
    const output = string
      .trim()
      .split(' ')
      .map((eachWord) => {
        return (
          eachWord.substring(0, 1).toUpperCase() +
          eachWord.substring(1).toLowerCase()
        );
      })
      .join(' ');
    console.log(string, output);
    return output;
  }

  /**
   * @param {Object} query
   * @returns Object
   */
  static arrayToCSV(array) {
    const objectToCSVRow = function (dataObject) {
      let dataArray = [];
      for (const o in dataObject) {
        let innerValue = dataObject[o] === null ? '' : dataObject[o].toString();
        let result = `${innerValue.replace(/"/g, '""')}`;
        dataArray.push(result);
      }

      const fresult = dataArray.join(',') + '\r\n';
      return fresult;
    };

    if (!array.length) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    // headers
    csvContent += objectToCSVRow(Object.keys(array[0]));
    array.forEach(item => {
      csvContent += objectToCSVRow(item);
    });

    const encodedURI = encodeURI(csvContent);
    // console.log(encodedURI);
    return encodedURI;
  }
}

export default HelperUtils;
