"use strict";
var mysql = require("mysql");

//----------------------  INSERT FUNCTION  --------------------------//
class db {
  //----------------------  DATABASE CONNECTION  ----------------------//

  conn() {
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "dbname",
      charset: "utf8"
    });
    return con;
  }

  //----------------------  INSERT FUNCTION  --------------------------//

  insert(sql, callback) {
    var con = this.conn();
    con.query(sql, function(err, result) {
      if (err) {
        console.log(err);
        callback(null, new Error("Error returning data"));
      } else {
        callback(result.insertId);
      }
    });
    con.end();
  }

  insert(sql, value, callback) {
    var con = this.conn();
    con.query(sql, value, function(err, result) {
      if (err) {
        console.log(err);
        callback(null, new Error("Error returning data"));
      } else {
        callback(result.insertId);
      }
    });
    con.end();
  }

  //----------------------  UPDATE FUNCTION  --------------------------//

  update(sql, callback) {
    var con = this.conn();
    con.query(sql, function(err, result) {
      if (err) {
        console.log(sql);
        callback(null, new Error("Error returning data"));
      } else {
        callback(result.insertId);
      }
    });
    con.end();
  }

  update(sql, value, callback) {
    var con = this.conn();
    con.query(sql, value, function(err, result) {
      if (err) {
        console.log(sql);
        callback(null, new Error("Error returning data"));
      } else {
        callback(result.insertId);
      }
    });
    con.end();
  }

  //----------------------  SELECT FUNCTION  --------------------------//

  select(sql, callback) {
    var con = this.conn();
    con.query(sql, function(err, rows) {
      if (err) {
        console.log(err);
        callback(null, new Error("Error returning data"));
      } else {
        callback(rows);
      }
    });
    con.end();
  }
}

module.exports = new db();
