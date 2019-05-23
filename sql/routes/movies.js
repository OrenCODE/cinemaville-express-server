const mysql = require('mysql2/promise');
const express = require('express');
const router = express.Router();

let pool;
(async function initializePool() {
    pool = await mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'Cinemaville',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
})();


router.get('/', async (req, res) => {
    try {
        const [results, fields] = await pool.execute(`SELECT * FROM Movies`);
        if (results.length) {
            res.send(results)
        } else {
            res
                .status(404)
                .send('there are no movies in the database')
        }
    } catch (e) {
        res
            .status(500)
            .send('something has gone wrong!')
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const [results] = await pool.execute(`SELECT * FROM Movies WHERE id = ?`, [id]);
        if (results.length) {
            res.send(results[0]);
        } else {
            res
                .status(404)
                .send(`movie ${id} doesn't exist`);
        }
    } catch (e) {
        res
            .status(500)
            .send('something has gone wrong!');
    }
});

router.get('/search/:title', async (req, res) => {

    const {title} = req.params;
    try {
        const [results] = await pool.execute(`SELECT * FROM Movies WHERE title = ?`, [title]);
        if (results.length) {
            res.send(results[0]);
        } else {
            res
                .status(404)
                .send(`movie ${title} doesn't exist`);
        }
    } catch (e) {
        res
            .status(500)
            .send('something has gone wrong!');
    }
});

router.post('/', async (req, res) => {
    const {title, genre} = req.body;
    if (!title) {
        res
            .status(400)
            .send('expected title in request');
    }
    const [results] = await pool.execute(`INSERT INTO Movies (title,genre) VALUES ('${title}','${genre}')`);
    if (results.insertId) {
        res.send({id: results.insertId});
    } else {
        res
            .status(500)
            .send('something went wrong');
    }

});

//fix this with if expression
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const [results] = await pool.execute(`DELETE FROM movies WHERE id = ?`, [id]);
        res.send(`movie ${id} has been deleted`);
    } catch (error) {
        res
            .status(404)
            .send(`movie ${id} doesn't exist`);
    }
});

//fix this with if expression
router.put('/:id',
    async (req, res) => {
        const {title, genre} = req.body;
        const {id} = req.params;
        try {
            const [results] = await pool.execute(`UPDATE movies SET title = '${title}' , genre = '${genre}' WHERE id = ?`, [id]);
            res.send(`movie ${req.params.id} has been updated`);
        } catch (error) {
            console.log(error)
        }
    });


module.exports = router;