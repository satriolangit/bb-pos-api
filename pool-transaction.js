const mysql = require("mysql");

const pool = mysql.createPool("mysql://localhost");

inTransaction(
  pool,
  function (db, next) {
    db.query("DELETE * FROM stuff", function (err) {
      if (err) return next(err);

      db.query("INSERT INTO stuff VALUES (1,2,3)", function (err) {
        return next(err);
      });
    });
  },
  function (err) {
    console.log("All done, transaction ended and connection released");
  }
);

/**
 * Convenience wrapper for database connection in a transaction
 */
function inTransaction(pool, body, callback) {
  withConnection(
    pool,
    function (db, done) {
      db.beginTransaction(function (err) {
        if (err) return done(err);

        body(db, finished);
      });

      // Commit or rollback transaction, then proxy callback
      function finished(err) {
        let context = this;
        let args = arguments;

        if (err) {
          if (err == "rollback") {
            args[0] = err = null;
          }
          db.rollback(function () {
            done.apply(context, args);
          });
        } else {
          db.commit(function (err) {
            args[0] = err;
            done.apply(context, args);
          });
        }
      }
    },
    callback
  );
}

/**
 * Convenience wrapper for database connection from pool
 */
function withConnection(pool, body, callback) {
  pool.getConnection(function (err, db) {
    if (err) return callback(err);

    body(db, finished);

    function finished() {
      db.release();
      callback.apply(this, arguments);
    }
  });
}
