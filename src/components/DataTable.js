const DataTable = ({ data }) => {
  if (data != undefined && data.length > 0) {
    const header = data[0];
    data = data.shift();
    console.log(header);

    return (
      <table style={{ border: "5px", width: "100%" }}>
        <thead>
          <tr>
            {header.split(",").map((element) => (
              <th key={element}>{element}</th>
            ))}
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    );
  }
};

export default DataTable;
