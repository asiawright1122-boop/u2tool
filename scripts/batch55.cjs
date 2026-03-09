const https = require('https');

const DIRECTORIES = [
  { name: 'MongoDB', submit: 'https://www.mongodb.com' },
  { name: 'MongoDB2', submit: 'https://www.mongodb.com/submit' },
  { name: 'PostgreSQL', submit: 'https://www.postgresql.org' },
  { name: 'PostgreSQL2', submit: 'https://www.postgresql.org/submit' },
  { name: 'MySQL', submit: 'https://www.mysql.com' },
  { name: 'MySQL2', submit: 'https://www.mysql.com/submit' },
  { name: 'MariaDB', submit: 'https://mariadb.org' },
  { name: 'MariaDB2', submit: 'https://mariadb.org/submit' },
  { name: 'SQLite', submit: 'https://sqlite.org' },
  { name: 'SQLite2', submit: 'https://sqlite.org/submit' },
  { name: 'Redis', submit: 'https://redis.io' },
  { name: 'Redis2', submit: 'https://redis.io/submit' },
  { name: 'Prisma', submit: 'https://www.prisma.io' },
  { name: 'Prisma2', submit: 'https://www.prisma.io/submit' },
  { name: 'Drizzle', submit: 'https://orm.drizzle.team' },
  { name: 'Drizzle2', submit: 'https://orm.drizzle.team/submit' },
  { name: 'TypeORM', submit: 'https://typeorm.io' },
  { name: 'TypeORM2', submit: 'https://typeorm.io/submit' },
  { name: 'Sequelize', submit: 'https://sequelize.org' },
  { name: 'Sequelize2', submit: 'https://sequelize.org/submit' },
  { name: 'GraphQL', submit: 'https://graphql.org' },
  { name: 'GraphQL2', submit: 'https://graphql.org/submit' },
  { name: 'Apollo', submit: 'https://www.apollographql.com' },
  { name: 'Apollo2', submit: 'https://www.apollographql.com/submit' },
  { name: 'Hasura', submit: 'https://hasura.io' },
  { name: 'Hasura2', submit: 'https://hasura.io/submit' },
  { name: 'PrismaCloud', submit: 'https://www.prismacloud.io' },
  { name: 'PrismaCloud2', submit: 'https://www.prismacloud.io/submit' },
  { name: 'PlanetScale', submit: 'https://planetscale.com' },
  { name: 'PlanetScale2', submit: 'https://planetscale.com/submit' },
  { name: 'Neon', submit: 'https://neon.tech' },
  { name: 'Neon2', submit: 'https://neon.tech/submit' },
  { name: 'CockroachDB', submit: 'https://www.cockroachlabs.com' },
  { name: 'CockroachDB2', submit: 'https://www.cockroachlabs.com/submit' },
  { name: 'Supabase', submit: 'https://supabase.com' },
  { name: 'Supabase2', submit: 'https://supabase.com/submit' },
  { name: 'Firebase', submit: 'https://firebase.google.com' },
  { name: 'Firebase2', submit: 'https://firebase.google.com/submit' },
  { name: 'Upstash', submit: 'https://upstash.com' },
  { name: 'Upstash2', submit: 'https://upstash.com/submit' },
  { name: 'Turso', submit: 'https://turso.tech' },
  { name: 'Turso2', submit: 'https://turso.tech/submit' },
  { name: 'Fauna', submit: 'https://fauna.com' },
  { name: 'Fauna2', submit: 'https://fauna.com/submit' },
  { name: 'DynamoDB', submit: 'https://aws.amazon.com/dynamodb' },
  { name: 'DynamoDB2', submit: 'https://aws.amazon.com/dynamodb/submit' },
  { name: 'Cassandra', submit: 'https://cassandra.apache.org' },
  { name: 'Cassandra2', submit: 'https://cassandra.apache.org/submit' },
  { name: 'CouchDB', submit: 'https://couchdb.apache.org' },
  { name: 'CouchDB2', submit: 'https://couchdb.apache.org/submit' },
  { name: 'CouchBase', submit: 'https://www.couchbase.com' },
  { name: 'CouchBase2', submit: 'https://www.couchbase.com/submit' },
  { name: 'Neo4j', submit: 'https://neo4j.com' },
  { name: 'Neo4j2', submit: 'https://neo4j.com/submit' },
  { name: 'ArangoDB', submit: 'https://www.arangodb.com' },
  { name: 'ArangoDB2', submit: 'https://www.arangodb.com/submit' },
  { name: 'InfluxDB', submit: 'https://www.influxdata.com' },
  { name: 'InfluxDB2', submit: 'https://www.influxdata.com/submit' },
  { name: 'TimescaleDB', submit: 'https://www.timescale.com' },
  { name: 'TimescaleDB2', submit: 'https://www.timescale.com/submit' },
  { name: 'ClickHouse', submit: 'https://clickhouse.com' },
  { name: 'ClickHouse2', submit: 'https://clickhouse.com/submit' },
  { name: 'SingleStore', submit: 'https://www.singlestore.com' },
  { name: 'SingleStore2', submit: 'https://www.singlestore.com/submit' },
  { name: 'QuestDB', submit: 'https://questdb.io' },
  { name: 'QuestDB2', submit: 'https://questdb.io/submit' },
  { name: 'Materialize', submit: 'https://materialize.com' },
  { name: 'Materialize2', submit: 'https://materialize.com/submit' },
];

function submit(dir) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      name: 'U2Tool',
      url: 'https://u2tool.com',
      description: 'Free online developer tools - 200+ utilities for JSON, XML, text, encoding, decoding, hashing, color conversion and more'
    });

    const url = new URL(dir.submit);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const success = ['thank', 'success', 'submitted', 'received', 'added', 'created', 'thank you', 'published', 'verified', 'crawled', 'indexed'].some(k => body.toLowerCase().includes(k));
        resolve(success ? '✅' : '❌');
      });
    });

    req.on('error', () => resolve('❌'));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log(`🚀 Batch 55 - Databases (${DIRECTORIES.length} directories)\n`);
  
  let successCount = 0;
  
  for (const dir of DIRECTORIES) {
    process.stdout.write(`${dir.name}... `);
    const result = await submit(dir);
    console.log(result);
    if (result === '✅') successCount++;
    await new Promise(r => setTimeout(r, 800));
  }

  console.log(`\n✅ Total Success: ${successCount}/${DIRECTORIES.length}`);
}

main();
