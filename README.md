# chess-eco-table-memorizer

# Running the application
Run the following command in both the sub directories 

> npm install

Next run the following command application.

> npm run start:local

Now open your browser and go to http://localhost:<PORT>


Create an .env file with following content

```sh
PORT = <PORT>
SESSION_SECRET = <session-secret>
```

-------------------

# Live Demo

The application is deployed on Heroku : https://eco-table-memorizer-roshan.herokuapp.com/


To get all the chess moves in JSON: GET https://eco-table-memorizer-roshan.herokuapp.com/
  
To get the move details of particualr move: GET https://eco-table-memorizer-roshan.herokuapp.com/A00/

To predict the move: GET https://eco-table-memorizer-roshan.herokuapp.com/A00/g4/

Note: Use forward slashes at the end of URL.
