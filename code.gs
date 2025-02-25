const FOLDER_ID = 'GOOGLE_DRIVE_FOLDER_ID'; // the id of the Google Drive folder where the files are
const TAB_NAME = 'TAB_NAME' // the tab/sheet name in the Google Sheet where we will append the data

function onOpen() { // this will display a custom menu in the Google Sheet
    let ui = SpreadsheetApp.getUi();
    ui.createMenu('CSV Script').addItem("Get CSVs","importCSVs").addToUi();
}

function importCSVs() {
  let folder = DriveApp.getFolderById(FOLDER_ID);
  let files = folder.getFiles();
  let data = [];
  
  while (files.hasNext()) {
    let file = files.next();
    let fileType = file.getMimeType();
    if (fileType == "text/csv") {
        let csvData = Utilities.parseCsv(file.getBlob().getDataAsString());
        csvData.splice(0,1);
        csvData = csvData.filter(x => x[0] != '');
        csvData.forEach(x => data.push(x));
        file.setTrashed(true);
    }
  }

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(TAB_NAME);
  sheet.getRange(sheet.getLastRow()+1,1,data.length,data[0].length).setValues(data);
  sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).sort({column: 1, ascending: true});

}
