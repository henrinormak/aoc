
async function test(interval: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval);
  });
}

test(5_000).then(() => {
  console.log('Completed 1/2')
  return test(5_000);
}).then(() => {
  console.log('Completed 2/2');
}).catch(console.error);
