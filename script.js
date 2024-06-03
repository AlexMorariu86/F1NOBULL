const apiUrl = 'https://ergast.com/api/f1/2024/8/driverStandings.json'; // Replace with your API URL

let globalDriverData = []; // This will hold the driver data for sorting

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(driverData => {
    // Filter out Max Verstappen and Sergio Pérez, and store the data globally
    globalDriverData = driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings.filter(driver => {
      const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
      return driverName !== 'Max Verstappen' && driverName !== 'Sergio Pérez';
    });

    // Create the table with the initial data
    createDriverStandingsTable(globalDriverData);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Function to create the driver standings table
function createDriverStandingsTable(drivers) {
  const standingsTable = document.getElementById('data-container');
  standingsTable.innerHTML = ''; // Clear existing table if any

  // Create table elements
  const table = document.createElement('table');
  const tableHead = document.createElement('thead');
  const tableBody = document.createElement('tbody');

  // Create table header row
  const headerRow = document.createElement('tr');
  const headers = ['Pos', 'Driver', 'Points', 'Wins', 'Team'];
  headers.forEach(header => {
    const headerCell = document.createElement('th');
    headerCell.textContent = header;
    headerRow.appendChild(headerCell);
  });

  tableHead.appendChild(headerRow);
  table.appendChild(tableHead);

  // Create table body rows from driver data
  drivers.forEach((driver, index) => {
    const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;

    const row = document.createElement('tr');
    const positionCell = document.createElement('td');
    positionCell.textContent = index + 1; // Use index for the position
    row.appendChild(positionCell);

    const driverCell = document.createElement('td');
    driverCell.textContent = driverName;
    row.appendChild(driverCell);

    const pointsCell = document.createElement('td');
    pointsCell.textContent = driver.points;
    row.appendChild(pointsCell);

    const winsCell = document.createElement('td');
    winsCell.textContent = driver.wins;
    row.appendChild(winsCell);

    const team = driver.Constructors[0].name;
    const teamCell = document.createElement('td');
    teamCell.textContent = team;
    row.appendChild(teamCell);

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  standingsTable.appendChild(table);
}

// Sorting function
function sortDriversAlphabetically() {
  // Sort the global driver data by driver name
  globalDriverData.sort((a, b) => {
    const nameA = `${a.Driver.givenName} ${a.Driver.familyName}`.toUpperCase();
    const nameB = `${b.Driver.givenName} ${b.Driver.familyName}`.toUpperCase();
    return nameA.localeCompare(nameB);
  });

  // Re-create the table with the sorted data
  createDriverStandingsTable(globalDriverData);
}

// Sorting function by points
function sortDriversByPoints() {
  // Sort the global driver data by points in descending order
  globalDriverData.sort((a, b) => b.points - a.points);

  // Re-create the table with the sorted data
  createDriverStandingsTable(globalDriverData);
}

// Event listener for the sorting button
document.getElementById('sort-button').addEventListener('click', sortDriversAlphabetically);

// Event listener for the sorting by points button
document.getElementById('sort-points-button').addEventListener('click', sortDriversByPoints);