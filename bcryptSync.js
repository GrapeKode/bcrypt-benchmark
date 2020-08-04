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
let hashSync;
let compareSync;

const syncHash = () => {
  hashSync = bcrypt.hashSync(myPlaintextPassword, saltRounds)
}

const syncCompare = () => {
  compareSync = bcrypt.compareSync(myPlaintextPassword, hashSync)
}

function test(condition) {
  if (!condition) {
    return
  }

  startDate = new Date()
  syncHash()
  endDate = new Date()

  timing.hash.push(endDate.getTime() - startDate.getTime())

  startDate = new Date()
  syncCompare()
  endDate = new Date()

  timing.compare.push(endDate.getTime() - startDate.getTime())

  maxIterations--;
  return test(maxIterations > 0)
}

const bcryptSync = (() => {
  console.log(`START: ${maxIterations} iterations for sync <bcrypt> with saltRound ${saltRounds}`)
  const startDate = new Date()
  test(maxIterations > 0)
  const endDate = new Date()
  console.log(`END: Execution for sync <bcrypt> with saltRound ${saltRounds} ended at: ${(endDate - startDate)/1000}sec`)

  let hashAVG = 0
  timing.hash.forEach(time => hashAVG += time)

  let compareAVG = 0
  timing.compare.forEach(time => compareAVG += time)

  console.log({
    hashAVG: `${hashAVG / timing.hash.length} ms`,
    compareAVG: `${compareAVG / timing.compare.length} ms`,
  })
})()