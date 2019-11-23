require('lodash.combinations')
const _ = require('lodash')
const fs = require('fs')
const {
  db,
  resultPath,
  tables
} = require('./common')

function keyName (number) {
  if (number === 0) return 'none'
  if (number === 6) return 'multiple'
  return `${number}`
}

async function partisanDistribution () {
  const counts = await db.all(`
    SELECT COUNT(id) AS count, partisan FROM ${tables.follower}
    GROUP BY partisan
  `)

  return counts.map(d => ({
    count: d.count,
    partisan: keyName(d.partisan)
  }))
}

async function behaviorByPartisan () {
  const datasets = []

  for (let i = 1; i <= 5; i++) {
    const records = await db.all(`
      SELECT SUM(to_${i}) AS value, partisan FROM ${tables.follower}
      WHERE to_${i} IS NOT NULL GROUP BY partisan
    `)

    records.forEach(record => {
      datasets.push({
        partisan: keyName(record.partisan),
        target: keyName(i),
        sum: record.value
      })
    })
  }

  return datasets
}

async function adjacentBehaviors () {
  const datasets = []

  for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 5; j++) {
      const record = await db.get(`
        SELECT SUM(to_${j}) AS value FROM ${tables.follower}
        WHERE to_${i} IS NOT NULL
        AND to_${i} > 0
      `)
      datasets.push({
        from: keyName(i),
        to: keyName(j),
        value: record.value
      })
    }
  }

  return datasets
}

async function frequentItemsets () {
  const itemsets = []

  // number of items from 0 to 5
  const items = [1, 2, 3, 4, 5]
  for (let n = 0; n <= 5; n++) {
    const combinations = _.combinations(items, n)
    for (const combi of combinations) {
      let condition = ''
      combi.forEach(item => {
        condition = condition.concat(` AND to_${item} > 0`)
      })
      const rest = _.without(items, ...combi)
      rest.forEach(item => {
        condition = condition.concat(` AND to_${item} = 0`)
      })

      const record = await db.get(`
        SELECT COUNT(id) AS count FROM ${tables.follower}
        WHERE to_1 IS NOT NULL
        ${condition}
      `)

      itemsets.push({
        items: combi,
        count: record.count
      })
    }
  }

  return itemsets
}

async function locations () {
  const locations = await db.all(`
    SELECT COUNT(id) AS count, LOWER(location) AS loc FROM ${tables.follower}
    WHERE location IS NOT NULL
    GROUP BY loc
    ORDER BY count DESC
    LIMIT 50
  `)
  return locations
}

async function mentionedUsers () {
  const userCounts = []
  for (let i = 1; i <= 5; i++) {
    const { count } = await db.get(`
      SELECT COUNT(id) AS count FROM ${tables.follower}
      WHERE to_${i} > 0
    `)
    userCounts.push({
      target: keyName(i),
      count
    })
  }
  return userCounts
}

const dataMap = [
  {
    name: 'partisanDistribution',
    executor: partisanDistribution
  },
  {
    name: 'behaviorByPartisan',
    executor: behaviorByPartisan
  },
  {
    name: 'adjacentBehaviors',
    executor: adjacentBehaviors
  },
  {
    name: 'frequentItemsets',
    executor: frequentItemsets
  },
  {
    name: 'locations',
    executor: locations
  },
  {
    name: 'mentionedUsers',
    executor: mentionedUsers
  }
]

async function exec () {
  await db.connect()

  for (let i = 0; i < dataMap.length; i++) {
    const { name, executor } = dataMap[i]
    const result = await executor()
    fs.writeFileSync(`${resultPath}/${name}.json`, JSON.stringify(result))
  }

  console.log(`${dataMap.length} files updated`)
}

exec()
