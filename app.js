var express = require('express');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({

    host: 'sql11.freemysqlhosting.net',
    user: 'sql11206886',
    password: 'WYuWBPkK2K',
    database: 'sql11206886'
});
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connection.query('SELECT * from mytable1', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

app.listen(8005,function(){
    console.log('Node server running @ http://localhost:8005')
});


app.use('/node_modules',  express.static(__dirname + '/node_modules'));

app.use('/css',  express.static(__dirname + '/css'));

app.get('/',function(req,res){
    res.sendFile('home.html',{'root': __dirname + '/pages'});
});


app.get('/showSignInPage',function(req,res){
    res.sendFile('signin.html',{'root': __dirname + '/pages'});
});
app.get('/showSignInPageretry',function(req,res){
    res.sendFile('signinretry.html',{'root': __dirname + '/pages'});
});
app.get('/showSignUpPage',function(req,res){
  res.sendFile('signup.html',{'root':__dirname + '/pages'})
});

app.get('/message',function(req,res){
    res.sendFile('message.html',{'root': __dirname + '/pages'});
});

app.get('/loggedin',function(req,res){
    res.sendFile('thing.html',{'root': __dirname + '/pages'});
});


app.post('/myaction', function(req, res) {
	console.log('req.body');
	console.log(req.body);
	var record = {email: req.body.email, pass: req.body.pass};

	connection.query('INSERT INTO mytable1 SET ?', record, function(err,res){
	  	if(err) throw err;
		console.log('Last record insert id:', res.insertId);
		
	});

	res.redirect('/message');

	res.end();
});


app.post('/verifyuser', function(req,res){
	console.log('checking user in database');
	console.log(req.body.pass);
	var selectString = 'SELECT COUNT(email) FROM mytable1 WHERE email="'+req.body.email+'" AND pass="'+req.body.pass+'" ';
	 
	connection.query(selectString, function(err, results) {
		
        console.log(results);
        var string=JSON.stringify(results);
        console.log(string);

        if (string === '[{"COUNT(email)":1}]') {
			res.redirect('/loggedin');
	
	        }
        if (string === '[{"COUNT(email)":0}]')  {
        	res.redirect('/showSignInPageretry');
        	
        }
    });
});
