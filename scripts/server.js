const express = require('express');
const request = require('request');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/word/:term', (req, res) => {
    const term = req.params.term;
    const url = `https://od-api-sandbox.oxforddictionaries.com/api/v2/entries/en-gb/${term}`;
    request({ url, headers: { 'app_id': 'YOUR_APP_ID', 'app_key': 'YOUR_APP_KEY' } })
        .pipe(res)
        .on('error', (err) => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
