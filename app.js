const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const crypto = require("crypto")
const { body, validationResult } = require('express-validator');



const app = express();
const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: 'cybersecurity',   
  password : 'Rajnandini@29',
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from public directory

 const sessionStore = {}

 function generateSessionId() {
  return crypto;
 }

 function authenticate(username, password, callback){
  const db = new
  sqlite3.Database(' ');
    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, user) => {
      db.close();
      if (err) {
        return callback(err);
        }
        if(!user){
          return callback(null, false);
        }
        if(user.password === password){
          return callback(null,user);
          }
          else{
            return callback(null, false);
          }
        });
      }

 

// Home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Login route

app.get("/cybersecurityMain/cybersecurity/admin.html", (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});

app.get("/cybersecurityMain/cybersecurity/login.html", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
app.post("/submitform", (req, res) => {
   const { user, email, mobile, comments } = req.body;
  
    // Basic validation
    if (!user || !email || !mobile || !comments) {
      console.error("Missing required fields");
      res.status(400).send("Missing required fields");
      return;
    }
  
    const sql =
     "INSERT INTO users (username, email, mobile, comments) VALUES (?, ?, ?, ?)";
    connection.query(sql, [user, email, mobile, comments], (err, result) => {
     if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).send("Error submitting form");
        return;
      }
      console.log("Data inserted successfully");
      res.send("Form submitted successfully ! Thanks for contacting us we will response soon. ");
    });
});

*/






 app.post('/submitform', [
  body('user').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('mobile').isMobilePhone().withMessage('Valid mobile number is required'),
  body('comments').notEmpty().withMessage('Comments are required')
], (req, res) => {
 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
 }

  const { user, email, mobile, comments } = req.body;

  const sql = 'INSERT INTO users (username, email, mobile, comments) VALUES (?, ?, ?, ?)';
  connection.query(sql, [user, email, mobile, comments], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ success: false, message: 'Error submitting form' });
    }
    console.log('Data inserted successfully:', result);
    res.json({ success: true, message: 'Form submitted successfully' });
  });
});

// app.post('/signup', (req, res) => {
//   const { username, password } = req.body;

//   // Insert data into the database
//   const sql = `INSERT INTO signUpUser (username, password) VALUES (?, ?)`;
//   connection.query(sql, [username, password], (err, result) => {
//     if (err) {
//       console.error('Error inserting data into MySQL database: ' + err);
//       res.send('An error occurred while processing your request.');
//       return;
//     }
//     console.log('New record inserted into MySQL database');
//     res.redirect('/');
//   });
// });



// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   const sql = `SELECT * FROM signUpUser WHERE username = ? AND password = ?`;
//   connection.query(sql, [username, password], (err, results) => {
//     if (err) {
//       console.error('Error querying the database: ' + err);
//       res.send('An error occurred while processing your request.');
//       return;
//     }

//     if (results.length > 0) {
//       // Login successful
//       res.redirect('/');
//     } else {
//       // Username or password is incorrect
//       res.send('Invalid username or password. Please try again.');
//     }
//   });

// });

app.get('/admin',(req,res)  => {
  const sql = `select * from users`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error gettting data into MySQL database: ' + err);
      res.send('An error occurred while processing your request.');
      return;
    }

    console.log(result);

    

    const html = `
<html>
<head>
<title>My Data</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
    padding: 0;
    background-color: #f4f4f9;
  }
  h1 {
    color: #333;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 1em;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }
  table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
  }
  table th, table td {
    padding: 12px 15px;
  }
  table tbody tr {
    border-bottom: 1px solid #dddddd;
  }
  table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }
  table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }
</style>
</head>
<body>
<h1>Data from MySQL</h1>
<table>
  <thead>
    <tr>
      <th>Username</th>
      <th>Email</th>
      <th>Mobile</th>
      <th>Comments</th>
    </tr>
  </thead>
  <tbody>
    ${result.map(item => `
      <tr>
        <td>${item.username}</td>
        <td>${item.email}</td>
        <td>${item.mobile}</td>
        <td>${item.comments}</td>
      </tr>
    `).join('')}
  </tbody>
</table>
</body>
</html>`;

res.send(html);
 
    // Redirect to dashboard with username as parameter in URL
    // res.redirect('/?username=' + encodeURIComponent(username));
    res.sendFile(__dirname + "/admin.html");
  });
})

/*
// After successful signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Insert data into the database
  const sql = `INSERT INTO signUpUser (username, password) VALUES (?, ?)`;
  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL database: ' + err);
      res.send('An error occurred while processing your request.');
      return;
    }
    console.log('New record inserted into MySQL database');
    // Redirect to dashboard with username as parameter in URL
    res.redirect('/?username=' + encodeURIComponent(username));
  });
});
*/
// After successful login
/* app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT * FROM signUpUser WHERE username = ? AND password = ?`;
  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error querying the database: ' + err);
      res.send('An error occurred while processing your request.');
      return;
    }

    if (results.length > 0) {
      // Redirect to dashboard with username as parameter in URL
      res.redirect('/?username=' + encodeURIComponent(username));
    } else {
      // Username or password is incorrect
      res.send('Invalid username or password. Please try again.');
    }
  });
});  */








app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
