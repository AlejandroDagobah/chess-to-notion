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

    const game = req.body

    console.log(game)

    if (!game) {
        return res.status(400).send({status: 'failed'})
    }
    res.status(200).send({status: 'recived'})

    try {
        
        const response = await notion.pages.create({
            parent: {database_id: databaseid},
            properties:{
                "Game":{
                    title:[
                        {
                            text:{
                                content: game.gameTitle
                            }
                        }
                    ]
                },
                "Winner":{
                    select:{
                        
                        name: game.winnerPlayer

                    }
                    
                },
                "Defeated":{
                    select:{
                        
                        name: game.defeatedPlayer

                    }
                    
                },
                "Date":{

                    date:{
                        
                        start: game.date //"2022-10-29T11:00:00.000-04:00"

                    }
                    
                },
                "Termination":{
                    rich_text:[
                        {
                            text:{
                                content: game.termination
                            }
                        }
                    ]
                },
                "Link":{
                    url: game.url
                }
            }
        })

        console.log("SUCCESS")

    } catch (error) {
        console.log(error)
    }
    
})
