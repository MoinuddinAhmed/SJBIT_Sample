// create express aap for hello world

const express = require('express');
const app = express();
const ejs = require('ejs');
const mysql = require('mysql2');
const bodyParser = require('body-parser');




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');
app.set("views", __dirname + "/src");


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'sample1'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
}
);


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {
    res.render('signup');

});

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log("Post from HTML/EJS:",username, password);


    connection.query("INSERT INTO login_demo (username, password) VALUES (?, ?)", [username, password], (err, result) => {
        if (err){
            res.json({ message: err });
        }
        else{
            res.redirect('/login');
            
        }
        
    }); 
    }
    
);

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login_post', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log("Post from HTML/EJS:",username, password);

    try{
        connection.query("SELECT * FROM login_demo WHERE username = ? AND password = ?", [username, password], (err, result) => {
            if (err) throw err;
            console.log(result);
            if (result.length > 0) {
                res.redirect('/checksql');
            } else {
                res.json({ message: "error" });
            }
        });
    }
    catch(err){
        console.log(err);
        res.json({ message: "error" });
    }
});



app.get('/checksql', (req, res) => {
    connection.query("SELECT * FROM login_demo", (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            console.log(result);
            res.render('users', {users: result});
        } else {
            res.send('error');
        }
    });
});
        
app.get('/api/courses', (req, res) => {
    res.send([1, 2, 3, 4, 5]);
}
);

app.listen(3000, () => {
    console.log('server is running on port 3000');
});