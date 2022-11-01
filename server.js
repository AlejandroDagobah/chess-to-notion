const express = require('express')
const app = express();
const request = require('request')
const { Client } = require('@notionhq/client')
const cors = require('cors')
const path = require('path')
const router = express.Router()

var bodyParser = require('body-parser');
const { response } = require('express');
var jsonParser = bodyParser.json()

const corsOptions = {
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions)) // Use this after the variable declaration

 app.use(function (req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    next()
})


const PORT = process.env.PORT || 3001;


app.use(express.static(path.join(__dirname, '/')));

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
    
})

app.use('/', router)


app.listen(PORT, function name() {

    console.log("Starting proxy at: " + PORT);
    
})




app.get('/gola', async function (req, res) {

    const playersArray = [] 

    const usernames = ['sami181', 'LDGZCH', 'JMGZCH', 'wilkachimbo', 'Zeratul2022', 'jfyoyu777', 'Luligamer1', 'Samueljanu']

    const currentDate = new Date();

    for (let i = 0; i < usernames.length; i++) {
        const user = usernames[i];

        //url to ask https://api.chess.com/pub/player/{username}/games/{YYYY}/{MM}
        var chessURL = 'https://api.chess.com/pub/player/' + user.toLowerCase() + '/games/' + currentDate.getFullYear() + '/' + ("0" + (currentDate.getMonth() + 1)).slice(-2)

        playersArray.push(chessQuery(chessURL))

    }

    res.json(playersArray)
})



app.post('/', jsonParser, async function (req, res) {

    const game = req.body

    console.log(game)

    if (!game) {
        return res.status(400).send({status: 'failed'})
    }
    res.status(200).send({status: 'recived'})

    try {

        let notionQuery = queryDB(game.url)

        if((await notionQuery).results.length <= 0)
        {
            postInDB(game)
            console.log("SUCCESS")

        }else{

            console.log("UNABLE TO POST BY DUPLICATE")

        }

    } catch (error) {
        console.log(error)
    }
    
})





function chessQuery(chessURL) {


    request({url: chessURL}, (error, response, body) =>{

    if(error || response.statusCode !== 200)
    {
        console.log(response)

        return response.status(500).json({type: 'error', message: error.message})
    }
        return JSON.parse(body)


    })


}








const notion = new Client({auth: "secret_Q9yioL3FNmSl7AsFL8JKwkeoUoUnoV8jsIJHfRxlZIM"});

const databaseid = "7b1833b8cd2844fe880b6c2437910d3f";


async function queryDB(gameUrl) {
    const response = await notion.databases.query({
        database_id: databaseid,
        filter: {
            or: [
                {
                    property: 'Link',
                    url: {
                        contains: gameUrl,
                    },
                }
            ],
        }
    });

    return response
}

async function postInDB(game) {

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
                    
                    start: game.date, //"2022-10-29T11:00:00.000-04:00"
                    time_zone: "America/Guayaquil"
                }
                
            },
            "Termination":{
                select:{
                    
                    name: game.termination

                }
            },
            "Link":{
                url: game.url
            },
            "White Player":{
                select:{
                    
                    name: game.whitePlayer

                }
                
            },
            "Black Player":{
                select:{
                    
                    name: game.blackPlayer

                }
                
            }
        }
    })
    
}


