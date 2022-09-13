var fs = require('fs'); 
var csv = require('csv-parser');
const commonService = require('../service/common')

module.exports = class User {
    bulkImport(params, callback) {
        const c = new commonService()
        var con = c.getConnection()
        con.connect((err) => {
            if (err) 
                return callback("failed");
            fs.createReadStream('../airlinepros/bulk_import/sample.csv')
            .pipe(csv())
            .on('data', (data) => {
                try {
                    let params = [data['Employee name'],data['Email'],c.encrypt(data['Password']),new Date(data['Date of join'])];
                    // console.log(c.decrypt(params[2]))
                    var sql = "INSERT IGNORE INTO ap.users (name, email, password, date_of_join) VALUES (?, ?, ?, ?)";
                    con.query(sql, params, (err, result) => {
                      if (err)
                        return "failed";
                        if(result.affectedRows == 1) {
                          c.sendMail('selad26176@laluxy.com',{username: data['Email'], password: data['Password']})
                          // c.sendMail(data['Email'],{username: data['Email'], password: data['Password']})
                        }
                    });
                }
                catch(err) {
                    return "failed";
                }
            })
            .on('end',() => {
                return callback("Users created");
            });
          });
    }

    validateUser(params, callback) {
        const c = new commonService()
        var con = c.getConnection()
        con.connect((err) => {
            let sql_params = [params['username'], c.encrypt(params['password'])];
            let sql = "SELECT * from ap.users where email=? and password=?;"
            con.query(sql, sql_params, (err, result) => {
                if (err)
                  return callback(0);
                return callback(result.length)
              });
        });
    }

    getUsers(callback) {
        const c = new commonService()
        var con = c.getConnection()
        con.connect((err) => {
            let sql = "SELECT id, name, email, date_of_join from ap.users;"
            con.query(sql, (err, result) => {
                if (err)
                  return callback("failed");
                return callback(result)
              });
        });
    }

    getUser(params, callback) {
        const c = new commonService()
        var con = c.getConnection()
        con.connect((err) => {
            let sql = "SELECT id, name, email, date_of_join from ap.users where id = ?;"
            con.query(sql, [params.id], (err, result) => {
                if (err)
                  return callback("failed");
                return callback(result)
              });
        });
    }

    deleteUser(params, callback) {
        const c = new commonService()
        var con = c.getConnection()
        con.connect((err) => {
            let sql = "DELETE from ap.users where id = ?;"
            con.query(sql, [params.id], (err, result) => {
                if (err)
                  return callback("failed");
                return callback(result)
              });
        });
    }

    updateUser(params, callback) {
        const c = new commonService()
        var con = c.getConnection()
        con.connect((err) => {
            let sql = "UPDATE ap.users set name=?, date_of_join=? where id = ?;"
            con.query(sql, [params.name, new Date(params.date_of_join), params.id], (err, result) => {
                if (err)
                  return callback("failed");
                return callback(result)
              });
        });
    }
}

