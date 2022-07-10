//------------------------------------------Initialization of a global variable -----------------------------------------------------------------------------

let blackjackGame = {
    'you' : {'scoreSpan' : '#blackjack-your-score', 'div' : '#blackjack-your-div', 'score' : 0},
    'dealer' : {'scoreSpan' : '#blackjack-dealer-score', 'div' : '#blackjack-dealer-div', 'score' : 0},
    'cards' : [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'],
    'cardsMap' : {'1' : 1, '2' : 2, '3' : 3, '4' : 4, '5' : 5, '6' : 6, '7' : 7, '8' : 8, '9' : 9, '10' : 10, 'J' : 11, 'Q' : 12, 'K' : 13, 'A' : [1, 11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isStand' : false,
    'turnOver' : false,
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------Initialization of const variables ------------------------------------------------------------------------------

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('sounds/swish.m4a');
const WinSound = new Audio('sounds/cash.mp3');
const LostSound = new Audio('sounds/aww.mp3');

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------Invoking event on 3 different buttons --------------------------------------------------------------------------

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------defining driver function ---------------------------------------------------------------------------------------

function blackjackHit()
{
    if(blackjackGame['isStand'] == false)
    {
        let Card = randomCard();
        showCard(Card, YOU);
        updateScore(Card, YOU);
        showScore(YOU);
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------defining a function to show the cards (for player 1 and player 2)-----------------------------------------------

function showCard(Card, activePlayer)
{
    if(activePlayer['score'] <= 21)
    {
        let yourImage = document.createElement('img');
        yourImage.src = `images/${Card}.png`;
        document.querySelector(activePlayer['div']).appendChild(yourImage);
        hitSound.play();
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------defining function to generate a random card --------------------------------------------------------------------
function randomCard()
{
    let Card = blackjackGame['cards'][Math.floor(Math.random() * 13)];
    return Card;
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------defining a function that invokes on clicking Deal button ------------------------------------------------------

function blackjackDeal()
{
    if(blackjackGame['turnOver'] == true)
    {
        blackjackGame['isStand'] = false;
        //--------------------------------collect all images of player1 shown on board ------------------------------------------------------------------
        
        let listofyourImages = document.querySelector('#blackjack-your-div').querySelectorAll('img');
        
        //--------------------------------collect all images of player2 shown on board ------------------------------------------------------------------
        
        let listofdealerImages = document.querySelector('#blackjack-dealer-div').querySelectorAll('img');
        
        //-------------------------------a for loop to remove all images of player 1---------------------------------------------------------------------
        for(let i = 0; i < listofyourImages.length; i++)
        {
            listofyourImages[i].remove();
        }
        
        //-------------------------------a for loop to remove all images of player 2---------------------------------------------------------------------
        for(let i = 0; i < listofdealerImages.length; i++)
        {
            listofdealerImages[i].remove();
        }
        
        //------------------------------Refreshing the variables for a new game -------------------------------------------------------------------------
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector(YOU['scoreSpan']).textContent = 0;
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).textContent = 0;
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnOver'] = false;
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------defining a function that restricts the score <= 21 --------------------------------------------------------------

function updateScore(Card, activePlayer)
{
    if(Card == 'A')
    {
        if(activePlayer['score'] + blackjackGame['cardsMap'][Card][1] <= 21)
        {
            activePlayer['score'] += blackjackGame['cardsMap'][Card][1];        
        }
        else
        {
            activePlayer['score'] += blackjackGame['cardsMap'][Card][0];        
        }
    }
    else
    {
        activePlayer['score'] += blackjackGame['cardsMap'][Card];
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------defining a function to output if score >= 21 -------------------------------------------------------------------
function showScore(activePlayer)
{
    if(activePlayer['score'] <= 21)
    {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
    else
    {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'Bust!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

//------------------------------------defining an async function for player 2 (computer itself) -----------------------------------------------------
async function dealerLogic()
{
    blackjackGame['isStand'] = true;
    while(DEALER['score'] <= 19 && blackjackGame['isStand'] == true)
    {
        let Card = randomCard();
        showCard(Card, DEALER);
        updateScore(Card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    blackjackGame['turnOver'] = true;
    let winner = computeWinner()
    showResult(winner);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------defining a function to compute the winner ---------------------------------------------------------------------

function computeWinner()
{
    let winner = 0;
    if(YOU['score'] <= 21)
    {
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21)
        {
            blackjackGame['wins']++;
            winner = YOU;
        }
        else if(YOU['score'] < DEALER['score'])
        {
            blackjackGame['losses']++;
            winner = DEALER;
        }
        else if(YOU['score'] == DEALER['score'])
        {
            blackjackGame['draws']++;
        }
    }
    else if(YOU['score'] > 21 && DEALER['score'] <= 21)
    {   
        blackjackGame['losses']++;
        winner = DEALER;
    }
    else if(YOU['score'] > 21 && DEALER['score'] > 21)
    {
        blackjackGame['draws']++;
    }
    return winner;
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------defining a function to show the winner ------------------------------------------------------------------------

function showResult(winner)
{
    if(blackjackGame['turnOver'] == true)
    {
            let message, messageColor;
        if(winner == YOU)
        {
            document.querySelector('#blackjack-wins').textContent = blackjackGame['wins'];
            message = 'You Won!';
            messageColor = 'green';
            WinSound.play();
        }
        else if(winner == DEALER)
        {
            document.querySelector('#blackjack-losses').textContent = blackjackGame['losses'];
            message = 'You Lost!';
            messageColor = 'red';
            LostSound.play();
        }
        else
        {
            document.querySelector('#blackjack-draws').textContent = blackjackGame['draws'];
            message = 'You Drew!';
            messageColor = 'black';
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
