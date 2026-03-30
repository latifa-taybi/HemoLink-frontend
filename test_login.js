fetch('http://localhost:8082/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@hemolink.local', motDePasse: 'Admin@123' })
}).then(async r => {
  const t = await r.text();
  console.log('STATUS:', r.status);
  console.log('BODY:', t);
}).catch(console.error);
