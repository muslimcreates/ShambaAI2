// netlify/functions/analyse.js
const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { messages } = JSON.parse(event.body);

  const postData = JSON.stringify({
    model: "gpt-4o",
    messages: messages,
    response_format: { type: "json_object" }
  });

  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          body: data
        });
      });
    });

    req.on('error', (e) => {
        // ... inside the req.on('end', () => { ... block
res.on('end', () => {
    console.log("OpenAI Status:", res.statusCode);
    console.log("OpenAI Response Body:", rawData); // <--- ADD THIS LINE
    resolve({
        statusCode: res.statusCode,
        headers: { "Content-Type": "application/json" },
        body: rawData
    });
});
    });

    req.write(postData);
    req.end();
  });
};