function game() {
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    const p = document.getElementById("points");

    const t = 10; //Framerate
    const m = 30; //Move of the player
    const mX = c.width; //Max x and y values for the player
    const mY = c.height;

    let x = 0, y = 0;
    let vector = [0, 0]; //Move vector
    const keys = []; //Keys pressed
    let player = [[0, 0]]; //Array of segments of the player
    let playerColor = 0;
    let points = 0;

    //0 or 1 - spawned; x; y
    const colors = [
        "rgb(0, 0, 255)", // Blue
        "rgb(255, 0, 0)", // Red
        "rgb(0, 255, 0)", // Green
        "rgb(255, 255, 0)" // Yellow
    ];
    const apple = [false, Math.floor((Math.random() * 10) + 1) * 30, Math.floor((Math.random() * 10) + 1) * 30, Math.floor((Math.random() * (colors.length)))];
    
    //Listen for keys and queue them to be processed in the game frame
    document.body.addEventListener("keydown", event => {
        keys.push(event.key);
    })

    //Each game frame
    setInterval(() => {
        ctx.clearRect(0, 0, mX, mY);

        //Spawn apple
        if (!apple[0]) {
            console.log(`Player:${player}; Apple ${apple}`);
            let newAppleX = Math.floor((Math.random() * 10) + 1) * 30;
            let newAppleY = Math.floor((Math.random() * 10) + 1) * 30;
            do {
                newAppleX = Math.floor((Math.random() * 10) + 1) * 30;
                newAppleY = Math.floor((Math.random() * 10) + 1) * 30;
            } while(player.some((segment) => {return segment[0] == newAppleX && segment[1] == newAppleY}));
            apple[0] = true;
            apple[1] = newAppleX;
            apple[2] = newAppleY;
            apple[3] = Math.floor((Math.random() * (colors.length))) ;
        }
        ctx.fillStyle = colors[apple[3]];
        ctx.fillRect(apple[1], apple[2], m, m);
        ctx.fillStyle = colors[playerColor];

        //Check for user input
        for (let i = 0; i < keys.length; i++) {
            let oldv = vector;
            switch (keys[i].toLowerCase()) {
                case "a":
                    vector = [-1, 0];
                    break;
                case "w":
                    vector = [0, -1];
                    break;
                case "d":
                    vector = [1, 0];
                    break;
                case "s":
                    vector = [0, 1];
                    break;
                case "arrowright":
                    if(++playerColor > colors.length - 1) playerColor = 0;
                    break;
                case "arrowleft":
                    if(--playerColor < 0) playerColor = colors.length - 1;
                    break;
                default:
                    console.log("wrong key");
                    break;
            }
            //If the head position after the keypress would be equal to the segment of a player (if the player tries to make 180deg turn)
            if (player[1] && x + vector[0] * m == player[1][0] && y + vector[1] * m == player[1][1]) {
                console.log("AAA");
                vector = oldv;
            }
        }
        keys.length = 0;

        //Apply vector
        x = x + vector[0] * m;
        y = y + vector[1] * m;

        //Don't let the player out of the map
        if (x > mX - m) { x = mX - m; gameOver(); } //TODO: change 3*m, it's totally wrong lmao
        if (x < 0) { x = 0; gameOver(); }
        if (y > mY - m) { y = mY - m; gameOver(); }
        if (y < 0) { y = 0; gameOver(); }

        //Rewrite the new player position (every segment now has the position of the segment ahead of it)
        for (let i = player.length - 1; i >= 0; i--) {
            player[i] = player[i - 1];
        }
        player[0] = [x, y];

        //Consume an apple
        if (x == apple[1] && y == apple[2]) {
            // Only award points if the apple is the same color as the player
            if (apple[3] == playerColor){
                p.innerHTML = ++points + " points";
                player.push([player[player.length - 1][0] - vector[0] * 30, player[player.length - 1][1] - vector[1] * 30]);
            }
            apple[0] = 0;
        }

        //Check player-player collision
        for (let i = 1; i < player.length; i++) {
            if (player[i][0] == x && player[i][1] == y) {
                gameOver();
            }
        }

        //Draw player
        ctx.fillStyle = colors[playerColor];
        for (let i = 0; i < player.length; i++) {
            ctx.fillRect(player[i][0], player[i][1], 30, 30);
        }
    }, 1000 / t); //The framerate


    function gameOver() {
        x = 0; y = 0;
        points = 0;
        player.length = 1;
        p.innerHTML = points + " points";
        vector = [0, 0];

        apple[1] = Math.floor((Math.random() * 10) + 1) * 30;
        apple[2] = Math.floor((Math.random() * 10) + 1) * 30;
    }
}