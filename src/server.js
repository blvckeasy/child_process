import Express from "express";
import { fork } from 'child_process';
import { join } from "path"

const app = Express();
const PORT = 5000;

app.get("/one", function (request, response, next) {
  const sum = longComputation();
  return response.send({ sum });
})

app.get("/two", async function (request, response, next) {
  const sum = await longComputePromise();
  return response.send({ sum });
})

app.get("/three", async function (request, response, next) {
  const child = fork(join(process.cwd(), 'src', 'longtask.js'));
  child.send('start');
  child.on('message', function (sum) {
    response.send({ sum });
  })
})

app.listen(PORT, function () {
  console.log(`🚀  Server is listening on http://localhost:${PORT}/`);
})

function longComputation() {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  }
  return sum;
}

function longComputePromise() {
  return new Promise(function (resolve, reject) {
    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
      sum += i;
    }
    return resolve(sum);
  })
}
