const core = require('@actions/core');
const wait = require('./wait');
const https = require('https')

// most @actions toolkit packages have async methods
async function run() {
  try {
    const user_id = core.getInput('observe_user_id');
    const ingest_token = core.getInput('observe_ingest_token');
    const data = new TextEncoder().encode(
      JSON.stringify(core.getInput('data'))
    )
    const options = {
      hostname: 'collect.observeinc.com',
      port: 443,
      path: '/v1/observations',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + user_id + " " + ingest_token,
        'Content-type': 'application/json',
        'Content-length': data.length
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

    req.write(data)
    req.end()

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
