document.querySelector('#blackjack_hit_button').addEventListener('click', blackjackHit);
cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
function blackjackHit()
{
    card = randomCard();
    showCards(card);
}
function showCards(card)
{
    let yourImage = document.createElement('img');
    yourImage.src = `Images/${card}.png`;
    document.querySelector('#blackjack-your-div').appendChild(yourImage);
}
function randomCard()
{
    let random = Math.floor(Math.random() * 13);
    return cards[random];
}
