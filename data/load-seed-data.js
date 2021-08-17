const client = require('../lib/client');
// import our seed data:
// const usersData = require('./users.js');
const soups = require('./soups.js');
const categoryData = require('./categories.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      categoryData.map(category => {
        return client.query(`
          INSERT INTO categories (name)
          VALUES ($1)
          RETURNING *;
        `,
        [category.name]);
        // usersData.map(user => {
        //   return client.query(`
        //                 INSERT INTO users (email, hash)
        //                 VALUES ($1, $2)
        //                 RETURNING *;
        //             `,
        //   [user.email, user.hash]
      })
    );
      
    // const user = users[0].rows[0];

    await Promise.all(
      soups.map(soup => {
        return client.query(`
                    INSERT INTO soups (name, category_id, seasonal, tastiness)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *;
                `,
        [soup.name, soup.category_id, soup.seasonal, soup.tastiness]
        );
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