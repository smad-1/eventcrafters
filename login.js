const conn = require('./connection')
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();



const app = express();
app.use("/assets",express.static("assets"));

app.use(bodyParser.urlencoded({ 
    extended: true 
 }));

//connect to db
conn.connect(function(error){
    if(error) throw error
    else console.log("connected to database successfully");
})


app.get("/",function(req,res){
    res.sendFile(__dirname + "/views/index.html");
})

app.post("/login",encoder,function(req,res){
    var username= req.body.username;
    var password= req.body.password;

    conn.query("select * from user where user_name = ? and user_pass = ?", [username,password],function(error,results,fields){
        if(results.length > 0){
            res.redirect("/views/welcome.html")
        }else{
            res.redirect("/");
        }
        res.end();
    })
})

//when login successful
app.get("/views/welcome.html",function(req,res){
    res.sendFile(__dirname + "/views/welcome.html")
})

// Serve the registration page
app.get('/views/registration.html', function(req, res) {
    res.sendFile(__dirname + '/views/registration.html');
});

app.get('/views/index.html', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/register', encoder, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // check if already exists
    conn.query("select * from user where user_name = ? and user_pass = ?", [username,password],function(error,results,fields){
        if(results.length > 0){
            res.redirect("/views/registration.html");
            console.log("User already exists.");
        }else{
        // Insert the user registration data into the MySQL table
        conn.query('INSERT INTO user (user_name, user_pass) VALUES (?, ?)', [username, password], function (error, results, fields) {
        if (error) {
            console.error('Registration failed:', error);
            res.redirect('/views/registration.html'); // Redirect back to the registration page
        } else {
            res.redirect('/views/welcome.html'); // Redirect to a welcome page or login page
        }
        res.end();
        });
        }
    });
});

// for welcome page

app.get('/views/rentplace.html', (req, res) => {
    res.sendFile(__dirname + '/views/rentplace.html');
  });
  
  app.get('/views/bookplace.html', (req, res) => {
    res.sendFile(__dirname + '/views/bookplace.html');
  }); 


//set app port

app.listen(5000);
 