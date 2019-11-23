const Twitter = require('twitter')
const path = require('path')
const Sqlite = require('./sqlite')

const twitterClient = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const dbPath = path.join(__dirname, './db/20191116.db')
const resultPath = path.join(__dirname, '../public/data')

const db = new Sqlite(dbPath)

const tables = {
  cursor: 'cursor',
  follower: 'follower'
}

const migrations = [
  `CREATE TABLE IF NOT EXISTS ${tables.cursor} (
    next INTEGER,
    prev INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS ${tables.follower} (
    id INTEGER PRIMARY KEY,
    public INTEGER,
    partisan INTEGER,
    to_1 INTEGER,
    to_2 INTEGER,
    to_3 INTEGER,
    to_4 INTEGER,
    to_5 INTEGER,
    location TEXT
  )`
]

module.exports = {
  twitterClient,
  dbPath,
  resultPath,
  db,
  tables,
  migrations
}
