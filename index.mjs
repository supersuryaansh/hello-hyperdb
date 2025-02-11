import HyperDB from 'hyperdb'
import db from './spec/db/index.js'

const local = HyperDB.rocks('./my-rocks.db', db)

async function log (query) {
  console.log(await query.toArray())
}

await local.insert('@hyperdb-example/user', { id: 1, name: 'supersu' })
await local.insert('@hyperdb-example/user', { id: 2, name: 'Maf' })
await local.insert('@hyperdb-example/user', { id: 3, name: 'Anna' })


// Execute a query
console.log("Result with limit set to 1:")
await log(local.find('@hyperdb-example/user', {}, { limit: 1 })) // list only one due to limit

console.log("Result with no limit:")
await log(local.find('@hyperdb-example/user', {})) // list all the values

console.log("Get a specific record")
const single = await local.get('@hyperdb-example/user', {id: 2})
console.log(single) // list all the values

console.log("Delete a record")
await local.delete('@hyperdb-example/user', {id: 2})
await log(local.find('@hyperdb-example/user', {})) // list all the values

await local.flush() // Need to flush to persist the changes

await local.close() // close the db
