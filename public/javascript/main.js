
//const baseUrl = 'http://localhost:3001'

const baseUrl = 'http://localhost:3001'
const inputDate = document.getElementById('input-date')
const currentMonthBtn = document.getElementById('currentMonth')
const customMonthBtn = document.getElementById('customMonth')
const postInTableBtn = document.getElementById('postInTable')
const inputDatabase = document.getElementById('databaseId')
const inputBoton = document.getElementById("submit-btn")

const isHighElo = document.getElementById("team1")
const isLowElo = document.getElementById("team2")

postInTableBtn.disabled = true

const currentDate = new Date();

let usernames = ['sami181', 'LDGZCH', 'JMGZCH', 'wilkachimbo', 'Zeratul2022', 'JFyoyu777', 'Luligamer1', 'Samueljanu']

var gamesArray = []
var databaseId


async function getInfo()
{
    const res = await fetch(baseUrl + '/info', {

        method: 'GET',

    })
    const data = await res.json()

    gamesArray = data.info

    insertRows(gamesArray)
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

async function postDatabaseId(databaseId){

    console.log(isHighElo.checked, isLowElo.checked);

    if (databaseId != undefined) {
        const res = await fetch(baseUrl + '/databaseID', {
            method: 'POST',
            headers:{
                "Content-Type": 'application/json'

            },
            body: JSON.stringify({
                parcel: databaseId,
                isHighElo: isHighElo.checked
            })
    
        })
    }

}

function insertRows(gamesArray){

        for (let i = 0; i < gamesArray.length; i++) {
            const game = gamesArray[i];

            //#region Insert on table

            const table = document.getElementById('tabla-registro');
            var date = new Date(game.date)
            
            table.innerHTML += '<tr><td>'+ game.gameTitle + ' ' + game.gameId + '</td><td>'+ game.winnerPlayer +'</td><td>'+ game.defeatedPlayer +'</td><td>' + date +'</td><td>'+ game.termination +'</td><td><a href="' + game.url + '">' + game.url + '</a></td><td>'+ game.whitePlayer +'</td><td>'+ game.blackPlayer +'</td></tr>'        
            
            postOnNotion(game)

            //#endregion

            
        }

    gamesArray = []

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
        postInfo(chessURL)

    }
    postInTableBtn.disabled = false
 })

 postInTableBtn.addEventListener('click', function(e) {
    e.preventDefault()

    getInfo()

 })

async function postOnNotion(gameInfo) {
    //console.log(gameInfo);

    if(gameInfo == '' || gameInfo == null){return}
    const res = await fetch(baseUrl + '/notion', {

        method: 'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(gameInfo)

    })
}

inputBoton.addEventListener("click", function(e) {

    e.preventDefault()
    databaseId = inputDatabase.value
    postDatabaseId(databaseId)

})