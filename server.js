require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Practical 12 server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
