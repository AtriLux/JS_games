
const fieldHTML = document.querySelector('#field')
const fieldSizeStart = fieldHTML.getBoundingClientRect().width
fieldHTML.style.display = 'none'
const body = document.querySelector('body')
const borderSize = 1
let cellCount, cellCountAll, cellSize, cellSizeReal, fieldSize, field
let bombCount, bombFound, openCellCount, time
const difficult = document.querySelector('#difficultUp')
const text = document.querySelectorAll('.textAll')
const clientCount = document.querySelectorAll('input')

//создание игрового поля
const createField = () => {
cellSize = fieldSizeStart / cellCount
cellSizeReal = cellSize + borderSize * 2
fieldSize = cellSizeReal * cellCount
fieldHTML.style.height = fieldSize + 'px'
fieldHTML.style.width = fieldSize + 'px'
for (let i = 0; i < cellCountAll; i++) {  
    let cell = document.createElement('div')
    cell.className = 'cell'
    fieldHTML.append(cell)
    cell.innerHTML = 0
    cell.style.height = cellSize + 'px', cell.style.width = cellSize + 'px'
    cell.style.left = i % cellCount * cellSizeReal + 'px'
    cell.style.top = - Math.floor(i/cellCount) * cellSizeReal * 
        (cellCount - 1) - i % cellCount * cellSizeReal + 'px'
    }
//увеличение шрифта в клетках
field = document.querySelectorAll('.cell')
field.forEach((cell) => {
    cell.style.fontSize = cellSize * 0.9 + 'px'
    cell.style.textAlign = 'center'
})
}

const deleteField = () => {
    let child = fieldHTML.lastElementChild
    while (child) {
        fieldHTML.removeChild(child)
        child = fieldHTML.lastElementChild
    }
}

//первоначальная расстановка относительно клиентских размеров экрана
let docWidth, docHeight
const timerHTML = document.querySelector('#timer')
const resetButton = document.querySelector('#reset')
const bombCountHTML = document.querySelector('#bombCount')
const giveUpButton = document.querySelector('#giveUp')
const changeButton = document.querySelector('#changeField')

//смена положения всех игровых блоков
const fieldPosition = () => {
    docWidth = document.documentElement.clientWidth
    docHeight = document.documentElement.clientHeight

    fieldHTML.style.top = (docHeight - fieldSize - 30) / 2 + 'px'

    bombCountHTML.style.right = fieldHTML.getBoundingClientRect().left + 'px'
    bombCountHTML.style.top = fieldHTML.getBoundingClientRect().top - 65 + 'px'

    timerHTML.style.top = (docHeight - fieldSize - 25) / 2 + 'px'
    
    giveUpButton.style.right = fieldHTML.getBoundingClientRect().left + 'px'
    giveUpButton.style.bottom = fieldHTML.getBoundingClientRect().top - 20 + 'px'

    resetButton.style.left = fieldHTML.getBoundingClientRect().left + 'px'
    resetButton.style.top = (docHeight + fieldSize + 40) / 2 + 'px'

    changeButton.style.left = fieldHTML.getBoundingClientRect().left + 'px'
    changeButton.style.top = (docHeight + fieldSize + 120) / 2  + 'px'
}

//рандомные бомбы
const spawnBomb = (count) => {
    let index
    while (count !== 0) {
        index = Math.floor(Math.random() * cellCountAll)
        if (!field[index].classList.contains('bombBlock')) {
            field[index].classList.add('bombBlock')
            count--
        }
    }
}

//перекраска числа бомб в зависимости от его значения
const paintCount = (num) => {
    if (num === 0) return 'lightgrey'
    if (num === 1) return 'forestgreen'
    if (num === 2) return 'royalblue'
    if (num === 3) return 'indianred'
    if (num === 4) return 'firebrick'
    if (num === 5) return 'purple'
    if (num === 6) return 'red'
    if (num === 7) return 'navy'
    if (num === 8) return 'black'
}

//внесение в блок счетчик кол-ва бомб вокруг в начале игры
const getNumberCell = (cell) => {
    const index = Array.prototype.indexOf.call(field, cell)
    let count = cell.innerHTML
    if ((index % cellCount !== 0) && //кроме первого ряда
        (field[index - 1].classList.contains('bombBlock'))) count++
    if ((index % cellCount !== cellCount - 1) && //кроме последнего ряда
        (field[index + 1].classList.contains('bombBlock'))) count++
    if ((index > cellCount) && //кроме первой строчки
        (field[index - cellCount].classList.contains('bombBlock'))) count++
    if ((index < cellCountAll - cellCount) && //кроме последней строчки
        (field[index + cellCount].classList.contains('bombBlock'))) count++
    if ((index % cellCount !== 0) && 
        (index > cellCount) && //проверяет левый верхний
        (field[index - 1 - cellCount].classList.contains('bombBlock'))) count++
    if ((index % cellCount !== cellCount - 1) && 
        (index > cellCount) && //проверяет правый верхний
        (field[index + 1 - cellCount].classList.contains('bombBlock'))) count++
    if ((index % cellCount !== 0) && 
        (index < cellCountAll - cellCount) && //проверяет левый нижний
        (field[index - 1 + cellCount].classList.contains('bombBlock'))) count++
    if ((index % cellCount !== cellCount - 1) && 
        (index < cellCountAll - cellCount) && //проверяет правый нижний
        (field[index + 1 + cellCount].classList.contains('bombBlock'))) count++
    cell.innerHTML = count
}

//рекурсивный поиск и открытие нулевых клеток
const findNullBomb = (cell) => {
    const index = Array.prototype.indexOf.call(field, cell)
    if (index % cellCount !== cellCount - 1)
        if (!field[index + 1].classList.contains('openCell')) 
            openCell(field[index + 1])
    if (index % cellCount !== 0)
        if (!field[index - 1].classList.contains('openCell')) 
            openCell(field[index - 1])
    if (index < cellCountAll - cellCount)
        if (!field[index + cellCount].classList.contains('openCell')) 
            openCell(field[index + cellCount])
    if (index > cellCount)
        if (!field[index - cellCount].classList.contains('openCell')) 
            openCell(field[index - cellCount])
}

//открытие клеток при клике
const openCell = (cell) => {
    setTimeout( () => {
        cell.classList.add('openCell')
        openCellCount = document.querySelectorAll('.openCell').length
        if (openCellCount === cellCountAll - bombCount) winGame()
        cell.style.color = paintCount(Number(cell.innerHTML))
        if (cell.innerHTML == 0) findNullBomb(cell)
    }, 50)
}

//просчет времени с начала игры
let timeStartGame, timeInGame
const timeNow = () => {
    timeInGame = new Date().getTime() - timeStartGame.getTime()
    return Math.floor(timeInGame / 1000)
}

//добавляет бомбы поверх каждого блока с бомбой
const addElem = (cell) => {
    let elem = document.createElement('div')
    if (cell.classList.contains('bombBlock')) {
        elem.className = 'bomb'
        elem.innerHTML = '&#10038;'
        elem.style.top = - cellSize * 0.15 + 'px'
    }
    if (cell.classList.contains('flagBlock')) {
        elem.className = 'flag'
        elem.innerHTML = '?'
        elem.style.top = '0px'
    }
    if (cell.childNodes[1])
        if (cell.childNodes[1].classList.contains('flag')) {
            elem.className = 'bombWithFlag'
            elem.innerHTML = '&#10038;'
            elem.style.top = - cellSize * 0.15 + 'px'
            deleteFlag(cell.childNodes[1])
        }
    elem.style.width = cellSize + 'px'
    elem.style.height = cellSize + 'px'
    cell.append(elem)
}

//добавление флажка при пкм, уменьшение счетчика бомб
const addFlag = (cell) => {
    cell.classList.add('flagBlock')
    if (cell.classList.contains('bombBlock')) bombFound++
    if (bombFound === bombCount) winGame()
    let index = bombCountHTML.innerHTML.indexOf(' ')
    let count = Number(bombCountHTML.innerHTML.slice (0, index))
    bombCountHTML.innerHTML = --count + ' &#10038;'
    addElem(cell)
}

const deleteFlag = (cell) => {
    cell.parentElement.classList.remove('flagBlock')
    let index = bombCountHTML.innerHTML.indexOf(' ')
    let count = Number(bombCountHTML.innerHTML.slice (0, index))
    bombCountHTML.innerHTML = ++count + ' &#10038;'
    cell.remove()
}

//вне зависимости от результата происходит в конце игры
const endGame = () => {
    clearInterval(time)
    const bombsBlock = document.querySelectorAll('.bombBlock')
    bombsBlock.forEach((cell) => addElem(cell))
    const fieldNotClick = document.createElement('div')
    fieldNotClick.className = 'fieldNotClick'
    document.body.append(fieldNotClick)
    fieldNotClick.style.top = fieldHTML.getBoundingClientRect().top + 'px'
    fieldNotClick.style.left = fieldHTML.getBoundingClientRect().left + 'px'
    fieldNotClick.style.width = fieldSize + 'px'
    fieldNotClick.style.height = fieldSize + 'px'
    giveUpButton.style.display = 'none'
    resetButton.style.display = 'block'
    changeButton.style.display = 'block'
}

//победа в игре
const winGame = () => {
    endGame()
    body.style.backgroundColor = 'lightgreen'
    setTimeout (() => alert('Поздравляем! Вы победили!'), 100)
}

//проигрыш в игре
const loseGame = () => {
    endGame()
    body.style.backgroundColor = 'crimson'
    setTimeout (() => alert('Вы проиграли!'),//(`Вы проиграли со счетом ${points}, игра длилась ${timeInGame/60000} минут`),
    100)
}

//все в начальное положение для новой игры
const newGame = () => {
    fieldHTML.style.display = 'block'
    text.forEach((txt) => txt.style.display = 'none')
    cellCountAll =  Math.pow(cellCount, 2)
    if (fieldHTML.children.length !== cellCountAll) deleteField()
    if (fieldHTML.children.length === 0) createField()
    if (document.body.lastChild.className === 'fieldNotClick')
        document.body.lastChild.remove()
    const bombsRemove = document.querySelectorAll('.bomb')
    bombsRemove.forEach((bomb) => bomb.remove())
    field.forEach((cell) => {
        cell.className = 'cell'
        cell.innerHTML = '0'
        cell.style.color = 'dimgrey'
    })
    fieldPosition()
    bombCountHTML.innerHTML = bombCount + ' &#10038;'
    bombFound = 0
    bombCountHTML.style.display = 'block'
    giveUpButton.style.display = 'block'
    timerHTML.style.display = 'block'
    changeButton.style.display = 'none'
    spawnBomb(bombCount)
    field.forEach((cell) => getNumberCell(cell))

    let index = 0
    while ((field[index].classList.contains('bombBlock')) || 
        (field[index].innerHTML !== '0'))
            index = Math.floor(Math.random() * cellCountAll)
    setTimeout(openCell, 500, field[index])

    timer = 0
    timeStartGame = new Date()
    time = setInterval(() => timerHTML.innerHTML = timeNow(), 1000)
}

fieldHTML.onclick = (event) => {
    if (event.target.classList.contains('bombBlock')) loseGame()
    else if (!event.target.classList.contains('flag')) openCell(event.target)
}

fieldHTML.oncontextmenu = (event) => {
    if (event.target.classList.contains('flag')) deleteFlag(event.target)
    else if (!event.target.classList.contains('openCell')) addFlag(event.target)
    return false
}

giveUpButton.onclick = () => loseGame()

//при нажатии на кнопку перезапуска
resetButton.onclick = () => {
    resetButton.style.display = 'none'
    body.style.backgroundColor = 'grey'
    timerHTML.innerHTML = '0'
    newGame()
}

changeButton.onclick = () => {
    document.body.style.backgroundColor = 'grey'
    fieldHTML.style.display = 'none'
    document.querySelector('.fieldNotClick').style.display = 'none'
    bombCountHTML.style.display = 'none'
    timerHTML.style.display = 'none'
    resetButton.style.display = 'none'
    changeButton.style.display = 'none'
    text.forEach((txt) => txt.style.display = 'flex')
}

difficult.onclick = (event) => {
    if (event.target.id === 'easy') {
        cellCount = 9
        bombCount = 10
        newGame()
    }
    if (event.target.id === 'normal') {
        cellCount = 16
        bombCount = 40
        newGame()
    }
    if (event.target.id === 'hard') {
        cellCount = 22
        bombCount = 99
        newGame()
    }
}

document.addEventListener('keyup', (event) => {
    if ((event.code === 'Enter') && (clientCount[0].value !== '') && (clientCount[1].value !== '')) {
        cellCount = Number(clientCount[0].value)
        bombCount = Number(clientCount[1].value)
        newGame()
    }
})
