import Papa, { parse } from "papaparse";

export function processCsv(
  search,
  content,
  firstVal,
  lastVal,
  pageSize,
  showNext
) {
  if (content != null) {
    const parsedData = Papa.parse(content, {
      header: false,
      skipEmptyLines: true,
    });
    console.log(search, firstVal, lastVal);
    const result = [];

    const rows = parsedData.data;
    const tableHead = rows[0];
    // let firstRecord = (page - 1) * pageSize;
    // if (firstRecord === 0) firstRecord++;
    // console.log(firstRecord, pageSize);
    let i;
    if (showNext) {
      result.push(tableHead);
      for (
        i = lastVal;
        i < rows.length && i > 0 && result.length <= pageSize;
        i++
      ) {
        const row = rows[i];
        if (row.join(" ").toLowerCase().includes(search.toLowerCase())) {
          result.push(row);
        }
      }
      return [result, lastVal, i, rows.length];
    } else {
      for (
        i = firstVal;
        i > 0 && result.length <= pageSize && i < rows.length;
        i--
      ) {
        const row = rows[i];
        if (row.join(" ").toLowerCase().includes(search.toLowerCase())) {
          result.push(row);
        }
      }
      result.push(tableHead);
      result.reverse();
      return [result, i, firstVal, rows.length];
    }
  }
  return [];
}
