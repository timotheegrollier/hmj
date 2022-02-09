const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Spleef = require('./models/Spleef');
const Best = require('./models/Best')

require('dotenv').config()

const app = express()

const DBUSER = process.env.DBUSER

app.use(express.json())


app.use(express.static(path.join(__dirname, './client/build/')))

mongoose.connect("mongodb+srv://" + DBUSER + "@cluster0.zvv7c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});




app.post('/api/spleef', (req,res,next)=>{
    const spleef = new Spleef({
        number:1,
        lastSpleef:new Date
    })
    spleef.save()
        .then(() => res.status(201).json({ message: "Le premier" }))
        .catch((error) => { res.status(400).json(error) })
})

app.put('/api/spleef/:id', (req, res, next) => {
    Spleef.updateOne({_id:req.params.id }, {...req.body,_id:req.params.id})
        .then(() => res.status(200).json({ message: "Un de plus" }))
        .catch((error) => { res.status(400).json(error) })
})

app.delete('/api/reset',(req,res,next)=>{
    Spleef.deleteMany()
    .then(()=>res.json("Restart"))
    .catch(error=>res.json(error))
})


app.get('/api/number', (req, res, next) => {
    Spleef.find()
        .then(spleef => res.status(200).json(spleef))
        .catch(error => res.status(400).json(error))
})

app.post('/api/leaderboard',(req,res,next)=>{
    const best = new Best({
        ...req.body
    })
    best.save()
    .then(()=>res.status(201).json({best:best}))
    .catch((error)=>res.status(400).json({error}))
})

app.put('/api/leaderboard/:id',(req,res,next)=>{
    Best.updateOne({ _id: req.params.id}, { number:req.body.number, _id: req.params.id})
    .then(()=>res.status(200).json({message:"Nouveau record !"}))
    .catch(error => res.status(400).json(error))
})

app.get('/api/leaderboard',(req,res,next)=>{
    Best.find()
    .then(bests=>res.status(200).json(bests))
    .catch(error=>res.status(400).json(error))
})

app.delete('/api/leaderboard', (req, res, next) => {
    Best.deleteMany()
        .then(() => res.json('ok'))
        .catch(error => res.json(error))
})


app.get('*', function (req, res, next) {
    res.sendFile(path.join(__dirname, './client/build/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})


module.exports = app;