const crypto = require('crypto');

console.log('\nGenerating a secure JWT secret for NextAuth.js...');

// Generate a 32-byte random string
const secret = crypto.randomBytes(32).toString('base64');

console.log('\nYour secure secret is:');
console.log(secret);
console.log('\nCopy this secret and add it to your environment variables as NEXTAUTH_SECRET');
console.log('\nFor Vercel deployment:');
console.log('1. Go to your Vercel project settings');
console.log('2. Click on "Environment Variables"');
console.log('3. Add a new variable with name "NEXTAUTH_SECRET"');
console.log('4. Paste the generated secret as the value');

// Add the secret to .env file if it exists
const fs = require('fs');
if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const newContent = envContent + `
NEXTAUTH_SECRET=${secret}`;
    fs.writeFileSync('.env', newContent);
    console.log('\nSecret has been added to .env file');
} else {
    console.log('\nNo .env file found. Please add this secret to your environment variables manually.');
}

console.log('\nSecret generation complete!');
