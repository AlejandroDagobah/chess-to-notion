
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

        //#endregion

        


        console.log(winnerPlayer, defeatedPlayer, gameDate, gameTime, termination, url)
        console.log(currentGame)
    }
    
    
    
}
