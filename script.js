const snakeGame = document.querySelector('#snake');
const sapperGame = document.querySelector('#sapper');
const pingPongGame = document.querySelector('#ping_pong');

snakeGame.addEventListener('click', function(e)
    {
        window.location.href = 'games/snake/snake.html';
    });

sapperGame.addEventListener('click', function(e)
    {
        window.location.href = 'games/sapper/sapper.html';
    });

pingPongGame.addEventListener('click', function(e)
    {
        window.location.href = 'games/ping_pong/ping_pong.html';
    });