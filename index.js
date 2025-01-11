const HyperDB = require('hyperdb')
const database = HyperDB.rocks('./my-rocks.db', require('./spec/db'))

async function main () {
  await database.insert('@hyperdb-example/test', { key: 'asdfghjkl', value: 'asd' })
  // Need to flush to persist the changes
  database.flush()

  // Execute a query
  const queryStreams = database.find('@hyperdb-example/test', {}, { limit: 100 }) // list all the values
  const allDocss = await queryStreams.toArray()
  console.log(allDocss)
}

main()
