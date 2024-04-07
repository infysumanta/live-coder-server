import dotenv from 'dotenv';
dotenv.config();
import server from './app';

/**
 * The port number for the server.
 * If the `PORT` environment variable is set, it will use that value.
 * Otherwise, it will default to 8080.
 */
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
