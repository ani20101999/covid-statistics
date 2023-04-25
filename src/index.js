const express = require('express')
const app = express()
const { connection } = require('./connector')
const { data } = require('./data')
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const refreshAll = async () => {
    await connection.deleteMany({})
    // console.log(connection)
    await connection.insertMany(data)
}
refreshAll()


app.get("/totalRecovered", async (req, res) => {
    try {
        const totalrecover = await connection.find().select({ _id: 0, recovered: 1 })
        let totalrecovered = 0;
        for (let i = 0; i < totalrecover.length; i++) {
            totalrecovered += totalrecover[i].recovered;
        }

        const object1 = {
            data: {
                _id: "total",
                recovered: totalrecovered
            }
        }
        res.send(object1)
    }
    catch (err) {
        console.log(err);
    }
})


app.get("/totalActive", async (req, res) => {
    try {
        const totalrecover = await connection.find().select({ _id: 0, infected: 1, recovered: 1 });
        let recovered = 0;
        let infected = 0;

        for (let i = 0; i < totalrecover.length; i++) {
            recovered += totalrecover[i].recovered;
            infected += totalrecover[i].infected;
        }
        let active = infected - recovered;
        const object2 = {
            data: {
                _id: "total",
                active: active
            }
        }
        res.send(object2)
    }
    catch (err) {
        console.log(err);
    }
})


app.get("/totalDeath", async (req, res) => {
    try {
        const totalrecover = await connection.find().select({ _id: 0, death: 1 });

        let totaldeath = 0;
        for (let i = 0; i < totalrecover.length; i++) {
            totaldeath += totalrecover[i].death;
        }

        const object3 = {
            data: {
                _id: "total",
                death: totaldeath
            }
        }
        res.send(object3)
    }
    catch (err) {
        console.log(err);
    }
})

app.get("/hotspotStates", async (req, res) => {
    try {
        const totalrecover = await connection.find().select({ _id: 0, state:1, infected: 1, recovered: 1 });
         let arr=[];
        for (let i = 0; i < totalrecover.length; i++) {
            let recovered = totalrecover[i].recovered;
            let infected = totalrecover[i].infected;
            let hotspot = ((infected - recovered) / infected).toFixed(5);
            if(hotspot>0.1){
                arr.push({state:totalrecover[i].state,rate:hotspot})
            }
        }
        const object4 = {
            data: arr
        }
        res.send(object4)
    }
    catch (err) {
        console.log(err);
    }
})

app.get("/healthyStates", async (req, res) => {
    try {
        const totalrecover = await connection.find().select({ _id: 0, state:1, infected: 1, death:1});
         let arr=[];
        for (let i = 0; i < totalrecover.length; i++) {
            let death = totalrecover[i].death;
            let infected = totalrecover[i].infected;
            let mortalityValue = (death/ infected).toFixed(5);
            if(mortalityValue<0.005){
                arr.push({state:totalrecover[i].state,mortality:mortalityValue})
            }
        }
        const object5 = {
            data: arr
        }
        res.send(object5)
    }
    catch (err) {
        console.log(err);
    }
})



app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;