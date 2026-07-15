#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs'
import zlib from 'zlib'

function crc32(buf) {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c
  }
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff]
  return ((crc ^ 0xffffffff) >>> 0)
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuffer = Buffer.from(type)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])))
  return Buffer.concat([len, typeBuffer, data, crcBuf])
}

function createPNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // RGB color type

  const raw = Buffer.alloc(size * (1 + size * 3))
  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 3)
    raw[row] = 0
    for (let x = 0; x < size; x++) {
      raw[row + 1 + x * 3] = r
      raw[row + 1 + x * 3 + 1] = g
      raw[row + 1 + x * 3 + 2] = b
    }
  }

  const compressed = zlib.deflateSync(raw)

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync('public/icons', { recursive: true })

const sizes = [16, 32, 48, 128]
for (const size of sizes) {
  writeFileSync(`public/icons/icon${size}.png`, createPNG(size, 37, 99, 235))
  console.log(`created public/icons/icon${size}.png`)
}
