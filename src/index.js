// pixel art to pixels.json
const colors = require('./colors.json');
const pixels = require('../pixels.json');
const Jimp = require('jimp');
const fs = require('fs');

const dec2hex = (dec) => dec.toString(16).padStart(2, '0')

const config = {
    start: {
        x: 302,
        y: 869,
    },
    struct: "grb"
}

const newPixels = []

Jimp.read(`./src/structures/${config.struct}.png`, (err, img) => {
    if (err) throw err;

    for (let x = 0; x < img.bitmap.width; x++) {
        for (let y = 0; y < img.bitmap.height; y++) {
            const dec = img.getPixelColor(x, y)
            if (!dec) continue

            const rgba = Jimp.intToRGBA(dec)
            const color = dec2hex(rgba.r) + dec2hex(rgba.g) + dec2hex(rgba.b)
            const c = colors.find(c => c.hex == color.toUpperCase())

            if (!c?.id) {
                console.log(`Invalid color id! [${x},${y}]`)
                continue
            }

            const obj = {
                x: config.start.x + x,
                y: config.start.y + y,
                color: c?.id,
                priority: 3,
            }

            //console.log(config.start.x + x, config.start.y + y, c.name)
            console.log(`${x}, ${y}, ${c.hex}`)

            newPixels.push(obj)
        }
    }

    pixels.structures[config.struct].pixels = newPixels
    const data = JSON.stringify(pixels, null, 4);
    fs.writeFileSync('pixels.json', data);
});