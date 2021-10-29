function br()
{
    let x = 0, y = 0;
    const t = 10; //Framerate
    const m = 30; //Move of the player
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    const p = document.getElementById("points");

    const mX = c.width; //Max x and y values for the player
    const mY = c.height;

    let vector = [0, 0]; //Move vector
    let keys = []; //Keys pressed
    let points = 0;

    //0 or 1 - spawned; x; y
    let apple = [false, Math.floor((Math.random() * 10) + 1) * 30, Math.floor((Math.random() * 10) + 1) * 30];
    console.log(apple[1] + " " + apple[2]);
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
                    //x -= m;
                    vector = [-1, 0];
                    break;
                case 38:
                    //y -= m;
                    vector = [0, -1];
                    break;
                case 39:
                    //x += m;
                    vector = [1, 0];
                    break;
                case 40:
                    //y += m;
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
        if(x > mX - m){x = mX - m;} //TODO: change 3*m, it's totally wrong lmao
        if(x < 0){x = 0;}
        if(y > mY - m){y = mY - m;}
        if(y < 0){y = 0;}

        console.log("x: " + x + "y: " + y);

        //Consume an apple
        if(x == apple[1] && y == apple[2])
        {
            points++;
            p.innerHTML = points + " points";
        }
        //Draw player
        ctx.fillRect(x, y, 30, 30);
    }, 1000/t); //The framerate
}