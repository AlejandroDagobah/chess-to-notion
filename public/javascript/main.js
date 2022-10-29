
const baseUrl = 'http://localhost:4000/'

const input = document.getElementById('input')

const getBtn = document.getElementById('get')
const postBtn = document.getElementById('post')

const usernames = ['sami181', 'LDGZCH', 'JMGZCH', 'wilkachimbo', 'Zeratul2022', 'jfyoyu777', 'Luligamer1', 'Samueljanu']
const currentDate = new Date();

         
getBtn.addEventListener('click', function(e) {
    e.preventDefault()

    for (let i = 0; i < usernames.length; i++) {
        const user = usernames[i];

        userAction(usernames, 'https://api.chess.com/pub/player/' + user.toLowerCase() + '/games/2022/09') //url to ask https://api.chess.com/pub/player/{username}/games/{YYYY}/{MM}

        userAction(usernames, 'https://api.chess.com/pub/player/' + user.toLowerCase() + '/games/' + currentDate.getFullYear() + '/' + ("0" + (currentDate.getMonth() + 1)).slice(-2))
    
        console.log('https://api.chess.com/pub/player/' + user.toLowerCase() + '/games/' + currentDate.getFullYear() + '/' +  ("0" + (currentDate.getMonth() + 1)).slice(-2))
    
    }

 })

function subtractHours(date, hours){

    date.setHours(date.getHours() - hours);

    return date;
}

async function userAction(usernames, url) {
    const response = await fetch(url)
    const jsonResponse = await response.json();

    let chessGames = jsonResponse.games;

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


        //#region Winner & Defeated conditions

            if(usernames.indexOf(white.username) != -1){
                if(usernames.indexOf(black.username) != -1){

                    if (white.result == 'win') {
                        gameJson.winnerPlayer = "♞ " + white.username
                        gameJson.defeatedPlayer = "♞ " + black.username

                        gameJson.whitePlayer = "♞ " + white.username
                        gameJson.blackPlayer = "♞ " + black.username

                    
                    }else if (black.result == 'win') {
                        gameJson.winnerPlayer = "♞ " + black.username
                        gameJson.defeatedPlayer = "♞ " + white.username
                        
                        gameJson.blackPlayer = "♞ " + black.username
                        gameJson.whitePlayer = "♞ " + white.username
        
                    }else if(white.result == 'stalemate' || black.result == 'stalemate' || white.result == 'insufficient' || black.result == 'insufficient' || white.result == 'agreed' || black.result == 'agreed'){
                        gameJson.winnerPlayer = '❌';
                        gameJson.defeatedPlayer = '❌'

                        gameJson.blackPlayer = "♞ " + black.username
                        gameJson.whitePlayer = "♞ " + white.username
        
                    }
                    
                    //#region Insert on table
    
                        const table = document.getElementById('tabla-registro');
                        
                        table.innerHTML += '<tr><td>'+ gameJson.gameTitle +'</td><td>'+ gameJson.winnerPlayer +'</td><td>'+ gameJson.defeatedPlayer +'</td><td>'+ gameJson.date +'</td><td>'+ gameJson.termination +'</td><td><a href="' + gameJson.url + '">' + gameJson.url + '</a></td><td>'+ gameJson.whitePlayer +'</td><td>'+ gameJson.blackPlayer +'</td></tr>'
    
                        postOnNotion(gameJson)
    
                        
                    //#endregion
    

                }
            }



        //#endregion



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