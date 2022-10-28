const express = require('express')
const app = express();
const { Client } = require('@notionhq/client')
const cors = require('cors')
const path = require('path')
const router = express.Router()

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.use(cors());

const PORT = 4000;
const HOST = "localhost"

app.use(express.static(path.join(__dirname, 'public')));

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
    
})

app.use('/', router)


app.listen(PORT, HOST, function name() {

    console.log("Starting proxy at " + HOST + ":" + PORT);
    
})




app.get('/info', function (req, res) {

    res.status(200).json({info: 'Hey 🧨'})
    
})


const notion = new Client({auth: "secret_Q9yioL3FNmSl7AsFL8JKwkeoUoUnoV8jsIJHfRxlZIM"});

const databaseid = "7b1833b8cd2844fe880b6c2437910d3f";



app.post('/', jsonParser, async function (req, res) {

/*
    const gameString = req.body.gameString
    let winnerPlayer = req.body.winnerPlayer
    let defeatedPlayer = req.body.defeatedPlayer
    let gameDate = req.body.gameDate
    let gameTime = req.body.gameTime
    let termination = req.body.termination
    let url = req.body.url
*/
    const gameString = req.body

    console.log(gameString)

    if (!gameString) {

        return res.status(400).send({status: 'failed'})
        
    }
    res.status(200).send({status: 'recived'})

    let winnerPlayer = req.body.winnerPlayer
    let defeatedPlayer = req.body.defeatedPlayer
    let gameDate = req.body.gameDate
    let gameTime = req.body.gameTime
    let termination = req.body.termination
    let url = req.body.url
    try {
        
        const response = await notion.pages.create({
            parent: {database_id: databaseid},
            properties:{
                "Game":{
                    title:[
                        {
                            text:{
                                content: gameString.value
                            }
                        }
                    ]
                },
                "Winner":{
                    select:{
                        
                        name: 'sami'

                    }
                    
                },
                "Defeated":{
                    select:{
                        
                        name: 'sami'

                    }
                    
                },
                "Date":{

                    date:{
                        
                        start: "2022-10-29T11:00:00.000-04:00"

                    }
                    
                },
                "Termination":{
                    rich_text:[
                        {
                            text:{
                                content: '🎃'
                            }
                        }
                    ]
                },
                "Link":{
                    url:'https://www.chess.com/game/live/60616746903'
                }
            }
        })

        console.log("SUCCESS")

    } catch (error) {
        console.log(error)
    }
    
})
