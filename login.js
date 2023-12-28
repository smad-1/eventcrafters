const conn = require('./connection')
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();


class user 
{
    static curr_user
    static curr_name
}

const app = express();
app.use("/assets",express.static("assets"));
app.use(express.json())
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

    conn.query("select user_id, user_name from user where email = ? and user_pass = ?", [username,password],function(error,results,fields){
        if(results.length > 0){
            //res.redirect("/views/welcome.html")
            user.curr_user = results[0].user_id
            user.curr_name = results[0].user_name
            console.log('User ID:', user.curr_user);
            res.redirect("/views/welcome.html"+`?userID=${user.curr_user}&username=${user.curr_name}`);

            
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
    var email = req.body.email;
    var password = req.body.password;

    // check if already exists
    conn.query("select * from user where user_name = ? and user_pass = ?", [username,password],function(error,results,fields){
        if(results.length > 0){
            res.redirect("/views/registration.html");
            console.log("User already exists.");
        }else{
        // Insert the user registration data into the MySQL table
        conn.query('INSERT INTO user (user_name, email, user_pass) VALUES (?, ?, ?)', [username, email, password], function (error, results, fields) {
        if (error) {
            console.error('Registration failed:', error);
            //res.redirect('/views/registration.html'); // Redirect back to the registration page
        } else {
            conn.query("select user_id from user where user_name = ? and user_pass = ?", [username,password],function(error,results,fields){
                if(results.length > 0){
                    //res.redirect("/views/welcome.html")
                    user.curr_user = results[0].user_id
                    console.log('User ID:', user.curr_user);

                    
                }else{
                    res.redirect("/");
                }
            });
            res.redirect("/views/index.html"); // Redirect to a welcome page or login page  
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
  
  app.get('/views/showlots.html', (req, res) => {
    res.sendFile(__dirname + '/views/showlots.html'); //ekhane cng
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
  app.get('/views/services.html', (req, res) => {
    res.sendFile(__dirname + '/views/services.html');
  }); 
  app.get('/views/mylots.html', (req, res) => {
    res.sendFile(__dirname + '/views/mylots.html');
  }); 
  app.get('/views/mybookings.html', (req, res) => {
    res.sendFile(__dirname + '/views/mybookings.html');
  }); 
  app.get('/views/myrequests.html', (req, res) => {
    res.sendFile(__dirname + '/views/myrequests.html');
  });
  app.get('/views/Payment.html', (req, res) => {
    res.sendFile(__dirname + '/views/Payment.html');
  });

//set app port

function getUsername(id)
{
  const query = 'select user_name from user where user_ID = ?';
  conn.query(query, [id],function(error,results,fields){
    if(results.length > 0){
        //res.redirect("/views/welcome.html")
        user.curr_name = results[0].user_name;  
    }else{
       console.log("mistake");
    }
  });
}

app.get('/lots', (req, res) => {
  const { userID, price, capacity, area } = req.query;

  console.log(userID + capacity + area);
  var descPrice, descCapacity;
  if(price == false) descPrice = 'ASC';
  else descPrice = 'DESC';

  if(capacity == false) descCapacity = 'ASC';
  else descCapacity = 'DESC';

  let orderbyclause = `capacity ${descCapacity}`;

  var query;
  if(area) query = `SELECT * FROM rentlots where userID != ? AND area = '${area}' group by userID, lotID, area order by capacity ${descCapacity}`;
  else query = `SELECT * FROM rentlots where userID != ? group by userID, lotID, area order by capacity ${descCapacity} `;

    // Fetch data from the database
    conn.query(query, [userID], (err, results) => {
      if (err) throw err;
      console.log(results);
      res.json(results);
    });
  });

  app.get('/mylots', (req, res) => {
    const { userID } = req.query;
    // Fetch data from the database
    const query = 'SELECT * FROM rentlots where userID = ? group by userID, lotID';
    conn.query(query, [userID], (err, results) => {
      if (err) throw err;
      console.log(results);
      res.json(results);
    });
  });
  
  app.get('/options', (req, res) => {
    const { userID, lotID } = req.query;
  
    const query = 'select lotID, activity from lot_activity WHERE userID = ? AND lotID = ?';
    conn.query(query, [userID, lotID], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const options = results || [];
      console.log("options are: ");
      console.log(options);
      res.json(options);
    });
  });

  app.get('/mybookings', (req, res) => {
    const { userID } = req.query;
    // Fetch data from the database
    const query = 'SELECT distinct reservationID, reservations.lotID as lot, customerID, reservations.userID as owner, eventDate, activityID, startTime, endTime, catering, decor, Numberofpeople, rentlots.Phone_no, rentlots.Email, state FROM reservations, rentlots WHERE reservations.userID = rentlots.userID AND rentlots.lotID = reservations.lotID AND customerID = ?';
    conn.query(query, [userID], (err, results) => {
      if (err) throw err;
      console.log(results);
      res.json(results);
    });
  });

  app.get('/myrequests', (req, res) => {
    const { userID } = req.query;
    // Fetch data from the database
    const query = 'SELECT distinct reservationID, reservations.lotID as lot, customerID, reservations.userID as owner, eventDate, activityID, startTime, endTime, catering, decor, Numberofpeople, reservations.Phone_no, reservations.Email, state FROM reservations, rentlots WHERE reservations.userID = rentlots.userID AND rentlots.lotID = reservations.lotID AND reservations.userID = ?';
    conn.query(query, [userID], (err, results) => {
      if (err) throw err;
      console.log(results);
      res.json(results);
    });
  });

  app.get('/getname', (req, res) => {
    const { userID } = req.query;
  
    const query = 'select user_name from user WHERE user_id = ?';
    conn.query(query, [userID], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const options = results || [];
      console.log("options are: ");
      console.log(options);
      res.json(options);
    });
  });

  app.get('/updatetoApproved', (req, res) => {
    const { reservationID } = req.query;
    const query = 'update reservations set state = "approved" where reservationID = ?';
    conn.query(query, [reservationID], (err, results) => {
        if(err) throw err;
        else console.log("Updated successfully.");
    });
 });

 app.get('/getFeedback', (req, res) => {
  const { ownerID, lotID } = req.query;
    // Fetch data from the database
    conn.query('SELECT * FROM feedback where ownerID = ? AND lotID = ?', [ownerID, lotID], (err, results) => {
      if (err) throw err;
      console.log(results);
      res.json(results);
    });
  });

 app.post('/payment', encoder, function (req, res) {
    
    console.log("ashe?");

    //console.log(amount + " " +name + " " +addr + " " +phone_no + " " +req.body.lot-id + " ");
    res.redirect("/views/welcome.html");

    /*const query = 'insert into payment (reservationID, method, amount, type, name, address, phone_no, lotID, status) values (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    conn.query(query, [resID, method, amount, type, name, addr, phone_no, req.body.lot-id, status ]), function (error, results, fields)
    {
        if(error) throw error;
        else console.log("ok");
    }*/
 });

  

 app.post('/feedback', encoder, function (req, res) {


    if(req.body.rating== null || req.body.ownerID == null  ||  req.body.lotID == null || req.body.customerID == null || req.body.description==null)
    {
        //res.send("done");
        res.redirect(`/views/welcome.html?userID=${user.curr_user}&username=${user.curr_name}`);
        res.end();
    }
    else 
    {
        console.log(req.body.rating + " " + req.body.ownerID + " " + req.body.lotID + " " + req.body.customerID + " " + req.body.description)
        user.curr_user = req.body.customerID
        const query = 'select user_name from user where user_ID = ?';
        conn.query(query, [user.curr_user],function(error,results,fields){
          if(results.length > 0){
              //res.redirect("/views/welcome.html")
              user.curr_name = results[0].user_name;  
          }else{
             console.log("mistake");
          }
        });
        query = 'insert into feedback (customerID, lotID, ownerID, stars, description) values (?, ?, ?, ?, ?)';
        conn.query(query, [req.body.customerID, req.body.lotID, req.body.ownerID, req.body.rating, req.body.description ]), function (error, results, fields)
        {
            if(error) throw error;
            else console.log("ok");
        }
    }
      
    
 });
  

app.post('/rentplace', encoder, function (req, res) {
    var fName = req.body.first_name
    var lName = req.body.last_name
    var email = req.body.email
    var phone_no = req.body.number
    var lotname = req.body.lotname
    var capacity = req.body.capacity
    var decor = req.body.decor
    var addr = req.body.address
    var info = req.body.info
    var activityList = req.body.activity;
    var area = req.body.area

    var lotid = 0;

    let date = new Date();

    console.log("MySQL datetime - " +
            date.toISOString().split('T')[0] + ' '
            + date.toTimeString().split(' ')[0]);
    
    conn.query("select lotID from rentlots where userID = ? ORDER BY createdOn DESC", [user.curr_user], function (error, results, fields) {
        if (results.length > 0) {
            lotid = results[0].lotID;
            console.log("lotid in res>0: " + lotid);
        }
    })

    // check if already exists
    for (let i = 0; i < activityList.length; i++) {
        console.log(activityList[i] + " " + user.curr_user)
        var uid = user.curr_user
        if (activityList[i] != undefined || activityList[i] != 'null') {
            
            conn.query("select userID, lotID, events from rentlots where userID = ? and lotID = ? and events = ?", [user.curr_user, lotid, activityList[i]], function (error, results, fields) {
                if (results.length > 0) {
                    //res.redirect("/views/welcome.html");
                    console.log("User already exists.");
                } else {
                    console.log("main lotid: " + lotid+1);
                    // Insert the user registration data into the MySQL table
                    if(activityList[i] != "null")
                    {
                    conn.query('INSERT INTO rentlots (userID, lotID, First_name, Last_name, Email, Phone_no, Lot_Name, Capacity, events, Area, Address, Extra_info, createdOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [uid, lotid+1, fName, lName, email, phone_no, lotname, capacity, activityList[i], area, addr, info, date], function (error, results, fields) {
                            if (error) {
                                console.error('Submission failed:', error);
                                //res.redirect('/views/rentplace.html'); // Redirect back to the registration page
                            } else {
                                console.log("lotid in else : " + lotid+1);
                                conn.query('INSERT INTO lot_activity (userID, lotID, activity) VALUES (?, ?, ?)',
                                    [uid, lotid+1, activityList[i]], function (error, results, fields) {
                                        if (error) {
                                            console.error('Activity failed:', error);
                                            //res.redirect('/views/rentplace.html'); // Redirect back to the registration page
                                        } else {
                                            //res.redirect('/views/welcome.html'); // Redirect to a welcome page or login page
                                        }


                                    });
                                //res.redirect('/views/welcome.html'); // Redirect to a welcome page or login page
                            }

                            //res.end();
                        });
                      }
                

                }
            });
        }
    }
    res.redirect("/views/welcome.html"+`?userID=${user.curr_user}&username=${user.curr_name}`);
    res.end();

});



app.post('/bookplace', encoder, function (req, res) {
    

    // Retrieve values
    var ownerID = req.body.owner;
    var lotID = req.body.lot;
    var actID = req.body.activity;

    var fName = req.body.first_name
    var lName = req.body.last_name
    var email = req.body.email
    var phone_no = req.body.number
    var noofpeople = req.body.capacity
    var decor = req.body.decor
    var catering = req.body.catering
    var resDate = req.body.date
    var sTime = req.body.stime
    var eTime = req.body.etime
    var approved = 0

    let date = new Date();

    
     
    console.log("MySQL datetime - " +
            date.toISOString().split('T')[0] + ' '
            + date.toTimeString().split(' ')[0]);
    
    //console.log(fName + " " + lName + " " + email + " " + phone_no + " " + lotID + " " + noofpeople + " " + decor + " " + catering+ " " + resDate+ " " + actID + " " + ownerID+ " " +sTime+ " " +eTime);
    
    

    const query = 'INSERT INTO reservations (customerID, userID, lotID, activityID, First_name, Last_name, Email, Phone_no, Numberofpeople, resTime, eventDate, startTime, endTime, catering, decor, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    conn.query(query, [user.curr_user, ownerID, lotID, actID, fName, lName, email, phone_no, noofpeople, date, resDate, sTime, eTime, catering, decor, "requested" ], (error, results) => 
    {
        if(error)
        {
            console.log("Submission failed: " + error);
        }
        else console.log("Successful submission");
    });

    res.redirect("/views/welcome.html"+`?userID=${user.curr_user}&username=${user.curr_name}`);

    res.end();

});

app.listen(5005);

