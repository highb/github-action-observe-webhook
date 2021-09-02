const core = require('@actions/core');
const wait = require('./wait');
const https = require('https')

// most @actions toolkit packages have async methods
async function run() {
  try {
    const customer_id = core.getInput('observe_customer_id');
    const ingest_token = core.getInput('observe_ingest_token');
    const json_data = core.getInput('data');
    const json_str = new TextEncoder().encode(
      JSON.stringify(json_data)
    )
    const options = {
      hostname: 'collect.observeinc.com',
      port: 443,
      path: '/v1/observations',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + customer_id + " " + ingest_token,
        'Content-type': 'application/json',
        'Content-length': json_str.length
      }
    }
    const req = https.request(options, res => {
      core.info(`statusCode: ${res.statusCode}`)

      res.on('data', d => {
        core.info(d)
      })
    })

    req.on('error', error => {
      core.error(error)
      core.setFailed(error.message);
    })

    req.write(json_str)
    req.end()

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
