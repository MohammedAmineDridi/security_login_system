var express = require('express');
var router = express.Router();


var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aminedridi11",
  database: "login" // table = users .
});


// send mail function 


// node mailer include
var nodemailer = require('nodemailer');

function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 6000);
  });
}



// sleep (delay) function 

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function send_mail(from,Subject,destinataire,text_mail){

  var fs = require('fs');

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({

    service:'gmail',
    auth:{
      user:'amindridi447@gmail.com',
      pass:'Kaki1112'
    }

  });

  var mailoptions = {
    from:from,
    to:destinataire,
    subject:Subject,
    text:text_mail,
    attachments: [{   // stream as an attachment
      filename: 'img_user2.jpg',
      content: fs.createReadStream('img_user2.jpg')
  }]
    
  };

  transporter.sendMail(mailoptions,function(error,info){

    if(error){
      console.log(error);
      var err = "verifier votre connexion";
      console.log(err);
    }
    else{
      var yes = "email sent to "+destinataire.toString();

      console.log("----> email sent to " + destinataire ) ;

      console.log(yes);
    }

  });
}



let {PythonShell} = require('python-shell') ;

function run_pyhton_script(){

  PythonShell.run('script_photo.py', null, function (err) {
    if (err) throw err;
    console.log(' finished runing script python ');
  });

}


async function f1(){
  await resolveAfter2Seconds(run_pyhton_script())  ;

  send_mail("amindridi447@gmail.com","user unkown","amindridi447@gmail.com","login failed detected by this user ") ;
}



function insert_alert(alert){


  var insert_alert = "INSERT INTO alert (alert) VALUES ('"+alert+"')";

  console.log(insert_alert);
  
  con.query(insert_alert, function (err, result, fields) {

    if(err){
      console.log(err);
    }
    else{
      console.log(" alert added successfly ") ;
    }


  });
}


function delete_all_alerts(){
  var delete_alerts = "DELETE from alert";
  console.log(delete_alerts);
  con.query(delete_alerts, function (err, result, fields) {

    if(err){
      console.log(err);
    }
    else{
      console.log(" all alerts are deleted ") ;
    }
  });
}




/* GET home page. */
router.get('/', function(req, res, next) {
  run_pyhton_script();
  res.json("hello");
});

router.get('/delete_all', function(req, res, next) {
  delete_all_alerts() ;
  res.send("deleted_all_alerts");
});


/* GET home page. */
router.get('/number_failure', function(req, res, next) {


  var number_failure = "select count(*) from alert";
  console.log(number_failure);
  con.query(number_failure, function (err, result, fields) {

    var number_of_failure = result[0]['count(*)'] ;
    console.log(" ******** " + number_of_failure + " *******");

    if(err){
      console.log(err);
    }
    else{
      console.log(result) ;

      if( number_of_failure > 2 ){
          // run scipt python here .

          console.log(" number of failure detected !!!");
          /*
           run_pyhton_script();
           send_mail("amindridi447@gmail.com","user unkown","amindridi447@gmail.com","login failed detected by this user ") ;
      */
          }
      else{

        console.log("number of failure = " + number_of_failure + " < 3 ") ;
      }

    }

    res.json(number_of_failure );
  });

});


// index/login_page

router.get('/login_page', function(req, res, next) {

  res.render('login.twig');
});


//index/login

router.post('/login', function(req, res, next) {
  
var matricule = req.body.matricule ;
var password_user = req.body.password ;


let user = "SELECT * FROM users WHERE matricule = '"+matricule+"' AND password_user = '" + password_user+"' ";
console.log(user);

con.query(user, function (err, result, fields) {
  if (err) {
    //console.log(err);
    console.log("error mysql ");
  }
  else{
    if(result==""){
      //alert("email or password_user incorrect !")
      console.log("no user !");
        var alert = "detected";
        insert_alert(alert) ;
        // check number of failure .
        
        var delete_alerts = "select count(*) from alert";
        console.log(delete_alerts);
        con.query(delete_alerts, function (err, result, fields) {
      
          var number_of_failure = result[0]['count(*)'] ;
      
          if(err){
            console.log(err);
          }
          else{
            console.log("number of failure = " + number_of_failure) ;
      
            if( number_of_failure > 2 ){
                // run scipt python here .
                
                console.log(" number of failure detected !!!");

                 f1();
                 sleep(6000);
                 
                 // delete_all_alerts() ;

                 // delete all with arduino ..



              // res.redirect("/number_failure") ;
            }
            else{
              console.log("number of failure = " + number_of_failure + " < 3  ") ;
            }
          }
        });

        // python + email
        res.redirect("/login_page");
    }
    else{
      console.log(result);

      console.log(" login correct : matricule = " + result[0]['matricule']
      + " password_user = " + result[0]['password_user']);
      
      
      // delete_all_alerts();

      // delete all with nodemcu .

      res.render("main_page.twig");
    }
     
  }
});


});


module.exports = router;
