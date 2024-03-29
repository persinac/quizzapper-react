const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});
app.listen(3000, () => {
    console.log(__dirname);
    console.log(path.join(__dirname, 'build', 'index.html'));
    console.log("server is running on port 3000");
    console.log("Open your browser and hit url 'localhost:3000'");
});