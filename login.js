const conn = require('./connection')
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();


class user 
{
    static curr_user
}

const app = express();
app.use("/assets",express.static("assets"));
app.use(bodyParser.json())
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

    conn.query("select user_id from user where user_name = ? and user_pass = ?", [username,password],function(error,results,fields){
        if(results.length > 0){
            res.redirect("/views/welcome.html")
            user.curr_user = results[0].user_id
            console.log('User ID:', user.curr_user);
            
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
            conn.query("select user_id from user where user_name = ? and user_pass = ?", [username,password],function(error,results,fields){
                if(results.length > 0){
                    res.redirect("/views/welcome.html")
                    user.curr_user = results[0].user_id
                    console.log('User ID:', user.curr_user);
                    
                }else{
                    res.redirect("/");
                }
            });
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

  app.get('/views/birthday_page.html', (req, res) => {
    res.sendFile(__dirname + '/views/birthday_page.html');
  });
  app.get('/views/decor.html', (req, res) => {
    res.sendFile(__dirname + '/views/decor.html');
  });
  app.get('/views/Payment.html', (req, res) => {
    res.sendFile(__dirname + '/views/Payment.html');
  });

  app.get('/views/feedback.html', (req, res) => {
    res.sendFile(__dirname + '/views/feedback.html');
  }); 

  app.get('/views/aboutus.html', (req, res) => {
    res.sendFile(__dirname + '/views/aboutus.html');
  }); 

//set app port

app.post('/rentplace', encoder, function (req, res) {
    var fName = req.body.first_name
    var lName = req.body.last_name
    var email = req.body.email
    var phone_no = req.body.number
    var lotname = req.body.lotname
    var capacity = req.body.capacity
    var decor = req.body.decor
    var bday = req.body.event[0]
    var wedding = req.body.event[1]
    var picnic = req.body.event[2]
    var addr = req.body.address
    var info = req.body.info
    var firstinserttion = false



    // check if already exists
    for(let i =0; i<3; i++)
    {
        console.log(req.body.event[i] + " " + user.curr_user)
        var uid = user.curr_user
        if(req.body.event[i] != undefined)
        {
        conn.query("select userID, lotID, events from rentlots where userID = ? and lotID = ? and events = ?", [user.curr_user,1,req.body.event[i]],function(error,results,fields){
        if(results.length > 0){
            res.redirect("/views/welcome.html");
            console.log("User already exists.");
        }else{
        // Insert the user registration data into the MySQL table
        conn.query('INSERT INTO rentlots (userID, lotID, First_name, Last_name, Email, Phone_no, Lot_Name, Capacity, events, Address, Extra_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [uid, 1, fName, lName, email, phone_no, lotname, capacity, req.body.event[i], addr, info], function (error, results, fields) {
        if (error) {
            console.error('Submission failed:', error);
            //res.redirect('/views/rentplace.html'); // Redirect back to the registration page
        } else {
            //res.redirect('/views/welcome.html'); // Redirect to a welcome page or login page
        }
    
        res.end();
        });
        /*conn.query('INSERT INTO lot_activity (userID, lotID, activity) VALUES (?, ?, ?)', 
        [uid, 1, req.body.event[i]], function (error, results, fields) {
        if (error) {
            console.error('Activity failed:', error);
            res.redirect('/views/rentplace.html'); // Redirect back to the registration page
        } else {
            res.redirect('/views/welcome.html'); // Redirect to a welcome page or login page
        }
    
        
        });*/
        
     }
        });
}
    }
    res.redirect('/views/welcome.html');
    res.end();

});

app.listen(5004);

