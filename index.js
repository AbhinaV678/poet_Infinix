import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const API_URL = "https://poetrydb.org/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/app.html');
  });

  app.get("/home", (req, res) => {
    res.sendFile(__dirname + '/app.html');
  });

app.post("/get-poem", async (req, res) => {
  var search = req.body["searchItem"];
  var searchBody = search.trim();
  var result1,result2;
  var finalResultant;
  var result1valid = false;
  var result2valid = false;
  
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if(format.test(searchBody) || searchBody===""){
      return res.render("displayPoem.ejs", { poem: "Invalid search query."});
  }

  try {
      try {
        result1 = await axios.get(API_URL +"author/"+searchBody+"/author,title,lines.json");
        if(result1.data[0].title){
          result1valid= true;
        }
      } catch (error) {
        console.log(error.message);
      }

      try {
        result2 = await axios.get(API_URL +"title/"+searchBody+"/author,title,lines.json");
        if(result2.data[0].title){
          result2valid= true;
        }
      } catch (error) {
        console.log(error.message);
      }

    if(result1valid || result2valid){
      if(result1valid){
        finalResultant = result1.data;
      }else{
        finalResultant = result2.data;
      }

    }else{
      finalResultant = "Poem not found.";
    }
    res.render("displayPoem.ejs", { poem:  finalResultant});
  } 

  catch (error) {
    res.status(500).json({ message: "Error encountered while fetching poem." });
  }
});

let port = process.env.PORT;
if(port==null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully.");
});