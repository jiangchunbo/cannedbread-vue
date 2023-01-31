function loadImage(buffer, handleImage) {
  const img = new Image()
  img.onload = function() {
    handleImage(img)
  }
  img.src = buffer
}

function readFile(file, handleBuffer) {
  const reader = new FileReader()
  reader.onloadend = function(e) {
    handleBuffer(e.target.result)
  }
  reader.readAsDataURL(file)
}

function createCanvas(image) {
  const canvasElement = document.createElement('canvas')
  const ctx = canvasElement.getContext('2d')
  canvasElement.width = image.width
  canvasElement.height = image.height
  console.log(image.width, image.height)
  ctx.drawImage(image, 0, 0, canvasElement.width, canvasElement.height)
  return canvasElement
}

export function resizeFile(file, quality, handleBlob) {
  readFile(file, function(buffer) {
    loadImage(buffer, function(image) {
      const canvas = createCanvas(image)
      canvas.toBlob((blob) => {
        handleBlob(blob)
      }, 'image/jpeg', quality)
    })
  })
}
