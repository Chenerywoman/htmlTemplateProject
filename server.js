const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const axios = require('axios');

// Finding  the view folder directory
const viewsPath = path.join(__dirname, "/views");
const partialPath = path.join(__dirname, "views/inc");

hbs.registerPartials(partialPath)

// setting node.js view engine to use handlebars(hbs)files
app.set('view engine', 'hbs');

//Setting the Views from HBS to come from our views path variable
app.set('views', viewsPath);

//Finding the public folder directory
const publicDirectory = path.join(__dirname, '/public');

//Setting express to use the static files from public Directory, files like CSS or JS
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// this is the path on the browser
app.get("/", async (req, res) => {

    const myApi = await axios.get("https://api.chucknorris.io/jokes/random")

    console.log(myApi.data)
// this is the name of the file in the views folder
    res.render("index", {
        joke: myApi.data.value // joke is now a key with the value, myApi.data is an object and we are accesing the value of ir
    });
});

app.get("/searchJoke", (req, res) => {
    res.render("searchJoke");
});

app.get("/displayJoke", async (req, res) => {

    console.log(req.query) // access variable that are on your URl

//Method GET - accessing the variable jokeCategory from URL
    console.log( `in displayJoke ${req.query.jokeCategory}` )
    const category = req.query.jokeCategory;

    try {
        const myApi = await axios.get(`https://api.chucknorris.io/jokes/random?category=${category}`)
        console.log(myApi.data);


        res.render("displayJoke",{
            joke: myApi.data.value
    });
    } catch (error) {
        res.render("errorPage")
    }
});

app.get("*", (req, res) => {
    res.send("<h1> Sorry that page does not exist </h1>");
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000")
});