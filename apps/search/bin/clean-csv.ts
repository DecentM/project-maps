import fs from 'node:fs'

console.log('Reading file...')

const input = process.stdin
// const output = fs.createWriteStream('clean.csv')

const output: Array<object> = []

// output.write('id;lon;lat;amenity;shop;name;name_int;name:latin\n')

input.on('data', (chunk) => {
  for (const line of chunk.toString().split('\n')) {
    if (line.startsWith('@')) {
      continue
    }

    const [id, addr_city, addr_housenumber, addr_postcode, addr_state, addr_street, name, name_int, name_latin, name_en, amenity, phone, website, leisure, shop, barrier, tourism, artwork_type, landuse, opening_hours, bus, highway] = line.split('\t')

    // TODO: This will cause lines that are split by chunk borders to be ignored
    if (!id || Number.isNaN(Number(id)) || id.includes('.') || id.includes(' ')) {
      continue
    }

    if (name || name_int || name_latin) {
      output.push({ id, addr_city, addr_housenumber, addr_postcode, addr_state, addr_street, name, name_int, name_latin, name_en, amenity, phone, website, leisure, shop, barrier, tourism, artwork_type, landuse, opening_hours, bus, highway })
    }
  }
})

input.on('end', () => {
  console.log('Writing file...')

  fs.writeFileSync('clean.json', JSON.stringify(output))
})
