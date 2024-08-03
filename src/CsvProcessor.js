export function processCsv(search, content) {
  if (content != null) {
    let rows = content.split("\n");
    const tableHead = rows[0];
    let i = 1;
    const result = [tableHead]; // Include the header

    while (i < rows.length) {
      if (rows[i].toLowerCase().includes(search.toLowerCase())) {
        result.push(rows[i]);
      }
      i++;
    }

    return result;
  }
  return [];
}
