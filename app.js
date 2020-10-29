const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore');

const app = express();

app.use(morgan('dev'));

app.get('/apps', (req,res) => {
    const { sort, genres} = req.query;
    if (sort) {
        if(!['rating','app'].includes(sort)){
            return res.status(400).send('Sort must be one of rating or app.')
        }
    }
    if (genres){
        if(!['Action','Puzzle','Strategy','Casual','Arcade','Card'].includes(genres)){
            return res.status(400).send('Genres must be one of [Action, Puzzle, Strategy, Casual, Arcade, Card].')
        }
    }
    let results = playstore;
    if(genres){
        results=results.filter(app => (
            app.Genres.includes(genres)
        ))
    }
    if(sort === 'app'){
        results = results.sort((a,b) => {
            return a['App'] > b['App'] ? 1 : a['App'] < b['App'] ? -1 : 0 
        })
    }
    if(sort === 'rating'){
        results = results.sort((a,b) =>{
            return parseFloat(a['Rating']) < parseFloat(b['Rating']) ? 1 
                    : parseFloat(a['Rating']) > parseFloat(b['Rating']) ? -1
                    : 0
        })
    }
    res.json(results);
})

app.listen(8000, ()=>{
    console.log('Server is listening on port 8000.')
})

