function Tile(number){
    let tile = this;
    this.number = number;
    this.html = "<div id=\"box" + this.number + "\"></div>";
    this.name = "#box" + this.number
    this.value = false;
    this.returnHTML = function() {return this.html};
    this.turnOffClick = function() {
        $(this.name).off("click");
    }
    this.clickEvent = function() {
        $(this.name).on("click", function (){
            tile.check();
            $(tile.name).off("click");
        });
    }
    this.check = function() {
        if (this.value == true){
            $(this.name).css("background-color", "#6eff54");
            start.score += 1;
            start.correct += 1;
            $("#score").html(start.score);
        } else if (this.value == false){
            $(this.name).css("background-color", "red");
            start.score -= 1;
            $("#score").html(start.score);
        }
        start.moves--;
        if (start.moves == 0){
            start.grid.disableClick();
            setTimeout(function() {
                start.nextGrid();
            }, 1000);
        }
    };
    this.setValue = function(x) {this.value = x};
    this.correctTile = function() {
        $(this.name).css("background-color", "#6eff54");
        this.value = true;
        let holder = this.name;
        setTimeout(function() {
            $(holder).css("background-color", "rgb(22, 165, 46)");
        }, 1000);
    }
}

function Grid(){
    this.name = "#square"
    this.column = 3;
    this.row = 3;
    this.degree = 0;
    this.tileStorage = [];
    this.disableClick = function () {
        for (i = 0; i < this.tileStorage.length; i++){
            this.tileStorage[i].turnOffClick();
        }
    }
    this.enableClick = function () {
        for (i = 0; i < this.tileStorage.length; i++){
            this.tileStorage[i].clickEvent();
        }
    }
    this.addTile = function () {
        let num = this.tileStorage.length;
        let newTile = new Tile(num);
        this.tileStorage.push(newTile);
        $("#square").append(newTile.returnHTML());
    };
    this.increase = function () {
        if (this.row == this.column) {
            this.column++;
        } else if (this.row < this.column) {
            this.row++;
        }
    };
    this.decrease = function () {
        if (this.row == this.column) {
            this.row--; 
        } else if (this.row < this.column) {
            this.column--;
        }
    };
    this.rotate = function () {
        if (this.degree == 0){
            this.degree = 90;
        } else {
            this.degree = 0;
        }
        $(this.name).animate(
            {deg: this.degree},
            {
                duration: 600,
                step: function(angle){
                    $(this).css({transform: 'rotate(' + angle + "deg)"});
                }
            }
        );
    };
    this.update = function () {
        $("#square").empty();
        this.tileStorage = [];
        let column = ""
        for (i = 0; i < this.column; i++){
            column += "auto ";
        }
        $("#square").css("grid-template-columns", column);

        for (i = 0; i < (this.row * this.column); i++){
            this.addTile();
        }
    };
    this.genCorrectTiles = function (){
        let tile = genRanNum(this.tileStorage.length, this.column);
        for (i = 0; i < tile.length; i++){
            this.tileStorage[tile[i]].correctTile();
        }
    }
}

function Game(x) {
    let game = this;
    this.player = x;
    this.grid = new Grid();
    this.score = 0;
    this.moves = this.grid.column;
    this.mtiles = this.grid.column;
    this.correct = 0;
    this.nextGrid = function(){
        this.mtiles = this.grid.column;
        this.grid.rotate();
        if (this.score < 0){
            endgame();
        }
        if (this.correct < this.mtiles){
            this.stagedown();
        } else {
            this.stageup();
        }
        $("#level").html(this.grid.column - 3);
        this.correct = 0;
        this.moves = this.grid.column;
        this.startRan();
    }
    this.stageup = function () {
        if(this.grid.column < 8){
            this.grid.increase();
        }
        this.grid.update();
    };
    this.stagedown = function () {
        this.grid.decrease();
        this.grid.update();
    };
    this.startRan = function () {
        setTimeout(function (){
            game.grid.genCorrectTiles();
            setTimeout(function (){
                game.grid.rotate();
                setTimeout(function (){
                    game.grid.enableClick();
                }, 600);
            }, 1200);
        }, 1200);   
    }
    this.grid.update();
    this.startRan();
}

function load() {
    $("#topbar").animate({
        height: "toggle"
    }, 0);
    $("#terminate_button").fadeToggle(0);
    $("#end_screen").fadeToggle(0);
    overlay();
}

function overlay() {
    $("#title_class").fadeToggle(900);
    $("#title_game").fadeToggle(900);
    $("#title_enter").fadeToggle(900);
    $("#username_input").fadeToggle(900);
    $("#start_button").fadeToggle(900);
}

function enter() {
    let buffer = document.getElementById("username_input").value;
    if (buffer == null || buffer == ""){
        alert("Please enter a username")
        return;
    }
    overlay();

    $("#start_screen").fadeToggle(1200);
    $("#topsec_name").html("<a><b>" + buffer + "</b></a>");
    $("#topbar").animate({
        height: "toggle"
    }, 500);
    $("#terminate_button").fadeToggle(500);
    start = new Game(buffer);
}

function genRanNum(end, iter){
    let array = [];
    while (array.length < iter){
        let x = Math.floor(Math.random() * end);
        if(array.indexOf(x) === -1){
            array.push(x)
        }
    }
    return array;
}

function terminate(){
    let user = confirm("Are you sure you want to terminate");
    if (user == true){
        endgame();
    }
}

function endgame() {
    $("#username").html(start.player);
    $("#final_score").html(start.score);
    $("#end_screen").fadeToggle(1200);
    $("#submit_button").fadeToggle(1600);
    $("#restart_button").fadeToggle(1600);
    $("#game_over").fadeToggle(1600);
}

function restart() {
    location.reload();
}