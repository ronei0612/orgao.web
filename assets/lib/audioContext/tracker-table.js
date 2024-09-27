// tracker-table.js
function trackerTable() {
  this.str = '';
  this.getTable = function () {
    return '<table id="tracker-table">' + this.str + '</table>';
  };

  this.setHeader = function (numRows, data) {
    this.str += `<tr class="tracker-row header">`;
    this.str += this.getCells('header', numRows, { header: true });
    this.str += `</tr>`;
  };

  this.setRows = function (numRows, numCols, data) {
    this.setHeader(numCols, data);
    for (let rowID = 0; rowID < numRows; rowID++) {
      this.str += `<tr class="tracker-row" data-id="${rowID}">`;
      this.str +=
        data.title &&
          (data.title[rowID].includes('baixo') ||
            data.title[rowID].includes('cravo') ||
            data.title[rowID].includes('violao'))
          ? ''
          : this.getCells(rowID, numCols, data);
      this.str += `</tr>`;
    }
  };

  this.getFirstCell = function (rowID, data) {
    i++;
    var str = '';
    str += `<td class="tracker-first-cell" data-row-id="${rowID}">`;
    if (data.title) {
      str += data.title[rowID];
    }
    str += `</td>`;
    return str;
  };
  var i = 0;
  this.getCells = function (rowID, numRows, data) {
    var str = '';
    var num = '';
    str += this.getFirstCell(rowID, data);
    let cssClass = 'tracker-cell';
    if (rowID == 'header') {
      cssClass = 'tracker-cell-header';
    }
    for (let c = 0; c < numRows; c++) {
      if (cssClass == 'tracker-cell') num = i;
      else num = '';
      str += `<td class="${cssClass}" data-row-id="${rowID}" data-col-id="${c}">${num}`;
      i++;
      if (data.header) {
        str += c + 1;
      }
      str += `</td>`;
    }
    return str;
  };
}