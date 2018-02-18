function addCubes() {
	var emptyCubesLgth = $('.bg-default').length;
	var randomNum = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
	if(randomNum > 0) {
		for(var item = 0; item < randomNum-1; item++) {
			var nextRandom = Math.floor(Math.random() * ((emptyCubesLgth-1) - 0 + 1)) + 0;
			if($('.bg-default')[nextRandom]) {
				$($('.bg-default')[nextRandom]).removeClass('bg-default').addClass(getRandomColor());
			}
		}
	}
}

function resetResult() {
    var divResult = document.getElementById('result');
    divResult.innerHTML = 0;
}

function sortLocalStorage(numb, str) {
    var n = numb.length, i = 1, j = 2;
    while (i < n) { 
    	if (numb[i - 1] > numb[i]) { 
     	i = j; 
     	j++; 
     	}
        else { 
       		var t = numb[i - 1]; numb[i - 1] = numb[i]; numb[i] = t;
           	var t1 = str[i - 1]; str[i - 1] = str[i]; str[i] = t1;
           	i--;
           	if (i == 0){ i = j; j++; }
        }
    }
    return numb.concat(str);
}

function getColors() {
    return [
    {name: 'bg-black', points: 4},
    {name: 'bg-brown', points: 3},
    {name: 'bg-red', points: 2},
    {name: 'bg-primary', points: 1},
    {name: 'bg-yellow', points: -2},
    {name: 'bg-green', points: -5}
     ];
}

function getRandomColor() {
    var arr = getColors();
    var color = arr[Math.floor(Math.random() * (5 - 0 + 1)) + 0]['name']
    return color;
}

function Timer(callback, delay) {
    var timerId, start;

    this.pause = function() {
        window.clearTimeout(timerId);
    };

    this.stop = function(){
        window.clearTimeout(timerId);
        var divTime = document.getElementById('timer');
        divTime.innerHTML = 60;
    }

    this.resume = function() {
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, delay);
    };

    this.resume();
}

function getPoint(className) {
    var colors = getColors();
    for(var item in colors) {
        if(colors[item]['name'] == className) {
            return colors[item]
        }
    }
}

function showTableOfResults(){
    var points = [];
    var names = [];
    for (var i = 0; i < localStorage.length; i++){
      points[i] = parseInt(localStorage.key(i));
      names[i] = localStorage.getItem(localStorage.key(i));
    } 
    var sortData = sortLocalStorage(points,names);
    var sortpoints = [];
    var sortnames = [];
    for(var i = 0; i < sortData.length;i++)
    {
      if(i < sortData.length/2) sortpoints.push(sortData[i]);
      else sortnames.push(sortData[i]);
    }
    var str = "";
    for (var i = 0; i < sortpoints.length; i++) {
        str += "<div class = 'tableResult'><h4>" + (i+1) + ".  " + sortnames[i] + "</h4> <h4>" + sortpoints[i] + "</h4></div><br>";
        document.getElementById("tableResults").innerHTML = str;
    }
}

function startGame() {
	var html = '';
    var gameCount = 0;
    $('#main-app').attr('value', gameCount);
    for(var item = 0; item < 12; item++) {
    	html += '<div class="row row-' + item + '">';
    	for(var key =0; key < 12; key++) {
    		html += '<div class="col-xs-1 cube-' + item + '_' + key + '"><div class="' + getRandomColor() + '"></div></div>';
    	}
    	html += '</div>';
    }
    $('#main-app').html(html);

    $('#main-app').on('click', function(e){
    	var className = e.target.className;
        var colors = getColors();
        var colorsStr = '';
        var valueMain = document.getElementById('main-app').getAttribute('value');
        for(var item in colors) { colorsStr += '|' + colors[item]['name']; }
    	if(colorsStr.indexOf(className) !== -1) {
            var currentBtn = getPoint(className);
            valueMain = +valueMain + currentBtn['points'];
            var result = document.getElementById('result');
            result.innerHTML = +result.innerHTML + valueMain;
    		$(e.target).removeClass(className);
    		$(e.target).addClass('bg-default');
            console.log(currentBtn);
    		addCubes();
    	}
    });
    window.timer = undefined;
    window.timer = new Timer(function () {
        var divTime = document.getElementById('timer');
        divTime.innerHTML--;
        if(divTime.innerHTML == 0) {
            gameCount = +gameCount + +document.getElementById('result').innerHTML;
            var gameName = prompt('Congratulations! Your Score: ' + gameCount + ' points!\n Enter your name: ', '');
            if(gameName == null) gameName = "Unknown User"
            localStorage.setItem(gameCount,gameName);
            gameCount = 0;
            showTableOfResults();
            $('#main-app').attr('value', gameCount);
            $('#main-app').block({ message: '<h1>Time Over</h1>', css: { backgroundColor: '#808080', color: '#fff'}});
            setTimeout(function(){},1000);
        }
        else {
            setTimeout(window.timer.resume(),1000);
        }
    }, 1000);
}

$( document ).ready(function() {
    showTableOfResults();
    window.timer = undefined;
    $('.start').on('click', function() {
        var isEnd = document.getElementById('timer').innerHTML;
        if(isEnd != 0){
            if(window.timer) {
                $('#main-app').unblock();
                window.timer.resume();
            } 
            else {
                startGame();
            }
        }
        $('.restart, .pause').show();
    });

    $('.restart').on('click', function(){
        window.timer.stop();
        resetResult();
        startGame();
    });

    $('.pause').on('click', function() {
        window.timer.pause();
        $('#main-app').block({ message: '<h1>Pause</h1>', css: { backgroundColor: '#808080', color: '#fff'}}); 
    });

    $('.restart, .pause').hide();

    var colors = getColors();
    var colorsStr = '<h3>Rules</h3>';
    for(var color of colors) {
        colorsStr += '<div style="margin-bottom:10px;"><div class="' + color.name + '" style="width: 20px;height: 20px;float:left; margin-right: 10px;"></div>' + color.points + ' points</div>'
    }
    $('#colors').html(colorsStr);
});