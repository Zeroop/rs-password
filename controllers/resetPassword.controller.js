const model = require("../models/dbPostgreSQL");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const passwordResetKey = require("../key/passwordResetKey");

var db = new model();

const rand =jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60), data: Math.floor(Math.random() * 100 + 54)}, passwordResetKey);

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emailtestbbcv@gmail.com",
    pass: "calmdown",
  },
});

function sendEmail(req, res) {
  let entity = { ...req.body };
  db.checkExistByEmail(entity, function (result) {
    if (result) {
      res.status(400).send({
        message: "Not exist email",
      });
    } else {
      host = req.get("host");
      link = "http://" + req.get("host") + "/verify?id=" + rand;
      mailOptions = {
        to: req.query.email,
        subject: "Please confirm your Email account",
        html:
          "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
          link +
          ">Click here to verify</a>",
      };
      transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
          res.status(400).send("error");
        } else {
          res.status(200).send("sent");
        }
      });
    }
  });
}

function verify(req, res) {
  if (req.protocol + "://" + req.get("host") == "http://" + host) {
    if (req.query.id == rand) {
      res.status(200).send("Email " + mailOptions.to + " is been Successfully verified");
    } else {
      res.status(400).send({
        message: "Bad Request"
      });
    }
  } else {
    res.status(400).send({
      message: "Request is from unknown source"
    });
  }
}

function resetPassword(req, res) {
  var hash = bcrypt.hashSync(req.body.password, 8);
  const entity = {...req.body}
  entity.password = hash;
  db.resetPassword(entity,function (result) {
    console.log(result)
    if(result){
      res.status(200).send({
        message : 'succesfully update passsword '
      })
    }else{
      res.status(400).send({
        message : 'succesfully reset passsword '
      })
    }
  })
  }

module.exports = { sendEmail, verify, resetPassword };
