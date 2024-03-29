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
    let punchrulleCount = -1
    try {
        [result] = await pool.promise().query('SELECT remaining FROM punchrullar ORDER BY timetable DESC LIMIT 1')
        console.log(result)
        punchrulleCount = result[0].remaining

    } catch (error) {
        console.error(error)
    }

    if (req.body.text) {
        console.log(req.body.text)
        const [command, ...args] = req.body.text.split(' ')
        console.log(command === 'add')
        console.log(args)

        if (command.toLowerCase() === 'add') {
            if (args[0] && parseInt(args[0]) > 0) {
                console.log('punchrullar add')
                if (punchrulleCount >= 0) {
                    let updateAmount = args[0] ? parseInt(args[0]) : 1
                    const sqlQuery = 'INSERT INTO punchrullar (remaining, timetable) VALUES (?, CURRENT_TIMESTAMP)';
                    update = await pool.promise().query(sqlQuery, [punchrulleCount + updateAmount]);
                    console.log(update)
                    punchrulleCount += updateAmount
                }
            }

        } else if (command.toLowerCase() === 'remove') {
            console.log('punchrullar remove')
            // Check if the updateAmount is a positive number
            if (args[0] && parseInt(args[0]) > 0) {
                // sql query remove 1 rulle
                if (punchrulleCount >= 0) {
                    let updateAmount = parseInt(args[0])
                    if (updateAmount <= punchrulleCount) {
                        const sqlQuery = 'INSERT INTO punchrullar (remaining, timetable) VALUES (?, CURRENT_TIMESTAMP)';
                        update = await pool.promise().query(sqlQuery, [punchrulleCount - updateAmount]);
                        console.log(update)
                        punchrulleCount -= updateAmount
                    } else {
                        console.log('Insufficient punchrullar count')
                    }
                }
            } else {
                console.log('Invalid update amount')
            }
        } else if (command.toLowerCase() === 'box') {
            if (args[0] && parseInt(args[0]) > 0) {
                if (punchrulleCount >= 0) {
                    let updateAmount = args[0] ? parseInt(args[0]) : 1
                    let updateValue = updateAmount * 21
                    const sqlQuery = 'INSERT INTO punchrullar (remaining, timetable) VALUES (?, CURRENT_TIMESTAMP)';
                    update = await pool.promise().query(sqlQuery, [punchrulleCount + updateValue]);
                    console.log(update)
                    punchrulleCount += updateValue
                }
            }
        }
    }

    res.json({
        response_type: 'in_channel',
        text: `Punchrullar: ${punchrulleCount}`
    });

});


app.listen(port, () => {
    console.log(`Server is running on http:localhost:${port}`);
});
  