const client = require('../lib/client');
// import our seed data:
const soups = require('./soups.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    // const user = users[0].rows[0];

    await Promise.all(
      soups.map(soup => {
        return client.query(`
                    INSERT INTO soups (name, category, seasonal, tastiness)
                    VALUES ($1, $2, $3, $4);
                `,
        [soup.name, soup.category, soup.seasonal, soup.tastiness]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
