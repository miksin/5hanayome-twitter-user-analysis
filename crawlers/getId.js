const {
  twitterClient,
  tables,
  migrations,
  db
} = require('./common')

const interval = 60 * 1000 // 1 minutes
const account = '5Hanayome' // target twitter account

async function loop () {
  const cursor = await db.get(`SELECT * FROM ${tables.cursor}`)
  if (cursor.next === 0) return

  const res = await twitterClient.get('followers/ids', {
    screen_name: account,
    count: 5000,
    cursor: cursor.next
  })

  const valueSql = res.ids.map(id => `(${id})`).join(',')
  let sql = `INSERT OR IGNORE INTO ${tables.follower} (id) VALUES ${valueSql}`
  await db.run(sql)

  await db.run(`UPDATE ${tables.cursor}
    SET prev = $prev, next = $next
  `, {
    $prev: res.previous_cursor,
    $next: res.next_cursor
  })

  console.log('insert ids:', res.ids.length, 'cursor:', cursor.next)

  setTimeout(() => {
    loop()
  }, interval)
}

async function getId () {
  // connect to db and migrate first
  await db.connect()
  await db.runAll(migrations)

  const cursor = await db.get(`SELECT * FROM ${tables.cursor}`)
  if (!cursor) {
    await db.run(`INSERT INTO ${tables.cursor} (prev, next) VALUES ($prev, $next)`, {
      $prev: 0,
      $next: -1
    })
  }

  loop()
}

getId()
