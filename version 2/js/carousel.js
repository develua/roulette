$(function()
{
    // удалить
    
    function NowTop(a, c, s)
    {
        this.avatar = a;
        this.chance = c;
        this.steamid = s;
    }
    
    var players = [
                    new NowTop('img/1.jpg', '10', 'Name player 1'),
                    new NowTop('img/2.jpg', '10', 'Name player 2'),
                    new NowTop('img/3.jpg', '10', 'Name player 3'),
                    new NowTop('img/4.jpg', '10', 'Name player 4'),
                    new NowTop('img/5.jpg', '10', 'Name player 5'),
                    new NowTop('img/6.jpg', '10', 'Name player 6'),
                    new NowTop('img/7.jpg', '10', 'Name player 7'),
                    new NowTop('img/8.jpg', '10', 'Name player 8'),
                    new NowTop('img/9.jpg', '10', 'Name player 9'),
                    new NowTop('img/10.jpg', '10', 'Name player 10')
                 ];
    
    // ------------------
    
    
    
    var elementsList = $('.carousel-list'); // указатель на карусель
    var sound = document.getElementById('click-sound'); // указатель на звук вращения
    var cursorPosition = $('.carousel-hider').outerWidth() / 2; // месторасположение курсора
    var widthElement = 80; // ширина одного елемента в карусели
    var marginElement = 5; // отступы между елементами
    var timerStop = 15000; // время через которое карусель остановиться
    var stopLeftValue = 0; // позиця в которой должна остановиться карусель
    var countImgPlayers = 100; // количество картинок в карусели
    var currentPosition = 0; // текущая позиция карусели
    
    function loadDataCarousel(nowTop, playerWin)
    {
        elementsList.css('left', '0px');
        elementsList.empty();
        
        // загрузка игроков в карусель
        
        for(var i = 0; i < nowTop.length; i++)
        {
            var avatar = nowTop[i].avatar;
            var chance = nowTop[i].chance;
            var steamid = nowTop[i].steamid;
            var countMulti = Math.ceil((countImgPlayers / 100) * chance);
            
            for(var j = 0; j < countMulti; j++)
                elementsList.append('<img src="' + avatar + '" data-steamid="' + steamid + '"/>');
        }
        
        // перемешиваем игроков
        
        elementsList.children().shuffle();
        
        // находим месторасположение игрока победителя
        
        var winnerPosition = 0;
        
        for(var i = elementsList.children().length; i >= 0; i--)
        {
            if(elementsList.children().eq(i).attr('data-steamid') == playerWin)
            {
                winnerPosition = i;
                break;
            }
        }
        
        // перемещаем елемент победителя в крайнюю позицию
        
        var minElementsRight = Math.ceil(cursorPosition / widthElement);
        var endPosition = elementsList.children().length - minElementsRight - 1;
        
        if(endPosition != winnerPosition)
        {
            if(winnerPosition < endPosition)
                elementsList.children().eq(endPosition).after(elementsList.children().eq(winnerPosition));
            else
                elementsList.children().eq(endPosition).before(elementsList.children().eq(winnerPosition));
            
            winnerPosition = endPosition;
        }
        
        // определение позиции для остановки
        
        var centerImg = (widthElement - 10) / 2;
        var randShift = getRandomInt(-centerImg, centerImg);
        stopLeftValue = (widthElement + marginElement) * winnerPosition - cursorPosition + (widthElement / 2) - randShift;
    }
    
    function startCarousel()
    {
        currentPosition = 0;
        
        elementsList.animate({ 'left': -stopLeftValue + 'px' },
        {
            duration: timerStop,
            easing: 'easeOutQuart',
            step: function(now, fx)
            {
                var relativePosition = (now - 35) % cursorPosition;
                
                if (currentPosition < relativePosition)
                    sound.play();
                
                currentPosition = relativePosition;
            },
            complete: stopCarousel
        });
    }
    
    function stopCarousel()
    {
        $('#btnRefresh').removeAttr('disabled'); // удалить
    }
    
    function getRandomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    $.fn.shuffle = function()
    {
        var allElems = this.get(),
            getRandom = function(max)
            {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function()
            {
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
 
        this.each(function(i)
        {
            $(this).replaceWith($(shuffled[i]));
        });
 
        return $(shuffled);
    };
    
    
    
    
    // удалить
    
    loadDataCarousel(players, 'Name player 6');
    
    $('#btnStart').click(function()
    {
        $(this).attr('disabled', 'true');
        $('#btnRefresh').attr('disabled', 'true');
        startCarousel();
    });
    
    $('#btnRefresh').click(function()
    {
        loadDataCarousel(players, 'Name player 6');
        $('#btnStart').removeAttr('disabled');
    });
    
    // ------------------
    
});