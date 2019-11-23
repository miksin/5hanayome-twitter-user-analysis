const {
  twitterClient,
  db,
  tables
} = require('./common')
const { partisanIdentifiers } = require('./partisan')

const interval = 600 // 0.6 seconds

function identifier (sentence, mentioned) {
  sentence = sentence.toLowerCase()

  for (let i = 1; i <= 5; i++) {
    const key = `${i}`
    for (let j = 0; j < partisanIdentifiers[key].length; j++) {
      if (sentence.indexOf(partisanIdentifiers[key][j]) !== -1) {
        mentioned[key] = true
        break
      }
    }
  }
}

function contentScan (tweet, mentioned) {
  identifier(tweet.text, mentioned)
  tweet.entities.hashtags.forEach(t => {
    identifier(t.text, mentioned)
  })
}

async function getTimeline (id) {
  const partisanCounts = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0
  }

  try {
    const tweets = await twitterClient.get('statuses/user_timeline', {
      user_id: id,
      count: 200
    })

    const len = tweets.length
    for (let i = 0; i < len; i++) {
      const mentioned = {
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false
      }

      const tweet = tweets[i]
      contentScan(tweet, mentioned)
      if (Object.prototype.hasOwnProperty.call(tweet, 'retweeted_status')) {
        contentScan(tweet.retweeted_status, mentioned)
      }

      Object.keys(mentioned).forEach(key => {
        if (mentioned[key]) {
          partisanCounts[key] += 1
        }
      })
    }

    // console.log(len, 'tweets,', partisanCounts, 'id:', id)
    return partisanCounts
  } catch (error) {
    throw error
  }
}

async function loopGrab () {
  const startTime = new Date()

  let user = { id: -1 }
  let counts = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0
  }

  try {
    user = await db.get(`
    SELECT id FROM ${tables.follower}
    WHERE public = 1
    AND to_1 IS NULL
  `)

    counts = await getTimeline(user.id)
    await db.run(`
      UPDATE ${tables.follower}
      SET
        to_1 = ${counts['1']},
        to_2 = ${counts['2']},
        to_3 = ${counts['3']},
        to_4 = ${counts['4']},
        to_5 = ${counts['5']}
      WHERE id = ${user.id}
    `)
  } catch (error) {
    console.error(error.message, typeof error)
    if (error.message.indexOf('401') !== -1) {
      await db.run(`DELETE FROM ${tables.follower} WHERE id = ${user.id}`)
    }
  }

  const timeConsumed = new Date() - startTime
  console.log('id:', user.id, 'counts:', counts, 'timeConsumed:', timeConsumed)

  setTimeout(() => {
    loopGrab()
  }, Math.max(0, interval - timeConsumed))
}

async function exec () {
  await db.connect()
  loopGrab()
}

exec()
