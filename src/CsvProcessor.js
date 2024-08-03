export function processCsv(search, content) {
  // validateCSV();
  if (content != null) {
    let rows = content.split("\n");
    const tableHead = rows[0];
    let i = 1;
    const result = [];
    // result.push(tableHead);
    while (i < rows.length) {
      if (rows[i].toLowerCase().includes(search.toLowerCase())) {
        result.push(rows[i]);
      }
      i++;
    }
    // console.log(result);
    return [tableHead, result];
  }
}
