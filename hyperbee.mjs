import HyperDB from 'hyperdb'
import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'
import db from './spec/db/index.js' // import db schema
import goodbye from 'graceful-goodbye'

async function log (query) {
  console.log(await query.toArray())
}

const topic = Buffer.alloc(32).fill('theworldisblueandred') // A topic must be 32 bytes
const localCorestore = new Corestore('./local.db')

// returns a hypercore
const a = localCorestore.get({ name: 'local' })

// Create db backed by a hyperbee
// setting autoUpdate to true will automatically update to the
// latest snapshot after a change
const local = HyperDB.bee(a, db, { autoUpdate: true })
await local.ready()
const bootstrapKey = local.core.key // we will bootstrap peer core from this key

await local.insert('@hyperdb-example/user', { id: 1, name: 'Maf' })
await local.insert('@hyperdb-example/user', { id: 2, name: 'Anna' })
await local.insert('@hyperdb-example/user', { id: 3, name: 'supersu' })
await local.flush() // Necessary to persist changes

// Loop to keep adding data for testing
let id = 4 // Starting id
const insertUser = async () => {
  await local.insert('@hyperdb-example/user', { id, name: `Maf+${id}` })
  id++
  await local.flush()
}
// Execute insertUser every 5 seconds (5000 milliseconds)
setInterval(insertUser, 5000)

// Create a new hyperswarm
const localSwarm = new Hyperswarm()

localSwarm.on('connection', async (conn) => {
  localCorestore.replicate(conn) // replicate local core across all peers
})

const swarm1 = localSwarm.join(topic)
await swarm1.flushed() // finish joining the swarm

// Storage for second peer
const remoteCorestore = new Corestore('./remote.db')
// Use the first peer's bootstrap key to create this hypercore
const b = remoteCorestore.get({ key: bootstrapKey })

const remote = HyperDB.bee(b, db, { autoUpdate: true })
await remote.ready()

const remoteSwarm = new Hyperswarm()
remoteSwarm.on('connection', async (conn) => {
  console.log('Received a connection')
  remoteCorestore.replicate(conn)
})

const swarm2 = remoteSwarm.join(topic)
await swarm2.flushed()

await log(remote.find('@hyperdb-example/user', {})) // list all the initial values

async function remoteOnChange () {
  // Set the db to use the latest snapshot
  // unnecessary if we have set `autoUpdate: true` while creating the db
  // remote.update()
  console.log('New update:')
  await log(remote.find('@hyperdb-example/user', {})) // list all the values
}

// A watcher can watch when the database has updated
const watcher = remote.watch(remoteOnChange)

// Shut down gracefully by destroying connection to swarm
goodbye(async () => {
  await local.close()
  await remote.close()
  await swarm1.destroy()
  await swarm2.destroy()
})
