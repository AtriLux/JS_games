//основной блок движения и все стены
const player = document.getElementById('player')
const wallsVert = document.querySelectorAll('.vert')
const wallsHoriz = document.querySelectorAll('.horiz')
const body = document.querySelector('body')

//функция поиска координат любого блока на странице
const findBlock = (obj) => {
    let blockPosition = obj.getBoundingClientRect()
    blockPosition = {
        x1: blockPosition.left - 8, //левые верхний и нижний
        y1: blockPosition.top - 21.5, //правый и левый верхние
        x2: blockPosition.right - 8, //правые верхний и нижний
        y2: blockPosition.bottom - 21.5 //левый и правый нижние
    }
    return blockPosition
}

//массив стен с их координатами
const wallsVertPosition = []
wallsVert.forEach(wall => {
   wallsVertPosition[wallsVertPosition.length] = findBlock(wall)
   wall.innerHTML = '' //убирает подписи стен (для разработки отключать)
})
const wallsHorizPosition = []
wallsHoriz.forEach(wall => {
   wallsHorizPosition[wallsHorizPosition.length] = findBlock(wall)
   wall.innerHTML = '' //убирает подписи стен (для разработки отключать)
})

//начальное положение игрока
const startPosition = findBlock(player);

//функции для изменения стиля блока игрока при врезании
const startStyle = (obj) => {
    //alert('CRASH')
    player.style.left = startPosition.x1 + 'px'
    player.style.top = startPosition.y1 + 'px'
    body.style.backgroundColor = 'grey'
}

//обнаружение пересечения
const checkCrash = () => {
    const position = findBlock(player)
    for (wall of wallsVertPosition) {
        if ((position.y2 >= wall.y1 && position.y1 <= wall.y2) &&
            (position.x1 <= wall.x1 && position.x2 >= wall.x1 ||
            position.x1 <= wall.x2 && position.x2 >= wall.x2)) {
                body.style.backgroundColor = 'red'
                setTimeout(startStyle, 1000)
        }
    }
    for (wall of wallsHorizPosition) {
        if ((position.x2 >= wall.x1 && position.x1 <= wall.x2) &&
        (position.y1 <= wall.y1 && position.y2 >= wall.y1 ||
        position.y1 <= wall.y2 && position.y2 >= wall.y2)) {
            body.style.backgroundColor = 'red'
            setTimeout(startStyle, 1000)
        }
    }
}

//стрелки
const rightArrow = document.getElementById('right')
const leftArrow = document.getElementById('left')
const downArrow = document.getElementById('down')
const upArrow = document.getElementById('up')

//движение стрелками
rightArrow.onclick = () => {
    player.style.left = (findBlock(player).x1 + 10) + 'px'
    checkCrash()
}
leftArrow.onclick = () => {
    player.style.left = (findBlock(player).x1 - 10) + 'px'
    checkCrash()
}
upArrow.onclick = () => {
    player.style.top = (findBlock(player).y1 - 10) + 'px'
    checkCrash()
}
downArrow.onclick = () => {
    player.style.top = (findBlock(player).y1 + 10) + 'px'
    checkCrash()
}
