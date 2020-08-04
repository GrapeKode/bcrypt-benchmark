const bcrypt = require('bcrypt');
const saltRounds = 8;
const myPlaintextPassword = 'Mystr0ngP@SSW0RD';
const timing = {
  hash: [],
  compare: []
}
let maxIterations = 1000
let startDate;
let endDate;
let hashAsync;
let compareAsync;

const asyncHash = async () => {
  hashAsync = await bcrypt.hash(myPlaintextPassword, saltRounds)
}

const asyncCompare = async () => {
  compareAsync = await bcrypt.compare(myPlaintextPassword, hashAsync)
}

async function test(condition) {
  if (!condition) {
    return
  }

  startDate = new Date()
  await asyncHash()
  endDate = new Date()

  timing.hash.push(endDate.getTime() - startDate.getTime())

  startDate = new Date()
  await asyncCompare()
  endDate = new Date()

  timing.compare.push(endDate.getTime() - startDate.getTime())

  maxIterations--;
  return test(maxIterations > 0)
}

const bcryptAsync = (async () => {
  console.log(`START: ${maxIterations} iterations for async <bcrypt> with saltRound ${saltRounds}`)
  const startDate = new Date()
  await test(maxIterations > 0)
  const endDate = new Date()
  console.log(`END: Execution for async <bcrypt> with saltRound ${saltRounds} ended at: ${(endDate - startDate)/1000}sec`)

  let hashAVG = 0
  timing.hash.forEach(time => hashAVG += time)

  let compareAVG = 0
  timing.compare.forEach(time => compareAVG += time)

  console.log({
    hashAVG: `${hashAVG / timing.hash.length} ms`,
    compareAVG: `${compareAVG / timing.compare.length} ms`,
  })
})()