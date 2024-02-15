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
            console.log('punchrullar add')
            // sql query add 1 rulle
            // const remainingChange = action === 'add' ? currentRemaining + 1 : Math.max(0, currentRemaining - 1);
            if (punchrulleCount >= 0) {
                let updateAmount = args[0] ? parseInt(args[0]) : 1
                const sqlQuery = 'INSERT INTO punchrullar (remaining, timetable) VALUES (?, CURRENT_TIMESTAMP)';
                update = await pool.promise().query(sqlQuery, [punchrulleCount + updateAmount]);
                console.log(update)
                punchrulleCount += updateAmount
            }
            

        } else if (command.toLowerCase() === 'remove') {
            console.log('punchrullar remove')
            // sql query remove 1 rulle
            if (punchrulleCount >= 0) {
                let updateAmount = args[0] ? parseInt(args[0]) : 1
                const sqlQuery = 'INSERT INTO punchrullar (remaining, timetable) VALUES (?, CURRENT_TIMESTAMP)';
                update = await pool.promise().query(sqlQuery, [punchrulleCount - updateAmount]);
                console.log(update)
                punchrulleCount -= updateAmount
            }
        }
    }

    res.json({
        response_type: 'in_channel',
        text: `Punchrullar: ${punchrulleCount}`
    })

})


app.listen(port, () => {
    console.log(`Server is running on http:localhost:${port}`);
  });
  