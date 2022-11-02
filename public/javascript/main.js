
//const baseUrl = 'https://chess-to-notion.onrender.com'

const baseUrl = 'http://localhost:3001'
const inputDate = document.getElementById('input-date')
const currentMonthBtn = document.getElementById('currentMonth')
const customMonthBtn = document.getElementById('customMonth')
const postInTableBtn = document.getElementById('postInTable')
postInTableBtn.disabled = true

const currentDate = new Date();
const usernames = ['sami181', 'LDGZCH', 'JMGZCH', 'wilkachimbo', 'Zeratul2022', 'JFyoyu777', 'Luligamer1', 'Samueljanu']

var playersArray = []


async function getInfo()
{
    const res = await fetch(baseUrl + '/info', {

        method: 'GET',

    })
    const data = await res.json()

    playersArray = data.info
    insertRows(playersArray)

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
    console.log(res);
}

function insertRows(playersArray) {
    for (let i = 0; i < playersArray.length; i++) {

        const playerGames = playersArray[i];


        for (let ii = 0; ii < playerGames.length; ii++) {
            const game = playerGames[ii];

            //#region Insert on table

            const table = document.getElementById('tabla-registro');

            table.innerHTML += '<tr><td>'+ game.gameTitle +'</td><td>'+ game.winnerPlayer +'</td><td>'+ game.defeatedPlayer +'</td><td>'+ game.date +'</td><td>'+ game.termination +'</td><td><a href="' + game.url + '">' + game.url + '</a></td><td>'+ game.whitePlayer +'</td><td>'+ game.blackPlayer +'</td></tr>'        
            
            postOnNotion(game)

            //#endregion

            console.log('player:', i, 'game:', ii, 'inserting in table...');

            
        }


    }

    playersArray = []

}

currentMonthBtn.addEventListener('click', function(e) {
    e.preventDefault()
    
    for (let i = 0; i < usernames.length; i++) {
        const user = usernames[i];

        //formato https://api.chess.com/pub/player/{username}/games/{YYYY}/{MM}
        const chessURL = 'https://api.chess.com/pub/player/' + user.toLowerCase() + '/games/' + currentDate.getFullYear() + '/' + ("0" + (currentDate.getMonth() + 1)).slice(-2)
        postInfo(chessURL)
    }
    postInTableBtn.disabled = false

 })

 customMonthBtn.addEventListener('click', function(e) {
    e.preventDefault()

    let dateArray = inputDate.value.split("-")

    for (let i = 0; i < usernames.length; i++) {
        const user = usernames[i];

        //formato https://api.chess.com/pub/player/{username}/games/{YYYY}/{MM}

        const chessURL = 'https://api.chess.com/pub/player/' + user.toLowerCase() + '/games/' + dateArray[0] + '/' + dateArray[1]
        console.log(chessURL)
        postInfo(chessURL)

    }
    postInTableBtn.disabled = false
 })

 postInTableBtn.addEventListener('click', function(e) {
    e.preventDefault()


    getInfo()

 })

async function postOnNotion(gameInfo) {

    if(gameInfo == '' || gameInfo == null){return}
    const res = await fetch(baseUrl + '/notion', {

        method: 'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(gameInfo)

    })
}