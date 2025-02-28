// This file is autogenerated by the hyperdb compiler
/* eslint-disable camelcase */

const { IndexEncoder, c } = require('hyperdb/runtime')
const { version, getEncoding, setVersion } = require('./messages.js')

// '@hyperdb-example/user' collection key
const collection0_key = new IndexEncoder([
  IndexEncoder.UINT
], { prefix: 0 })

function collection0_indexify (record) {
  const a = record.id
  return a === undefined ? [] : [a]
}

// '@hyperdb-example/user' value encoding
const collection0_enc = getEncoding('@hyperdb-example/user/hyperdb#0')

// '@hyperdb-example/user' reconstruction function
function collection0_reconstruct (version, keyBuf, valueBuf) {
  const key = collection0_key.decode(keyBuf)
  setVersion(version)
  const record = c.decode(collection0_enc, valueBuf)
  record.id = key[0]
  return record
}
// '@hyperdb-example/user' key reconstruction function
function collection0_reconstruct_key (keyBuf) {
  const key = collection0_key.decode(keyBuf)
  return {
    id: key[0]
  }
}

// '@hyperdb-example/user'
const collection0 = {
  name: '@hyperdb-example/user',
  id: 0,
  encodeKey (record) {
    const key = [record.id]
    return collection0_key.encode(key)
  },
  encodeKeyRange ({ gt, lt, gte, lte } = {}) {
    return collection0_key.encodeRange({
      gt: gt ? collection0_indexify(gt) : null,
      lt: lt ? collection0_indexify(lt) : null,
      gte: gte ? collection0_indexify(gte) : null,
      lte: lte ? collection0_indexify(lte) : null
    })
  },
  encodeValue (version, record) {
    setVersion(version)
    return c.encode(collection0_enc, record)
  },
  trigger: null,
  reconstruct: collection0_reconstruct,
  reconstructKey: collection0_reconstruct_key,
  indexes: []
}

const collections = [
  collection0
]

const indexes = [
]

module.exports = { version, collections, indexes, resolveCollection, resolveIndex }

function resolveCollection (name) {
  switch (name) {
    case '@hyperdb-example/user': return collection0
    default: return null
  }
}

function resolveIndex (name) {
  switch (name) {
    default: return null
  }
}
