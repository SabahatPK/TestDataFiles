let promises = [d3.csv("data/Mar2007.csv")];

let parseTime = d3.timeParse("%Y");
let formatTime = d3.timeFormat("%B %d, %Y");

let checkStrings = {
  checkNoSpaceRegex: x => x.match(/^[a-zA-Z0-9]*$/gm)
};

Promise.all(promises).then(function(allData) {
  let file = allData[0];
  let data = "";

  file.forEach(function(d) {
    //Clean up data as needed:
    for (let property in d) {
      //Create a new row
      $("#checkTable tr:last").after("<tr id = 'latestRow'><td>1</td></tr>");
      if (d.hasOwnProperty(property) && property == "Date") {
        d[property] = new Date(d[property]);
        data = d[property];
        $("#latestRow").append("<td></td>");
      } else if (d.hasOwnProperty(property) && property !== "Date") {
        if (property === "Province") {
          if (
            d[property] === "BALUCHISTAN" ||
            d[property] === "AZAD JAMMU AND KASHMIR (AJK)" ||
            d[property] === "FEDERALLY ADMINISTRATED TRIBAL AREAS (FATA)" ||
            d[property] === "GILGIT-BALTISTAN (GB)" ||
            d[property] === "ISLAMABAD CAPITAL TERRITORY (ICT)" ||
            d[property] === "KHYBER-PAKHTUNKHWA (KP)" ||
            d[property] === "PUNJAB" ||
            d[property] === "SINDH"
          ) {
            d[property] = "OK";
          }
        } else if (property === "District") {
          if (checkStrings.checkNoSpaceRegex(d[property])) {
            d[property] = "OK";
          }
        } else if (
          property === "Offices - Fixed" ||
          property === "Offices - Mobile" ||
          property === "Active Borrowers" ||
          property === "Gross Loan Portfolio(PKR)" ||
          property === "Active Savers" ||
          property === "Value of Savings(PKR)" ||
          property === "Potential Microfinance Market"
        ) {
          if (
            d[property] === "-" ||
            (typeof d[property] === "number" && isFinite(value))
          ) {
            d[property] = "OK";
          }
        }
      }
      //Then populate each col of that row with data from csv file:
      console.log(d[property]);
    }
    //Then print checks onto table:
  });
});

// File checks:
//Col 1 - Date, convert to date format and print in table
//Col 2 - Province; check name matches against given, might have to make all upperCase before comparing
//Col 3 - District; print names that have spaces to check they are OK to have spaces
//Col 4 - Offices - Fixed; should either be "-" or a number
//Col 5 - Offices - Mobile; should either be "-" or a number
//Col 6 - Active Borrowers; should either be "-" or a number
//Col 7 - Gross Loan Portfolio(PKR); should either be "-" or a number
//Col 8 - Active Savers; should either be "-" or a number
//Col 9 - Value of Savings(PKR); should either be "-" or a number
//Col 10 - Potential Microfinance Market; should either be "-" or a number
//Other - cross-check a row of data per Province; pick a random row per Province
//Other - identify all rows that have "-" and cross-refernce a few to make sure that they are all "-" or N/A in original data
//Other - identify all rows that have 0 and cross-refernce a few to make sure that they are all 0 in original data
//Other - add dummy data to trip negative test cases
