
export function checkForDeath(){
  // if lead face hits the wall, DEAD!!
  if (
    this.state.snakeBody[0].left.__currentValue <= 0 || 
    this.state.snakeBody[0].top.__currentValue <= 0 ||
    this.state.snakeBody[0].left.__currentValue >= this.props.mapDimensions.width - this.props.characterDimensions.characterWidth ||
    this.state.snakeBody[0].top.__currentValue >= this.props.mapDimensions.height - this.props.characterDimensions.characterHeight
    ) {
    this.owenDies()
  }

  // if lead Owen hits another owen, while traveling perpindicularly to that Owen, DEAD!!
  else if (this.state.snakeBody.find( (face, i) => {
    return (i > 3) &&
      ( Math.abs(this.state.snakeBody[0].left.__currentValue - face.left.__currentValue) < this.props.characterDimensions.characterWidth ) &&
      ( Math.abs(this.state.snakeBody[0].top.__currentValue - face.top.__currentValue) < this.props.characterDimensions.characterHeight ) &&
      ( 
        (this.state.snakeBody[0].moving === 'left'  || this.state.snakeBody[0].moving === 'right') ? 
        (face.moving === 'up' || face.moving === 'down') : 
        (face.moving === 'left' || face.moving === 'right')
      )
  })) {
    this.owenDies()
  }
}

export function checkForItem(){
  // If the face is on the right and bottom of item
  if ( 
    (this.state.snakeBody[0].left.__currentValue > this.props.chickenWing.left) &&
    (this.state.snakeBody[0].top.__currentValue > this.props.chickenWing.top)
  ) {
    if (
      (this.state.snakeBody[0].left.__currentValue < this.props.chickenWing.left + this.props.itemDimensions.itemWidth) &&
      (this.state.snakeBody[0].top.__currentValue < this.props.chickenWing.top + this.props.itemDimensions.itemHeight)
    ) {
      this.owenEatsChicken()
    }
  }
  // Else if the face is on the left bottom relative to item
  else if (
    !(this.state.snakeBody[0].left.__currentValue > this.props.chickenWing.left) &&
    (this.state.snakeBody[0].top.__currentValue > this.props.chickenWing.top)
  ) {
    if (
      (this.state.snakeBody[0].left.__currentValue + this.props.characterDimensions.characterWidth > this.props.chickenWing.left) &&
      (this.state.snakeBody[0].top.__currentValue < this.props.chickenWing.top + this.props.itemDimensions.itemHeight)
    ) {
      this.owenEatsChicken()
    }
  }
  // Else if the face is on top right relative to item
  else if (
    (this.state.snakeBody[0].left.__currentValue > this.props.chickenWing.left) &&
    !(this.state.snakeBody[0].top.__currentValue > this.props.chickenWing.top)
  ) {
    if (
      (this.state.snakeBody[0].left.__currentValue < this.props.chickenWing.left + this.props.itemDimensions.itemWidth) &&
      (this.state.snakeBody[0].top.__currentValue + this.props.characterDimensions.characterHeight > this.props.chickenWing.top)
    ) {
      this.owenEatsChicken()
    }
  }
  // Else if the face is on the top left side of item
  else {
    if (
      (this.state.snakeBody[0].left.__currentValue + this.props.characterDimensions.characterWidth > this.props.chickenWing.left) &&
      (this.state.snakeBody[0].top.__currentValue + this.props.characterDimensions.characterHeight > this.props.chickenWing.top)
    ) {
      this.owenEatsChicken()
    }
  }
}
