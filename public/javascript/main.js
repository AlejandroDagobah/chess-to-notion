
const baseUrl = 'http://localhost:4000/'

const input = document.getElementById('input')

const getBtn = document.getElementById('get')
const postBtn = document.getElementById('post')

const usernames = ['sami181', 'LDGZCH', 'JMGZCH', 'wilkachimbo', 'Zeratul2022', 'jfyoyu777', 'Luligamer1', 'Samueljanu']
const currentDate = new Date();

         
getBtn.addEventListener('click', function(e) {
    e.preventDefault()

    userAction(usernames, 'https://api.chess.com/pub/player/ldgzch/games/2022/10') //url to ask https://api.chess.com/pub/player/{username}/games/{YYYY}/{MM}

})

function subtractHours(date, hours){
    const dateCopy = new Date(date);

    dateCopy.setHours(dateCopy.getHours() - hours);
    
    return date;
}

async function userAction(usernames, url) {
    const response = await fetch(url)
    const jsonResponse = await response.json();

    let chessGames = jsonResponse.games;

    for (let i = 0; i < 1/*chessGames.length*/; i++) {
        const currentGame = chessGames[i];
        //console.log(currentGame)

        const black = currentGame.black
        const white = currentGame.white

        let pgnArray = currentGame.pgn.split('\n') 

        let date = pgnArray[2].substring(7, pgnArray[2].length - 2)
        let time = pgnArray[19].substring(12, pgnArray[19].length - 2)
        
        var normalDate  = new Date(date + ' ' + time)

        var ecDate = subtractHours(normalDate, 5)

        console.log(normalDate, ecDate)




        var myDate = normalDate.toISOString()


        console.log(myDate)

      

        const gameJson = {
            gameTitle: '🏆',
            winnerPlayer:'',
            defeatedPlayer: '',
            date: normalDate, //no sobreescribir en notion las que ya estan hechas
            time: pgnArray[19].substring(10, pgnArray[19].length -2), //formato para notion?
            termination: pgnArray[16].substring(14, pgnArray[16].length - 2), // eliminar la primera palabra de la razón de la victoria ej: 'won by checkmate'
            url: currentGame.url

        }


        //#region Winner & Defeated conditions

            if(usernames.indexOf(white.username) != -1){
                if(usernames.indexOf(black.username) != -1){

                    if (white.result == 'win') {
                        gameJson.winnerPlayer = white.username;
                        gameJson.defeatedPlayer = black.username
                    
                    }else if (black.result == 'win') {
                        gameJson.winnerPlayer = black.username;
                        gameJson.defeatedPlayer = white.username
        
                    }else if(white.result == 'stalemate' || black.result == 'stalemate' || white.result == 'insufficient' || black.result == 'insufficient' || white.result == 'agreed' || black.result == 'agreed'){
                        gameJson.winnerPlayer = '❌';
                        gameJson.defeatedPlayer = '❌'
        
                    }
                    
                    //#region Insert on table
    
                        const table = document.getElementById('tabla-registro');
                        
                        table.innerHTML += '<tr><td>'+ gameJson.gameTitle +'</td><td>'+ gameJson.winnerPlayer +'</td><td>'+ gameJson.defeatedPlayer +'</td><td>'+ gameJson.date + ' | ' + gameJson.time +'</td><td>'+ gameJson.termination +'</td><td><a href="' + gameJson.url + '">' + gameJson.url + '</a></td></tr>'
    
                        postOnNotion(gameJson)
    
                        
                    //#endregion
    

                }
            }



        //#endregion



    }
    
}

function getAllUsersGames() {

    for (let i = 0; i < usernames.length; i++) {
        const user = usernames[i];
         
        userAction(usernames, 'https://api.chess.com/pub/player/' + user + '/games/' + currentDate.getFullYear + '/' + currentDate.getMonth) //url to ask https://api.chess.com/pub/player/{username}/games/{YYYY}/{MM}

    }




}


async function postOnNotion(json) {

    if(json == null){return}

    const res = await fetch(baseUrl, {

        method: 'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(json)
        
    })
    
}




















/*
getBtn.addEventListener('click', async function (e) {
    e.preventDefault()

    console.log("Click")


    const res = await fetch(baseUrl + 'info', {
        method: 'GET'
        
    })

    const data = await res.json()
    input.value = data.info
    
})
*/















/*
const { Client } = require('@notionhq/client')


function init() {
    console.log('hola')
}

var button = document.getElementById("button-info")
button.addEventListener('onclick', function(e) {
    
    userAction('https://api.chess.com/pub/player/sami181/games/2022/10')
    
})


const notion = new Client({auth: "secret_Q9yioL3FNmSl7AsFL8JKwkeoUoUnoV8jsIJHfRxlZIM"});

const databaseid = "7b1833b8cd2844fe880b6c2437910d3f";


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
