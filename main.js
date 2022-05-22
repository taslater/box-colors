const maxZIndex = 2147483647
let currentZIndex = maxZIndex

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.loaded = true

    }
    else if (entry.target.loaded) {
      entry.target.remove()
    }
  })
})


function overTile(tile) {
  const rect = tile.getBoundingClientRect()
  const overTile = document.createElement("div")
  overTile.className = "tile over"
  overTile.style.backgroundColor = tile.style.backgroundColor
  overTile.style.left = `${Math.round(rect.left)}px`
  overTile.style.top = `${Math.round(rect.top)}px`
  overTile.style.width = `${Math.round(rect.width)}px`
  overTile.style.height = `${Math.round(rect.height)}px`
  overTile.style.zIndex = currentZIndex
  currentZIndex--
  if (currentZIndex == 0) currentZIndex = maxZIndex
  setEltColorToRand(tile)
  observer.observe(overTile)

  const shadowTile = document.createElement("div")
  shadowTile.className = "tile over shade"
  shadowTile.style.backgroundColor = "black"
  shadowTile.style.left = `${Math.round(rect.left)}px`
  shadowTile.style.top = `${Math.round(rect.top)}px`
  shadowTile.style.width = `${Math.round(rect.width)}px`
  shadowTile.style.height = `${Math.round(rect.height)}px`
  shadowTile.style.zIndex = currentZIndex
  //currentZIndex--
  //if (currentZIndex == 0) currentZIndex = maxZIndex
  // setEltColorToRand(tile)
  observer.observe(shadowTile)

  const finalAngle = Math.floor(720 * Math.random()) - 360
  const offsetX = Math.floor(400 * Math.random()) - 200

  const droppingKeyframes = [
    { transform: '',
  },

    {
      transform: `translate(${offsetX}px, 150vh) rotate(${finalAngle}deg)`,
      // boxShadow: `100px 100px 0px rgba(0, 0, 0, 1)`
    }
  ];

  const shadowKeyframes = [
    { transform: '',
    filter: 'blur(0px)',
    backgroundColor: 'rgba(0,0,0,.8)'
  },

    {
      transform: `translate(${offsetX+20}px, 150vh) rotate(${finalAngle}deg)`,
      filter: 'blur(10px)',
      backgroundColor: 'rgba(0,0,0,0.1)'
    }
  ]

  const droppingOptions = {
    duration: 1200,
    easing: 'ease-in',
    // iterations: 1,
  }

  document.body.appendChild(shadowTile)
  document.body.appendChild(overTile)
  shadowTile.animate(shadowKeyframes, droppingOptions);
  overTile.animate(droppingKeyframes, droppingOptions);
}

function setEltColorToRand(tile) {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var bgColor = "rgb(" + x + "," + y + "," + z + ")";
  tile.style.background = bgColor;
}


window.addEventListener("load", () => {
  setTiles()
})

window.addEventListener("resize", () => {
  setTiles()
  // debounce(setTileDim, 500)
})


// function setTileDim() {
//   const targetDim = 100
//   const windowWidth = window.innerWidth
//   const tilesPerRow = Math.max(1, Math.round(windowWidth / targetDim))
//   const tileDim = Math.floor(windowWidth / tilesPerRow)
//   document.documentElement.style.setProperty('--tile-dim', `${tileDim}px`);
// }

function setTiles() {
  const targetDim = 100
  const windowWidth = window.innerWidth
  const tilesPerRow = Math.max(1, Math.round(windowWidth / targetDim))
  const tileDim = Math.floor(windowWidth / tilesPerRow)
  document.documentElement.style.setProperty('--tile-dim', `${tileDim}px`);

  const targetRowCount = Math.ceil(window.innerHeight / tileDim)
  const currentTiles = document.getElementsByClassName('tile')
  const currentTileCount = currentTiles.length
  const targetTileCount = targetRowCount * tilesPerRow

  if (currentTileCount < targetTileCount) {
    const newTile = document.createElement("div")
    newTile.className = "tile"
    newTile.setAttribute("onmouseenter", "overTile(this)")
    newTile.setAttribute("ontouchstart", "overTile(this)")
    const newTiles = []
    for (let i = currentTileCount; i < targetTileCount; i++) {
      newTiles.push(newTile.cloneNode(true))
    }
    document.getElementById("tile-container").append(...newTiles)
  } else if (currentTileCount > targetTileCount) {
    for (let i = currentTileCount - 1; i >= targetTileCount; i--) {
      currentTiles[i].remove()
    }
  }
}

// // https://stackoverflow.com/questions/45905160/javascript-on-window-resize-end
// // Debounce
// function debounce(func, time) {
//   var time = time || 100; // 100 by default if no param
//   var timer;
//   return function (event) {
//     if (timer) clearTimeout(timer);
//     timer = setTimeout(func, time, event);
//   };
// }