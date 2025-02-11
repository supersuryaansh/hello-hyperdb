// This code creates a schema for the database and saves it to the disk

import Hyperschema from 'hyperschema'
import HyperDB from 'hyperdb/builder/index.js'

// Try to load from an existing schema, if it does not exist then create a new one
const schema = Hyperschema.from('./spec/schema')

// A namespace for this specific schema
const ns = schema.namespace('hyperdb-example')

// Create a schema for the collection
// You can find a list of supported data types here: https://github.com/holepunchto/compact-encoding
ns.register({
  name: 'user',
  compact: false,
  fields: [{
    name: 'id',
    type: 'int8',
    required: true
  }, {
    name: 'name',
    type: 'string',
    required: true
  }
  ]
})

// Save to the disk
Hyperschema.toDisk(schema)

// This part registers a collection (similar to mongodb collections) and saves them to the disk.
const db = HyperDB.from('./spec/schema', './spec/db')
const blobs = db.namespace('hyperdb-example')

// Register this specific collection
blobs.collections.register({
  name: 'user',
  schema: '@hyperdb-example/user',
  key: ['id']
})

// Save to the disk so that it can be reused
HyperDB.toDisk(db)
