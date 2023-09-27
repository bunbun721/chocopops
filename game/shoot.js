function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

var bulletTime1 = 0;

var bullet_player1_material = new THREE.MeshLambertMaterial(
{
    color: 0x00ff00, 
    transparent: false
});

function shoot()
{
    if (keyboard.pressed("space") && bulletTime1 + 0.8 < clock.getElapsedTime())
    {
        bullet = new THREE.Mesh(
            new THREE.SphereGeometry(2),
            bullet_player1_material);
        scene.add(bullet);
        bullet.position.x = player1.graphic.position.x + 7.5 * Math.cos(player1.direction);
        bullet.position.y = player1.graphic.position.y + 7.5 * Math.sin(player1.direction);
        bullet.angle = player1.direction;
        player1.bullets.push(bullet);
        bulletTime1 = clock.getElapsedTime();
    } 

    // move bullets
    var moveDistance = 5;

    for (var i = 0; i < player1.bullets.length; i++)
    {
        player1.bullets[i].position.x += moveDistance * Math.cos(player1.bullets[i].angle);
        player1.bullets[i].position.y += moveDistance * Math.sin(player1.bullets[i].angle);
    }

}

function collisions()
{
    bullet_collision();
    player_collision();
    player_falling();
    ennemy_moving();
    ennemy_random_shoot();
}

function bullet_collision()
{
    //collision between bullet and walls
    for (var i = 0; i < player1.bullets.length; i++)
    {
        if (Math.abs(player1.bullets[i].position.x) >= WIDTH / 2 ||
            Math.abs(player1.bullets[i].position.y) >= HEIGHT / 2)
        {
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
        }
    }

    // collision between bullet and ennemy
    for (var i = 0; i < player1.bullets.length; i++)
    {
        var x = player1.bullets[i].position.x;
        var y = player1.bullets[i].position.y;

        if (x > ennemy1.graphic.position.x - 10 &&
            x < ennemy1.graphic.position.x + 10 &&
            y > ennemy1.graphic.position.y - 10 &&
            y < ennemy1.graphic.position.y + 10)
        {
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
            ennemy1.dead();
        }
    }

    // collission between bullet and player
    for (var i = 0; i < ennemy1.bullets.length; i++)
    {
        var x = ennemy1.bullets[i].position.x;
        var y = ennemy1.bullets[i].position.y;

        if (x > player1.graphic.position.x - 10 &&
            x < player1.graphic.position.x + 10 &&
            y > player1.graphic.position.y - 10 &&
            y < player1.graphic.position.y + 10)
        {
            scene.remove(ennemy1.bullets[i]);
            ennemy1.bullets.splice(i, 1);
            i--;
            decrease_player_life();
        }
    }
}

function player_collision()
{
    //collision between player and walls
    var x = player1.graphic.position.x + WIDTH / 2;
    var y = player1.graphic.position.y + HEIGHT / 2;

    if ( x < 0 )
        player1.graphic.position.x -= x;
    if ( x > WIDTH )
        player1.graphic.position.x -= x - WIDTH;
    if ( y < 0 )
        player1.graphic.position.y -= y;
    if ( y > HEIGHT )
        player1.graphic.position.y -= y - HEIGHT;

}

var t = 0;
function player_falling()
{
    var nb_tile = 10;
    var sizeOfTileX = WIDTH / nb_tile;
    var sizeOfTileY = HEIGHT / nb_tile;
    var x = player1.graphic.position.x | 0;
    var y = player1.graphic.position.y | 0;
    var length = noGround.length;
    var element = null;

    for (var i = 0; i < length; i++) {
        element = noGround[i];

        if (element == undefined)
            continue;

        var tileX = (element[0]) | 0;
        var tileY = (element[1]) | 0;
        var mtileX = (element[0] + sizeOfTileX) | 0;
        var mtileY = (element[1] + sizeOfTileY) | 0;

        if ((x > tileX)
            && (x < mtileX-(sizeOfTileX/2))
            && (y > tileY) 
            && (y < mtileY-(sizeOfTileY/2)))
        {
            if (t + 1 < clock.getElapsedTime())
            {
                t = clock.getElapsedTime();
                decrease_player_life()
            }
        }
    }

}

function ennemy_moving()
{
    ennemy1.graphic.position.y += 0.5;
    if (ennemy1.graphic.position.y > HEIGHT / 2)
        ennemy1.graphic.position.y = -HEIGHT / 2;

    // make ennemy look at player
    var dx = player1.graphic.position.x - ennemy1.graphic.position.x;
    var dy = player1.graphic.position.y - ennemy1.graphic.position.y;
    ennemy1.direction = Math.atan2(dy, dx);
    ennemy1.graphic.rotation.z = ennemy1.direction;
    
}

function ennemy_random_shoot()
{
    if (getRandomIntInclusive(0, 100) == 0)
    {
        bullet = new THREE.Mesh(
            new THREE.SphereGeometry(2),
            bullet_player1_material);
        scene.add(bullet);
        bullet.position.x = ennemy1.graphic.position.x + 7.5 * Math.cos(ennemy1.direction);
        bullet.position.y = ennemy1.graphic.position.y + 7.5 * Math.sin(ennemy1.direction);
        bullet.angle = ennemy1.direction;
        ennemy1.bullets.push(bullet);
    } 

    // move bullets
    var moveDistance = 5;

    for (var i = 0; i < ennemy1.bullets.length; i++)
    {
        ennemy1.bullets[i].position.x += moveDistance * Math.cos(ennemy1.bullets[i].angle);
        ennemy1.bullets[i].position.y += moveDistance * Math.sin(ennemy1.bullets[i].angle);
    }
}

function decrease_player_life()
{
    player1.life--;
    player1.displayInfo();
    if (player1.life <= 0)
        player1.dead();
}