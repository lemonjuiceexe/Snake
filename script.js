function br()
{
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
    let points = 0;


    //0 or 1 - spawned; x; y
    const apple = [false, Math.floor((Math.random() * 10) + 1) * 30, Math.floor((Math.random() * 10) + 1) * 30]; //Const array can't be reassigned, but it's elements can be modified

    //Listen for keys
    document.body.addEventListener("keydown", ()=>
    {
        keys.push(event.keyCode);
    })

    //Each game frame
    setInterval(()=>
    {
        ctx.clearRect(0, 0, mX, mY);
        
        //Spawn apple
        if(!apple[0])
        {
            apple[1] = Math.floor((Math.random() * 10) + 1) * 30;
            apple[2] = Math.floor((Math.random() * 10) + 1) * 30;
            apple[0] = true;
        }
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(apple[1], apple[2], m, m);
        ctx.fillStyle = "rgb(0, 0, 0)";

        //Check key input and set vector
        for(let i = 0; i < keys.length; i++)
        {
            switch(keys[i])
            {
                case 37:
                    vector = [-1, 0];
                    break;
                case 38:
                    vector = [0, -1];
                    break;
                case 39:
                    vector = [1, 0];
                    break;
                case 40:
                    vector = [0, 1];
                    break;
                default:
                    console.log("wrong key");
                    break;
            }
        }
        keys.length = 0; //XDDD

        //Apply vector
        x = x + vector[0] * m;
        y = y + vector[1] * m;

        //Don't let the player out of the map
        if(x > mX - m){x = mX - m; points = 0; player.length = 1; p.innerHTML = points + " points"; x = 0; y = 0; vector =[0, 0];} //TODO: change 3*m, it's totally wrong lmao
        if(x < 0){x = 0; points = 0; player.length = 1; p.innerHTML = points + " points"; x = 0; y = 0; vector =[0, 0];}
        if(y > mY - m){y = mY - m; points = 0; player.length = 1; p.innerHTML = points + " points"; x = 0; y = 0; vector =[0, 0];}
        if(y < 0){y = 0; points = 0; player.length = 1; p.innerHTML = points + " points"; x = 0; y = 0; vector =[0, 0];}
        
        //Rewrite the new player position (every segment now has the position of the segment ahead of it)
        for(let i = player.length - 1; i >= 0; i--)
        {
            player[i] = player[i - 1];
        }
        player[0] = [x, y];

        // console.log("x: " + x + "y: " + y);

        //Consume an apple
        if(x == apple[1] && y == apple[2])
        {
            points++;
            p.innerHTML = points + " points";
            apple[0] = 0;
            player.push([player[player.length - 1][0] - vector[0] * 30, player[player.length - 1][1] - vector[1] * 30]);
        }
        //Draw player
        for(let i = 0; i < player.length; i++){
            ctx.fillRect(player[i][0], player[i][1], 30, 30);
        }
        

        lfp = points;
    }, 1000/t); //The framerate
}