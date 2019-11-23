const sqlite3 = require('sqlite3').verbose()

class DB {
  constructor (path) {
    this.db = null
    this.path = path
  }

  connect () {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.path, err => {
        if (err) {
          reject(err)
        } else {
          resolve(err)
        }
      })
    })
  }

  async runAll (sqls) {
    try {
      for (let i = 0; i < sqls.length; i++) {
        await this.run(sqls[i])
      }
    } catch (error) {
      throw error
    }
  }

  run (sql, params) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, err => {
        if (err) {
          reject(err)
        } else {
          resolve(err)
        }
      })
    })
  }

  exec (sql, params) {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, params, err => {
        if (err) {
          reject(err)
        } else {
          resolve(err)
        }
      })
    })
  }

  get (sql, params) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  all (sql, params) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  close () {
    this.db.close()
  }
}

module.exports = DB
