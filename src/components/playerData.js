const players = {
  daniel: {
    displayName: 'Daniel',
    faceImage: require('../../images/daniel-kahle/daniel-face.png'),
    faceImageWithBorder: require('../../images/daniel-kahle/daniel-face-with-border.png'),
    gameplayImage: require('../../images/daniel-kahle/daniel-face-with-border.png'),
    landingText: require('../../images/daniel-kahle/daniel-logo-words.png'),
    itemToEat: require('../../images/daniel-kahle/taco.png'),
    faceWidth: 269,
    faceHeight: 318,
    itemWidth: 577,
    itemHeight: 493,
    itemScale: 93/100
  },
  charkie: {
    displayName: 'Charkie',
    faceImage: require('../../images/charkie/charkie-snake.png'),
    faceImageWithBorder: require('../../images/charkie/charkie-snake-with-border.png'),
    gameplayImage: require('../../images/charkie/charkie-snake-with-border.png'),
    landingText: require('../../images/charkie/charkie-logo-words.png'),
    itemToEat: require('../../images/charkie/watermelon.png'),
    faceWidth: 466,
    faceHeight: 614,
    itemWidth: 363,
    itemHeight: 298,
    itemScale: 93/100
  },
  betsy: {
    displayName: 'Betsy',
    faceImage: require('../../images/betsy-jones/betsy-snake.png'),
    faceImageWithBorder: require('../../images/betsy-jones/betsy-snake-with-border.png'),
    gameplayImage: require('../../images/betsy-jones/betsy-snake-with-border.png'),
    landingText: require('../../images/betsy-jones/betsy-logo-words.png'),
    itemToEat: require('../../images/betsy-jones/pizza.png'),
    faceWidth: 218,
    faceHeight: 196,
    itemWidth: 798,
    itemHeight: 625,
    itemScale: 83/100
  },
  dutch: {
    displayName: 'Dutch',
    faceImage: require('../../images/dutch/dutch-snake.png'),
    faceImageWithBorder: require('../../images/dutch/dutch-snake-with-border.png'),
    gameplayImage: require('../../images/dutch/dutch-snake-with-border.png'),
    landingText: require('../../images/dutch/dutch-logo-words.png'),
    itemToEat: require('../../images/dutch/championship-belt.png'),
    faceWidth: 365,
    faceHeight: 507,
    itemWidth: 785,
    itemHeight: 255,
    itemScale: 80/100
  },
  gabe: {
    displayName: 'Gabe',
    faceImage: require('../../images/gabe-rees/gabe-snake.png'),
    faceImageWithBorder: require('../../images/gabe-rees/gabe-snake-with-border.png'),
    gameplayImage: require('../../images/gabe-rees/gabe-snake-with-border.png'),
    landingText: require('../../images/gabe-rees/gabe-logo-words.png'),
    itemToEat: require('../../images/gabe-rees/beer-can.png'),
    faceWidth: 382,
    faceHeight: 490,
    itemWidth: 805,
    itemHeight: 1283,
    itemScale: 1
  },
  neil: {
    displayName: 'Neil',
    faceImage: require('../../images/neil/neil-snake.png'),
    faceImageWithBorder: require('../../images/neil/neil-snake-with-border.png'),
    gameplayImage: require('../../images/neil/neil-snake-with-border.png'),
    landingText: require('../../images/neil/neil-logo-words.png'),
    itemToEat: require('../../images/neil/water.png'),
    faceWidth: 505,
    faceHeight: 758,
    itemWidth: 280,
    itemHeight: 694,
    itemScale: 67/100
  },
  owenWilson: {
    displayName: 'Owen',
    faceImage: require('../../images/owen-wilson/owen-face.png'),
    faceImageWithBorder: require('../../images/owen-wilson/owen-face-with-border.png'),
    gameplayImage: require('../../images/owen-wilson/owen-face.png'),
    landingText: require('../../images/owen-wilson/owen-logo-words.png'),
    itemToEat: require('../../images/owen-wilson/chicken-wing.png'),
    faceWidth: 200,
    faceHeight: 233,
    itemWidth: 257,
    itemHeight: 196,
    itemScale: 1
  }
}

module.exports = players