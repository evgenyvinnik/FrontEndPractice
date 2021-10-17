const express = require("express");
const bodyParser = require("body-parser");

const users = require("./users");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/search/(:query)?", (req, res) => {
  const search = new RegExp(req.params["query"], "gi");
  console.log(users);
  const matches = search ? users.filter(user => user.name.match(search)) : [];
  res.send(matches);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
