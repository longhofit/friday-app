export const cardNumberFormatter = (value: string): string => {
  return value
    .replace(/\s?/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim();
};

export const getDatesBetweenDates = (startDate, endDate) => {
  let dates = []
  const theDate = new Date(startDate)

  while (theDate < new Date(endDate)) {
    dates.push(new Date(theDate))
    theDate.setDate(theDate.getDate() + 1)
  }

  return [...dates, new Date(endDate)];
}

export const expirationDateFormatter = (value: string, stateValue: string): string => {
  let formatted: string = value;
  if (formatted[0] !== '1' && formatted[0] !== '0') {
    formatted = '';
  }
  if (formatted.length === 2) {
    if (parseInt(formatted.substring(0, 2), 10) > 12) {
      formatted = formatted[0];
    } else if (stateValue.length === 1) {
      formatted += '/';
    } else {
      formatted = formatted[0];
    }
  }

  return formatted;
};

export const cvvFormatter = (value: string): string => {
  return value;
};

export const cardholderNameFormatter = (value: string): string => {
  return value.toLocaleUpperCase();
};

// 2020-03-13T09:57:37.000Z => 13/03/2020
export const ddMMyyyyFormatter = (value: Date) => {
  let dd: string | number = value.getDate();
  let mm: string | number = value.getMonth() + 1;
  const yyyy: number = value.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  return dd + '/' + mm + '/' + yyyy;
};

// 2020-03-13T09:57:37.000Z => 2020-03-13
export const yyyMMddFormatter = (value: Date) => {
  let dd: string | number = value.getDate();
  let mm: string | number = value.getMonth() + 1;
  const yyyy: number = value.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  return `${yyyy}-${mm}-${dd}`
};

export const dateAutoFormatter = (value: Date, country: string) => {
  let dd: string | number = value.getDate();
  let mm: string | number = value.getMonth() + 1;
  const yyyy: number = value.getFullYear();
  let date: string = '';

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }


  switch (country) {
    case 'United States':
      date = mm + '/' + dd + '/' + yyyy;
      break;

    case 'China': case 'Taiwan': case `Korea, Democratic People's Republic of`: case 'Korea, Republic of': case 'Japan': case 'Canada':
      date = yyyy + '/' + mm + '/' + dd;
      break;

    default:
      date = dd + '/' + mm + '/' + yyyy;
      break;
  }

  return date;
};

export const ddMMyyyyFormatterV2 = (value: string) => {
  if (value) {
    const date: string = value.split(' ')[0];
    const time: string = value.split(' ')[1];
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];
    return `${day}/${month}/${year}`;
  }

  return '';
};

// 2020-10-27 13:43:37 => 27/10/2020
export const dateAutoFormatterV2 = (value: string, country: string) => {
  let result: string = '';

  if (value) {
    const date: string = value.split(' ')[0];
    const time: string = value.split(' ')[1];
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];

    switch (country) {
      case 'United States':
        result = month + '/' + day + '/' + year;
        break;

      case 'China': case 'Taiwan': case `Korea, Democratic People's Republic of`: case 'Korea, Republic of': case 'Japan': case 'Canada':
        result = year + '/' + month + '/' + day;
        break;

      default:
        result = day + '/' + month + '/' + year;
        break;
    }
  }

  return result;
};

// 2020-10-27 13:43:37 => 27/10/2020 13:43:37
export const ddMMyyyyFormatterV3 = (value: string) => {
  if (value) {
    const date: string = value.split(' ')[0];
    const time: string = value.split(' ')[1];
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];
    return `${day}/${month}/${year} ${time}`;
  }

  return '';
};

export const autoDDmmyyyyFormatterV3 = (value: string, country: string) => {
  let result: string = '';

  if (value) {
    const date: string = value.split(' ')[0];
    const time: string = value.split(' ')[1];
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];

    switch (country) {
      case 'United States':
        result = `${month}/${day}/${year} ${time}`;
        break;

      case 'China': case 'Taiwan': case `Korea, Democratic People's Republic of`: case 'Korea, Republic of': case 'Japan': case 'Canada':
        result = `${year}/${month}/${day} ${time}`;
        break;

      default:
        result = `${day}/${month}/${year} ${time}`;
        break;
    }
  }

  return result;
};

// 2020-03-13T09:57:37.000Z => 13/03/2020
export const ddMMyyyyFormatterV2Formatter = (dateParam: Date): string => {
  if (dateParam) {
    const fullYear: number = dateParam.getFullYear();
    let month: string | number = dateParam.getMonth() + 1;
    let date: string | number = dateParam.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (date < 10) {
      date = '0' + date;
    }

    return `${date}/${month}/${fullYear}`;
  }

  return '';
};

export const ddMMyyyyFormatterV3Formatter = (value: Date) => {
  let dd: string | number = value.getUTCDate();
  let mm: string | number = value.getUTCMonth() + 1;
  const yyyy: number = value.getUTCFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  return dd + '/' + mm + '/' + yyyy;
};


// 2020-03-13T09:57:37.000Z => 2020/03/13
export const yyyyMMddFormatter = (value: Date) => {

  let dd: string | number = value.getDate();
  let mm: string | number = value.getMonth() + 1;
  const yyyy: number = value.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return yyyy + '-' + mm + '-' + dd;
};

//  29/07/2011 22:52:48 =>
export const ddMMyyToMMddyy = (value: string) => {
  const month: string = value.split('/')[1];
  const date: string = value.split('/')[0];
  const year: string = value.split('/')[2].split(' ')[0];
  const houseAndMinutes: string = value.split(' ')[1];
  return `${month}/${date}/${year} ${houseAndMinutes}`;
};

export const yyyyMMddFormatterV2 = (value: Date) => {
  let dd: string | number = value.getUTCDate();
  let mm: string | number = value.getUTCMonth() + 1;
  const yyyy: number = value.getUTCFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  return yyyy + '-' + mm + '-' + dd;
};

// 2020-03-13T09:57:37.000Z => 2020/02/13
export const yyyyMMddFormatterV2Formatter = (dateParam: Date): string => {
  if (dateParam) {
    const fullYear: number = dateParam.getFullYear();
    let month: string | number = dateParam.getMonth() + 1;
    let date: string | number = dateParam.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (date < 10) {
      date = '0' + date;
    }

    return `${fullYear}/${month}/${date}`;
  }

  return '';
};

// 1996-09-01 => 01-09-1996
export const yyyyMMddToddMMyyyFormatter = (date: string): string => {
  if (date) {
    const numArr: string[] = date.split('-');

    return `${numArr[2]}-${numArr[1]}-${numArr[0]}`;
  }

  return '';
};

// 1996-09-01 => 01/09/1996
export const yyyyMMddToddMMyyyFormatterV2 = (date: string): string => {
  if (date) {
    const numArr: string[] = date.split('-');

    return `${numArr[2]}/${numArr[1]}/${numArr[0]}`;
  }

  return '';
};

export const autoYYYMMddToddMMyyyFormatterV2 = (date: string, country: string): string => {
  let result: string = '';

  if (date) {
    const numArr: string[] = date.split('-');

    switch (country) {
      case 'United States':
        result = `${numArr[1]}/${numArr[2]}/${numArr[0]}`;
        break;

      case 'China': case 'Taiwan': case `Korea, Democratic People's Republic of`: case 'Korea, Republic of': case 'Japan': case 'Canada':
        result = `${numArr[0]}/${numArr[1]}/${numArr[2]}`;
        break;

      default:
        result = `${numArr[2]}/${numArr[1]}/${numArr[0]}`;
        break;
    }
  }

  return result;
};

// 2020-03-13T09:57:37.000Z => 13/03/2020 09:57:37
export const ddMMyyyyhhMMssFormatter = (dateParam: Date): string => {
  if (dateParam) {
    const fullYear: string | number = dateParam.getFullYear();
    let month: string | number = dateParam.getMonth() + 1;
    let date: string | number = dateParam.getDate();
    let hours: string | number = dateParam.getHours();
    let minutes: string | number = dateParam.getMinutes();
    let seconds: string | number = dateParam.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }

    if (date < 10) {
      date = '0' + date;
    }

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return `${date}/${month}/${fullYear} ${hours}:${minutes}:${seconds}`;
  }

  return '';
};

// 2020-03-13T09:57:37.000Z => 13/03/2020 09:57:37
export const yyyyMMddhhMMssFormatter = (dateParam: Date): string => {
  if (dateParam) {
    const fullYear: string | number = dateParam.getFullYear();
    let month: string | number = dateParam.getMonth() + 1;
    let date: string | number = dateParam.getDate();
    let hours: string | number = dateParam.getHours();
    let minutes: string | number = dateParam.getMinutes();
    let seconds: string | number = dateParam.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }

    if (date < 10) {
      date = '0' + date;
    }

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return `${fullYear}/${month}/${date} ${hours}:${minutes}:${seconds}`;
  }

  return '';
};

// 2020-03-13T09:57:37.000Z => 13/03/2020 09:57:37
export const yyyyMMddhhMMssFormatterV2 = (dateParam: Date): string => {
  if (dateParam) {
    const fullYear: string | number = dateParam.getFullYear();
    let month: string | number = dateParam.getMonth() + 1;
    let date: string | number = dateParam.getDate();
    let hours: string | number = dateParam.getHours();
    let minutes: string | number = dateParam.getMinutes();
    let seconds: string | number = dateParam.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }

    if (date < 10) {
      date = '0' + date;
    }

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return `${fullYear}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  }

  return '';
};

// 1996-09-01 01:01:01 => 01/09/1996
export const yyyyMMddhhMMssToddMMyyyyFormatter = (date: string): string => {
  if (date) {
    const dateTemp: string = date.substring(0, 10);
    const numArr: string[] = dateTemp.split('-');

    return `${numArr[2]}/${numArr[1]}/${numArr[0]}`;
  }

  return '';
};

export const autoYYYYMMddhhMMssToddMMyyyyFormatter = (date: string, country: string): string => {
  let result: string = '';

  if (date) {
    const dateTemp: string = date.substring(0, 10);
    const numArr: string[] = dateTemp.split('-');

    switch (country) {
      case 'United States':
        result = numArr[1] + '/' + numArr[2] + '/' + numArr[0];
        break;

      case 'China': case 'Taiwan': case `Korea, Democratic People's Republic of`: case 'Korea, Republic of': case 'Japan': case 'Canada':
        result = numArr[0] + '/' + numArr[1] + '/' + numArr[2];
        break;

      default:
        result = numArr[2] + '/' + numArr[1] + '/' + numArr[0];
        break;
    }
  }

  return result;
};
