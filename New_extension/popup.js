document.addEventListener('DOMContentLoaded', () => {
  const timeTable = document.getElementById('timeTable');

  chrome.storage.local.get(["tabTimes"], result => {
    const tabTimes = result.tabTimes || {};

    Object.keys(tabTimes).forEach(url => {
      const timeSpent = ((Date.now() - tabTimes[url].startTime) + tabTimes[url].totalTime) / 1000;
      const row = document.createElement('tr');
      const urlCell = document.createElement('td');
      const timeSpentCell = document.createElement('td');

      urlCell.textContent = url;
      timeSpentCell.textContent = timeSpent.toFixed(2);

      row.appendChild(urlCell);
      row.appendChild(timeSpentCell);
      timeTable.appendChild(row);
    });
  });
});
