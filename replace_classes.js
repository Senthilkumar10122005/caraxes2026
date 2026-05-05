const fs = require('fs');
const files = [
  'frontend/src/pages/Login.jsx',
  'frontend/src/pages/Register.jsx',
  'frontend/src/pages/Booking.jsx',
  'frontend/src/pages/Ticket.jsx',
  'frontend/src/components/FAQ.jsx',
  'frontend/src/components/CountdownTimer.jsx'
];
files.forEach(f => {
  try {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/className="glass-card/g, 'className="aurora-glass-card');
    fs.writeFileSync(f, content);
  } catch (e) {
    console.error('Error with ' + f, e);
  }
});
console.log('Finished replacing glass-card classes.');
