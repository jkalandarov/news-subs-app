//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res)=> {
  res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res)=> {
  const name = req.body.fname;
  const lastName = req.body.sname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: name,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url = 'https://us20.api.mailchimp.com/3.0/lists/2022afba56';
  const options = {
    method: 'POST',
    auth: 'jkalandarov:6c3bd5b24915a69a843e23fc22885068'
  }
  const request = https.request(url, options, response => {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    }
    else {
      res.sendFile(__dirname + '/failure.html');
    }

    response.on('data', (d) => {
      console.log(JSON.parse(d));
    })
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res)=> {
  res.redirect('/');
});

app.listen(process.env.PORT || port, ()=> console.log(`Server is running on port ${port}`));
//Mailchimp API 6c3bd5b24915a69a843e23fc22885068-us20
//List id 2022afba56
