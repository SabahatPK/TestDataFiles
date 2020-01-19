let promises = [
  d3.csv("data/All_Data_DEC20xx.csv"),
  d3.csv("data/Dec2006.csv"),
  d3.csv("data/DummyFile.csv")
];

let checkStrings = {
  checkNoSpaceRegex: x => x.match(/^[a-zA-Z0-9]*$/gm)
};

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      element[key] !== "OK"
        ? (cell.style["background-color"] = "#fa7857")
        : null;
      cell.appendChild(text);
    }
  }
}

let allProvinces = [
  "BALUCHISTAN",
  "AZAD JAMMU AND KASHMIR (AJK)",
  "FEDERALLY ADMINISTRATED TRIBAL AREAS (FATA)",
  "GILGIT-BALTISTAN (GB)",
  "ISLAMABAD CAPITAL TERRITORY (ICT)",
  "KHYBER-PAKHTUNKHWA (KP)",
  "PUNJAB",
  "SINDH"
];

let allStaticHeadings = [
  "Date",
  "Province",
  "District",
  "Offices - Fixed",
  "Offices - Mobile",
  "Active Borrowers",
  "Gross Loan Portfolio(PKR)",
  "Active Savers",
  "Value of Savings(PKR)",
  "Policy Holders",
  "Sum Insured(PKR)",
  "Potential Microfinance Market"
];

Promise.all(promises).then(function(allData) {
  let file = allData[0];
  let errTextMsg = $("#errMsg1");

  //OUTS - have to fix formatting or error messages so they are not piling on top of each other.
  //Making sure every file has all 8 provinces and spitting out name of any provice that has no data:
  for (let i = 0; i < allProvinces.length; i++) {
    if (file.filter(row => row.Province === allProvinces[i]).length === 0) {
      errTextMsg.append("This province is missing data: " + allProvinces[i]) +
        ". ";
    }
  }

  //Check that there are 8 Totals rows:
  file.filter(row => row.District === "Total");
  if (file.filter(row => row.District === "Total").length < 8) {
    $("#errMsg2").text("ERROR: There are less than 8 Total rows.");
  } else if (file.filter(row => row.District === "Total").length > 8) {
    $("#errMsg2").text("ERROR: There are more than 8 Total rows.");
  }

  //Check that the core columns exist:
  let allHeadings = Object.keys(file[0]);
  if (allHeadings.length === 10 || allHeadings.length === 12) {
    for (let i = 0; i < allHeadings.length; i++) {
      allStaticHeadings.indexOf(allHeadings[i]) !== -1;
    }
  } else {
    $("#errMsg3").text(
      "ERROR: There is a mismatch in headings; either too many or too few or incorrect."
    );
  }

  //Clean up data as needed:
  file.forEach(function(d) {
    for (let property in d) {
      if (d.hasOwnProperty(property) && property == "Date") {
        d[property] = new Date(d[property]);
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
          if (
            checkStrings.checkNoSpaceRegex(d[property]) ||
            d[property] === "Dera Bugti" ||
            d[property] === "Jhal Magsi" ||
            d[property] === "Kech (Turbat)" ||
            d[property] === "Qila Abdullah" ||
            d[property] === "Qila Saifullah" ||
            d[property] === "Buner (Daggar)" ||
            d[property] === "D.I. Khan" ||
            d[property] === "Lakki Marwat" ||
            d[property] === "Lower Dir" ||
            d[property] === "Upper Dir" ||
            d[property] === "D.G. Khan" ||
            d[property] === "Mandi Bahauddin" ||
            d[property] === "Nankana Sahib" ||
            d[property] === "Rahimyar Khan" ||
            d[property] === "Toba Tek Singh" ||
            d[property] === "Mirpur Khas" ||
            d[property] === "Naushahro Feroze" ||
            d[property] === "Shehdad Kot" ||
            d[property] === "Tando Allahyar" ||
            d[property] === "Umar Kot" ||
            d[property] === "Bajaur Agency" ||
            d[property] === "Khyber Agency" ||
            d[property] === "Kurram Agency" ||
            d[property] === "Mohmand Agency" ||
            d[property] === "North Waziristan Agency" ||
            d[property] === "Orakzai Agency" ||
            d[property] === "South Waziristan Agency" ||
            d[property] === "Tando Muhammad Khan" ||
            d[property] === "Tando Jam" ||
            d[property] === "Sehwan Sharif"
          ) {
            d[property] = "OK";
          }
        } else if (
          property === "Offices - Fixed" ||
          property === "Offices - Mobile" ||
          property === "Active Borrowers" ||
          property === "Gross Loan Portfolio(PKR)" ||
          property === "Active Savers" ||
          property === "Value of Savings(PKR)" ||
          property === "Policy Holders" ||
          property === "Sum Insured(PKR)" ||
          property === "Potential Microfinance Market"
        ) {
          if (d[property] === "-") {
            d[property] = "OK";
          } else d[property] = parseFloat(d[property]);

          if (
            d[property] === "-" ||
            (typeof d[property] === "number" && isFinite(d[property]))
          ) {
            d[property] = "OK";
          }
        }
      }
    }
  });

  let table = document.querySelector("#checkTable");
  let data = Object.keys(file[0]);
  generateTable(table, file); // generate the table first
  generateTableHead(table, data); // then the head
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
