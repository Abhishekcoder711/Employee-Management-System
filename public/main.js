let token = '';
let employeeData = [];

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      token = data.token;
      document.getElementById('login-status').innerText = "✅ Logged in!";
      document.querySelector('.login-box').style.display = 'none';
      document.getElementById('employee-section').style.display = 'block';
      getEmployees();
    } else {
      document.getElementById('login-status').innerText = "❌ Login failed!";
    }
  });
}

function logout() {
  token = '';
  document.querySelector('.login-box').style.display = 'block';
  document.getElementById('employee-section').style.display = 'none';
  document.getElementById('login-status').innerText = "🔒 Logged out.";
}

function getEmployees() {
  fetch('http://localhost:3000/api/employees', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    employeeData = data;
    renderTable(employeeData);
  });
}

function renderTable(data) {
  const table = document.getElementById('employee-table');
  table.innerHTML = "<tr><th>ID</th><th>Name</th><th>Position</th><th>Salary</th></tr>";
  data.forEach(emp => {
    table.innerHTML += `<tr><td>${emp.id}</td><td>${emp.name}</td><td>${emp.position}</td><td>${emp.salary}</td></tr>`;
  });
}

function filterTable() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const filtered = employeeData.filter(emp => emp.name.toLowerCase().includes(searchInput));
  renderTable(filtered);
}

function sortTableByName() {
  const sorted = [...employeeData].sort((a, b) => a.name.localeCompare(b.name));
  renderTable(sorted);
}

function sortTableBySalary() {
  const sorted = [...employeeData].sort((a, b) => a.salary - b.salary);
  renderTable(sorted);
}

function addEmployee() {
  const name = document.getElementById('emp-name').value;
  const position = document.getElementById('emp-position').value;
  const salary = document.getElementById('emp-salary').value;

  fetch('http://localhost:3000/api/employees', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, position, salary })
  })
  .then(res => res.json())
  .then(() => {
    alert("✅ Employee added!");
    getEmployees();
  });
}

function updateEmployee() {
  const id = document.getElementById('update-id').value;
  const name = document.getElementById('update-name').value;
  const position = document.getElementById('update-position').value;
  const salary = document.getElementById('update-salary').value;

  fetch(`http://localhost:3000/api/employees/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, position, salary })
  })
  .then(res => res.json())
  .then(() => {
    alert("✅ Employee updated!");
    getEmployees();
  });
}

function deleteEmployee() {
  const id = document.getElementById('emp-id').value;

  fetch(`http://localhost:3000/api/employees/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(() => {
    alert("🗑️ Employee deleted!");
    getEmployees();
  });
}