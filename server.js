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

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
    
})

app.use('/', router)

app.listen(PORT, HOST, function name() {

    console.log("Starting proxy at " + HOST + ":" + PORT);

    
})



/*

const notion = new Client({auth: "secret_Q9yioL3FNmSl7AsFL8JKwkeoUoUnoV8jsIJHfRxlZIM"});

const databaseid = "7b1833b8cd2844fe880b6c2437910d3f";

app.post('/', jsonParser, async function (req, res) {

    const gameString = '🏆'
    let winnerPlayer
    let defeatedPlayer
    let gameDate
    let gameTime
    let termination
    let url

    try {
        
        const response = await notion.pages.create({
            parent: {database_id: databaseid},
            properties:{
                Name:{
                    title:[
                        {
                            text:{
                                content: gameString
                            }
                        }
                    ]
                },
                "Winner":{
                    rich_text:[
                        {
                            text:{
                                content: winnerPlayer
                            }
                        }
                    ]
                },
                "Defeated":{
                    rich_text:[
                        {
                            text:{
                                content: defeatedPlayer
                            }
                        }
                    ]
                },
                "Date":{
                    rich_text:[
                        {
                            text:{
                                content: gameDate + " | " + gameTime
                            }
                        }
                    ]
                },
                "Termination":{
                    rich_text:[
                        {
                            text:{
                                content: termination
                            }
                        }
                    ]
                },
                "Link":{
                    rich_text:[
                        {
                            text:{
                                content: url
                            }
                        }
                    ]
                }
            }
        })

        console.log("SUCCES")

    } catch (error) {
        console.log(error)
    }
    
})

*/




/*
const {createReadStream} = require('fs');
const http = require('http');
const { Client } = require('@notionhq/client')

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  createReadStream('index.html').pipe(res)

});

const notion = new Client({auth: "secret_Q9yioL3FNmSl7AsFL8JKwkeoUoUnoV8jsIJHfRxlZIM"});

const databaseid = "7b1833b8cd2844fe880b6c2437910d3f";

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  
});




async function userAction(url) {

    const response = await fetch(url)
    const jsonResponse = await response.json();

    let chessGames = jsonResponse.games;

    for (let i = 0; i < chessGames.length; i++) {
        const currentGame = chessGames[i];
        //console.log(currentGame)

        const black = currentGame.black
        const white = currentGame.white

        const gameString = '🏆'
        let winnerPlayer
        let defeatedPlayer
        let pgn = currentGame.pgn
        let pgnArray = pgn.split('\n') 
        let gameDate = pgnArray[2].substring(7, pgnArray[2].length - 2) //no sobreescribir en notion las que ya estan hechas
        let gameTime = pgnArray[19].substring(10, pgnArray[19].length -2) //Formato para notion? //Condición si es mayor a 13:51:00
        let termination = pgnArray[16].substring(14, pgnArray[16].length - 2) // eliminar la primera palabra de la razón de la victoria ej: 'won by checkmate'
        let url = currentGame.url;

     
        //#region Winner & Defeated conditions

        if (white.result == 'win') {
            winnerPlayer = white.username;
            defeatedPlayer = black.username
            
        }else if (black.result == 'win') {
            winnerPlayer = black.username;
            defeatedPlayer = white.username


        }else if(white.result == 'stalemate' || black.result == 'stalemate'){
            winnerPlayer = 'ahogado';
            defeatedPlayer = 'ahogado'

        }else if(white.result == 'insufficient' || black.result == 'insufficient'){
            winnerPlayer = 'draw';
            defeatedPlayer = 'draw'

        }else if(white.result == 'agreed' || black.result == 'agreed'){
            winnerPlayer = 'agreed';
            defeatedPlayer = 'agreed'

        }

        //#endregion

        //#region Insert on table

        const table = document.getElementById('tabla-registro');
        
        table.innerHTML += '<tr><td>'+ gameString +'</td><td>'+ winnerPlayer +'</td><td>'+ defeatedPlayer +'</td><td>'+ gameDate + ' | ' + gameTime +'</td><td>'+ termination +'</td><td><a href="' + url + '">' + url + '</a></td></tr>'

        postInDB(gameString, winnerPlayer, defeatedPlayer, gameDate, termination, url)

        //#endregion


        console.log(winnerPlayer, defeatedPlayer, gameDate, gameTime, termination, url)
        console.log(currentGame)
    }
    
}




async function postInDB(gameString, winnerPlayer, defeatedPlayer, termination, url) {

        const response = await notion.pages.create({
            parent: {database_id: databaseid},
            properties:{
                Name:{
                    title:[
                        {
                            text:{
                                content: gameString
                            }
                        }
                    ]
                },
                "Winner":{
                    rich_text:[
                        {
                            text:{
                                content: winnerPlayer
                            }
                        }
                    ]
                },
                "Defeated":{
                    rich_text:[
                        {
                            text:{
                                content: defeatedPlayer
                            }
                        }
                    ]
                },
                "Date":{
                    rich_text:[
                        {
                            text:{
                                content: gameDate + " | " + gameTime
                            }
                        }
                    ]
                },
                "Termination":{
                    rich_text:[
                        {
                            text:{
                                content: termination
                            }
                        }
                    ]
                },
                "Link":{
                    rich_text:[
                        {
                            text:{
                                content: url
                            }
                        }
                    ]
                }
            }
        })

        console.log("SUCCESS")

    
}

*/