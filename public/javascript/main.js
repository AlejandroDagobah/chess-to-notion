
//const baseUrl = 'https://chess-to-notion.onrender.com'

const baseUrl = 'http://localhost:3001'
const inputDate = document.getElementById('input-date')
const inputText = document.getElementById('input-text')
const currentMonthBtn = document.getElementById('currentMonth')
const customMonthBtn = document.getElementById('customMonth')

const currentDate = new Date();
const usernames = ['sami181', 'LDGZCH', 'JMGZCH', 'wilkachimbo', 'Zeratul2022', 'jfyoyu777', 'Luligamer1', 'Samueljanu']

var playersArray = []

async function getInfo()
{

    const res = await fetch(baseUrl + '/info', {

        method: 'GET',

    })
    const data = await res.json()

    console.log(data.info)
    playersArray = data.info
}


async function postInfo(url)
{        
    if(url == '' || url == null){return}
    const res = await fetch(baseUrl + '/info', {

        method: 'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            parcel: url
        })
    })
    
}

async function insertRows(playersArray) {
    
    for (let i = 0; i < playersArray.length; i++) {

        const playerGames = playersArray[i];
        

        for (let ii = 0; ii < playerGames.length; ii++) {
            const game = playerGames[ii];

            //#region Insert on table

            const table = document.getElementById('tabla-registro');

            table.innerHTML += '<tr><td>'+ game.gameTitle +'</td><td>'+ game.winnerPlayer +'</td><td>'+ game.defeatedPlayer +'</td><td>'+ game.date +'</td><td>'+ game.termination +'</td><td><a href="' + game.url + '">' + game.url + '</a></td><td>'+ game.whitePlayer +'</td><td>'+ game.blackPlayer +'</td></tr>'
        
            //postOnNotion(gameJson)
        
            
            //#endregion
            
        }


    }
}


currentMonthBtn.addEventListener('click', function(e) {
    e.preventDefault()
    
    getInfo()

    insertRows(playersArray)

 })

 customMonthBtn.addEventListener('click', function(e) {
    e.preventDefault()

    //BASADO EN LA FECHA ACTUAL'https://api.chess.com/pub/player/' + user.toLowerCase() + '/games/' + currentDate.getFullYear() + '/' + ("0" + (currentDate.getMonth() + 1)).slice(-2)

    for (let i = 0; i < usernames.length; i++) {
        const user = usernames[i];

        //formato https://api.chess.com/pub/player/{username}/games/{YYYY}/{MM}
        const chessURL = 'https://api.chess.com/pub/player/' + user.toLowerCase() + '/games/2022/10'
        postInfo(chessURL)

        //console.log('prev ' + chessURL)
    }

 })

/*


async function postOnNotion(url) {
    if(url == undefined){return}

    const res = await fetch(baseUrl, {

        method: 'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            link: 'here send gameJSON'
        }) 

        
    })
    
}

 customMonthBtn.addEventListener('click', function(e) {
    e.preventDefault()

    let dateArray = inputDate.value.split("-")

    for (let i = 0; i < usernames.length; i++) {
        const user = usernames[i];

        userAction(usernames, 'https://api.chess.com/pub/player/' + user.toLowerCase() + '/games/' + dateArray[0] + '/' + dateArray[1]) //url to ask https://api.chess.com/pub/player/{username}/games/{YYYY}/{MM}
               
    }

 })
*/