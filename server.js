require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
const port = process.env.PORT || 3001

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.post('/punchrullar', async (req, res) => {
    console.log(req)
    if (req.body.text) {
        console.log(req.body.text)
        const [command, ...args] = req.body.text.split(' ')
        console.log(command)
        console.log(args)

        if (command.toLowercase === 'add') {
            console.log('punchrullar add')
            // sql query add 1 rulle
        } else if (command.toLowercase === 'remove') {
            console.log('punchrullar remove')
            // sql query remove 1 rulle
        }
    }
    // const moj = req.body.text.split(' ')
    // console.log(moj)

    //     if (moj[0] === 'punchrullar' && moj[1] === 'count') {
    //         console.log('punchrullar count')
    //     }

    try {

        const [result] = await pool.promise().query('SELECT remaining FROM punchrullar ORDER BY timetable DESC LIMIT 1')

        console.log(result)
        res.json(result)
    } catch (error) {
        console.error(error)
    }

})


app.listen(port, () => {
    console.log(`Server is running on http:localhost:${port}`);
  });
  