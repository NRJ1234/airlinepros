var mysql = require('mysql');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var config = require('../config/config_properties.json')
const secret = config.secret;

module.exports = class Common {

    sendMail(to, params) {
        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'test126578943@gmail.com',
            pass: 'q1w2e3r4t5y6@'
        }
        });
        var mailOptions = {
            from: 'test126578943@gmail.com',
            to: to,
            subject: 'Accout Created',
            text: 'UserName:' + params.username + "\n" + "Password:" + params.password 
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
            } 
            else {
              return success
            }
        });
    }

    getConnection() {
        var con = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password
        })
        return con
    }

    encrypt(text) {
        var mykey = crypto.createCipher('aes-128-cbc', secret);
        var mystr = mykey.update(text, 'utf8', 'hex')
        mystr += mykey.final('hex');
        return mystr
    }

    decrypt(text) {
        var mykey = crypto.createDecipher('aes-128-cbc', secret);
        var mystr = mykey.update(text, 'hex', 'utf8')
        mystr += mykey.final('utf8');
        return mystr
    }
}