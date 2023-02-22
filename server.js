const express = require('express')
const app = express();
const PORT = process.env.PORT || 3001;

const request = require('request')
const bodyParser = require('body-parser');
const { response } = require('express');
const cors = require('cors')
const path = require('path')
const { Client } = require('@notionhq/client')
const fetch = require('node-fetch');	//npm install node-fetch

const jsonParser = bodyParser.json()
const router = express.Router()

const corsOptions = {
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

app.use(cors(corsOptions)) // Use this after the variable declaration
app.use('/', router)
app.use(express.static(path.join(__dirname, '/')));

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
    
})

app.listen(PORT, function name() {
    console.log("Starting proxy at: " + PORT);
})


let usernames

var globalArray = []

const notion = new Client({auth: "secret_Q9yioL3FNmSl7AsFL8JKwkeoUoUnoV8jsIJHfRxlZIM"});

var databaseid
const currentDate = new Date();

function subtractHours(date, hours){

    date.setHours(date.getHours() - hours);

    return date;
}


app.get('/info', async function (req, res) {

    cleanedArray = arrUnique(globalArray)
    res.status(200).json({info: cleanedArray})
    console.log(cleanedArray);

    globalArray = []
})

app.post('/databaseID', jsonParser, async function(req, res) {
    const {parcel, isHighElo} = req.body

    if(!parcel){
        res.status(200).send({status: 'failed'})        

    }else{
        res.status(200).send({status: 'recived'})
        databaseid = parcel

        if (isHighElo == true){
            usernames = ['sami181', 'LDGZCH', 'JMGZCH', 'wilkachimbo']
        
        }else{
            usernames = ['Zeratul2022', 'JFyoyu777', 'Luligamer1', 'Samueljanu']
        }

        console.log("GROUP HIGH", isHighElo, usernames);


        
    }
    
})

app.post('/info', jsonParser, async function (req, res){
    const {parcel} = req.body

    if(!parcel)
    {
        res.status(200).send({status: 'failed'})        
    }
    res.status(200).send({status: 'recived'})

    chessQuery(parcel)


})




function chessQuery(chessURL) {

    request({url: chessURL}, (error, response, body) =>{

    if(error || response.statusCode !== 200)
    {
        return console.log(error)
    }
        var chessUser = JSON.parse(body)
        gamesFilter(chessUser)

    })


}


async function gamesFilter(userJson) {
    let gamesArray = []

    let chessGames = userJson.games;
    for (let i = 0; i < chessGames.length; i++) {
        const currentGame = chessGames[i];

        const black = currentGame.black
        const white = currentGame.white

        let pgnArray = currentGame.pgn.split('\n') 

        let id = currentGame.url.substring(32, currentGame.url.length) 
        let date = pgnArray[2].substring(7, pgnArray[2].length - 2)
        let time = pgnArray[19].substring(10, pgnArray[19].length - 2)

        var termination = pgnArray[16].substring(14, pgnArray[16].length - 2)
        let terminationNoUser = termination.split(" ");
        let userOfTermination = terminationNoUser.shift()

        const uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

        termination = uppercaseWords(terminationNoUser.join(" ").toString())
        
        var gmt5Date = subtractHours(new Date(date + ' ' + time + ' GMT-5'), 10)
        

        if(isNaN(gmt5Date) == false){


            
            const gameJson = {
                gameId: id,
                gameTitle: '🏆',
                winnerPlayer:'',
                defeatedPlayer: '',
                date: gmt5Date.toISOString(), //no sobreescribir en notion las que ya estan hechas
                termination: termination, // eliminar la primera palabra de la razón de la victoria ej: 'won by checkmate'
                url: currentGame.url,
                whitePlayer: '',
                blackPlayer: ''

            }


            if(usernames.indexOf(black.username) != -1){
                if(usernames.indexOf(white.username) != -1){

                    console.log(usernames, black.username, white.username, gmt5Date);

                    if(gmt5Date.getHours() == 3 && gmt5Date.getMinutes() <= 50 && gmt5Date.getDay() >= 1 && gmt5Date.getDay() <= 5){

                        gameJson.whitePlayer = "♞ " + white.username
                        gameJson.blackPlayer = "♞ " + black.username
        
                        if (white.result == 'win' ) {
                            gameJson.winnerPlayer = "♞ " + white.username
                            gameJson.defeatedPlayer = "♞ " + black.username
                        
                        }
                        if (black.result == 'win') {
                            gameJson.winnerPlayer = "♞ " + black.username
                            gameJson.defeatedPlayer = "♞ " + white.username
            
                        }
                        if(white.result == 'stalemate' || black.result == 'stalemate' || white.result == 'insufficient' || black.result == 'insufficient' || white.result == 'agreed' || black.result == 'agreed' || white.result == 'repetition' || black.result == 'repetition'){
                            gameJson.winnerPlayer = '❌';
                            gameJson.defeatedPlayer = '❌'
                        }

                        //console.log(gameJson);
                    
                        gamesArray.push(gameJson)
                    }

                }

            }
        }

    }

    globalArray.push(...gamesArray)
}

function arrUnique(arr) {  
    var clean = arr.filter((itm, index, self) =>
        index === self.findIndex((t) => (t.gameId === itm.gameId && t.gameUrl === itm.gameUrl)))

    return clean;
}


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

async function getUsernames() {
    
}

app.post('/notion', jsonParser, async function (req, res) {

    const game = req.body

    if (!game) {
        return res.status(400).send({status: 'failed'})
    }

    res.status(200).send({status: 'recived'})
    

    try {

        var notionQuery = queryDB(game.url)
        if(notionQuery != undefined)
        {
            if((await notionQuery).results.length == 0)
            {
                postInDB(game)
                console.log("SUCCESS")
    
            }else{
    
                console.log("UNABLE TO POST BY DUPLICATE")
    
            }
    
        }

    } catch (error) {
        console.log(error)
    }

})