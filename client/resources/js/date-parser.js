function dateParser(day, month, year) {
  switch (month) {
    case 1: {
      month = "January";
      break;
    }
    case 2: {
      month = "February";
      break;
    }
    case 3: {
      month = "March";
      break;
    }
    case 4: {
      month = "April";
      break;
    }
    case 5: {
      month = "May";
      break;
    }
    case 6: {
      month = "June";
      break;
    }
    case 7: {
      month = "July";
      break;
    }
    case 8: {
      month = "August";
      break;
    }
    case 9: {
      month = "September";
      break;
    }
    case 10: {
      month = "October";
      break;
    }
    case 11: {
      month = "November";
      break;
    }
    case 12: {
      month = "December";
      break;
    }
    default: {
      month = null;
      break;
    }
  }

  if (day > 0 && day <= 31 && month != null && year >= 1900 && year <= 2200) {
    return `${day} ${month} ${year}`;
  } else {
    console.log("Date is not valid");
    return "&mdash;";
  }
}