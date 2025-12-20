import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registerUserPaths } from './paths/users.js';
import { registerLibraryPaths } from './paths/library.js';
import { registerGamesPaths } from './paths/games.js';
import { registerGenresPaths } from './paths/genres.js';
import { registerPlatformsPaths } from './paths/platforms.js';

const registry = new OpenAPIRegistry();

registerUserPaths(registry);
registerLibraryPaths(registry);
registerGamesPaths(registry);
registerGenresPaths(registry);
registerPlatformsPaths(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);
const doc = generator.generateDocument({
    openapi: '3.0.0',
    info: { 
        title: 'Platinum Hunters API', 
        version: '1.0.0',
        description: 'API for managing users, games and game library'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development Server'
        }
    ]
});

export default doc;