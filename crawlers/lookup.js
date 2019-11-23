const {
  twitterClient,
  db,
  tables
} = require('./common')
const { partisanIdentify } = require('./partisan')

const limit = 100 // maximum ids per request
const interval = 3 * 1000 // 3 seconds

async function lookup () {
  const ids = await db.all(
    `SELECT id FROM ${tables.follower} WHERE public IS NULL LIMIT ${limit}`
  )

  if (ids.length < 1) return

  const startTime = new Date()

  let users = []

  try {
    users = await twitterClient.post('users/lookup', {
      user_id: ids.map(d => d.id).join(',')
    })
  } catch (error) {
  }

  const counts = {}

  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    const publicFlag = user.protected ? 0 : 1
    const location = user.location || null
    const partisan = partisanIdentify(user)

    if (!Object.prototype.hasOwnProperty.call(counts, `${partisan}`)) {
      counts[`${partisan}`] = 0
    }
    counts[`${partisan}`] += 1

    await db.run(`
      UPDATE ${tables.follower}
      SET public = $public,
          location = $location,
          partisan = $partisan
      WHERE id = ${user.id}
    `, {
      $public: publicFlag,
      $location: location,
      $partisan: partisan
    })
  }

  const deleteIds = ids.map(d => d.id).filter(id => !users.some(u => u.id === id))
  for (let i = 0; i < deleteIds.length; i++) {
    await db.run(`DELETE FROM ${tables.follower} WHERE id = ${deleteIds[i]}`)
  }

  const timeConsumed = new Date() - startTime
  console.log(users.length, 'records (delete:', deleteIds.length, ')', counts, 'time consumed:', timeConsumed)

  setTimeout(() => {
    lookup()
  }, Math.max(0, interval - timeConsumed))
}

async function exec () {
  await db.connect()
  lookup()
}

exec()
