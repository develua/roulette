$(function()
{
    function NowTop(a, c, s)
    {
        this.avatar = a;
        this.chance = c;
        this.steamid = s;
    }
    
    var nowTop = [
                    new NowTop('img/1.jpg', '10', 'Player 1'),
                    new NowTop('img/2.jpg', '7', 'Player 2'),
                    new NowTop('img/3.jpg', '3', 'Player 3'),
                    new NowTop('img/4.jpg', '9', 'Player 4'),
                    new NowTop('img/5.jpg', '4', 'Player 5'),
                    new NowTop('img/6.jpg', '30', 'Player 6'),
                    new NowTop('img/7.jpg', '18', 'Player 7'),
                    new NowTop('img/8.jpg', '1', 'Name player 8'),
                    new NowTop('img/9.jpg', '1', 'Name player 9'),
                    new NowTop('img/10.jpg', '1', 'Name player 10')
                 ];
    
    
    
    var elementsList = $('.carousel-list'); // указатель на карусель
    var sound = document.getElementById("click-sound"); // указатель на звук вращения
    var widthCarousel = $('.carousel-hider').outerWidth(); // ширина видемой области карусели
    var widthElement = 140; // ширина одного елемента в карусели
    
    var timerStop = 10000; // время через которое карусель остановиться
    var timeUpdate = 15; // переодичность вызова смещения елементов карусели (в миллисекундах, min = 10, max = ...)
    var countMoves = timerStop / timeUpdate; // количество смещений
    var currentMoves = countMoves; // количество оставшихся смещений
    var stepMax = 45; // максимальное смещение в (px)
    var stepMin = 0; // минимальное смещение в (px)
    var currentStep = stepMin; // текущее смещение в (px)
    var animateVal = (stepMax - stepMin) / countMoves; // значение на которое будет меняться скорость
    var soundVal = (3.0 - 0.1) / countMoves; // значение на которое будет меняться скорость воспроизведения звука
    
    var currentLeftValue = 0; // текущий сдвиг карусели влево
    var linkSetInterval = null; // указатель на setInterval
    var multiElements = new Array(); // массив игоров в процентном соотношение
    
    function loadPlayersInCarousel()
    {
        elementsList.children().empty();
        
        for(var i = 0; i < nowTop.length; i++)
        {
            var avatar = nowTop[i].avatar;
            var chance = nowTop[i].chance;
            var steamid = nowTop[i].steamid;
            var countMulti = Math.ceil((nowTop.length / 100) * chance);
            
            console.log(countMulti);
            
            for(var j = 0; j < countMulti; j++)
                elementsList.append('<li class="carousel-element"><img src="'+avatar+'"><span>'+chance+'%</span><p>'+steamid+'</p></li>');
        }
    }
    
    function moveCarousel()
    {
        // при истинном условие останавливаем карусель
        
        if(--currentMoves < 0)
        {
            stopCarousel();
            return;
        }
        
        // увеличение и уменьшение скорости
        
        if(countMoves / 2 < currentMoves)
        {
            currentStep += animateVal;
            sound.playbackRate += soundVal;
        }
        else if(countMoves / 2 > currentMoves)
        {
            currentStep -= animateVal;
            sound.playbackRate -= soundVal;
        }
        
        // производим движение карусели
        
        currentLeftValue -= currentStep;
        elementsList.css('left', currentLeftValue + 'px');
        
        // если первый елемент вышел из области видимости перемещаем его в конец
        
        if(-currentLeftValue >= widthElement)
        {
            elementsList.children(':first').appendTo(elementsList);
            currentLeftValue = 0;
            elementsList.css('left', currentLeftValue + 'px');
        }
    }
    
    function startCarousel()
    {
        sound.play();
        sound.playbackRate = 0.1;
        linkSetInterval = setInterval(moveCarousel, timeUpdate);
    }
    
    function stopCarousel()
    {
        clearInterval(linkSetInterval);
        sound.pause();
        
        // определение победителя
        
        var centerArrow =  widthCarousel / 2; // центр стрелки
        var playerWin = Math.ceil((centerArrow - currentLeftValue) / widthElement);
        
        // если стрелка между двух игроков, прокручиваем рулетку и выбираем победителем следуешего игрока
        
        if((centerArrow - currentLeftValue) % widthElement > 105)
        {
            playerWin++;
            currentLeftValue -= 40;
            elementsList.animate({'left': currentLeftValue + 'px'}, 200);
        }
        
        var steamidWin = elementsList.children().eq(playerWin - 1).children('p:first').text();
        
        $('body').append('<p>Win player: ' + steamidWin + '!</p>'); // удалить
    }
    
    
    
    
    
    loadPlayersInCarousel();
    
    $('#btnStart').click(function()
    {
        currentMoves = countMoves; // удалить
        startCarousel();
    });
    
});