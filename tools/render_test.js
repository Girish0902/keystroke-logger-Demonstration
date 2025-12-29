async function run(){
  try{
    const url = 'https://keystroke-logger-demonstration.onrender.com';
    const post = await fetch(url + '/api/logs',{
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ time: new Date().toISOString(), event: 'pressed', key: 'RENDER_TEST' })
    });
    console.log('POST status', post.status);
    console.log('POST body', await post.text());
    const data = await fetch(url + '/data');
    console.log('/data status', data.status);
    console.log('/data body', await data.text());
  }catch(e){
    console.error('Error', e);
    process.exit(1);
  }
}
run();
