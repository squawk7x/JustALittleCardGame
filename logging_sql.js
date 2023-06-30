const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ao1602',
  database: 'bridgesql',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySql Connected...');
});

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE bridgesql';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    res.send('Database created...');
  });
});

app.get('/createtablemoves', (req, res) => {
  let sql =
    'CREATE TABLE moves(id int AUTO_INCREMENT, player VARCHAR(255), card VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    res.send('Table "moves" created...');
  });
});

app.get('/insertdata', (req, res) => {

  res.header('Access-Control-Allow-Origin', 'http://localhost:5500');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  const { player, card, stack, blind } = req.query;

  // Perform any necessary validation or data processing

  let data = { player, card, stack, blind};
  let sql = 'INSERT INTO moves SET ?';
  db.query(sql, data, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error inserting data.');
    } else {
      console.log(result);
      res.json({ message: 'Data inserted successfully.' });
    }
  });
});

function clearTable(tableName) {
  let sql = `TRUNCATE TABLE ${tableName}`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    // console.log(`Table ${tableName} cleared.`, result);
  });
}

clearTable('moves');

app.use(cors({ origin: 'http://localhost:5500' }));

app.listen('3000', () => {
  console.log('Server started on Port 3000');
});
