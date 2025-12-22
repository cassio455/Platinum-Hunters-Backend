import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registerUserPaths } from './paths/users.js';
import { registerLibraryPaths } from './paths/library.js';
import { registerGamesPaths } from './paths/games.js';
import { registerGenresPaths } from './paths/genres.js';
import { registerPlatformsPaths } from './paths/platforms.js';
import { registerRankingPaths } from './paths/ranking.js';

const registry = new OpenAPIRegistry();

// Registrar o esquema de segurança JWT
registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Enter your JWT token'
});

registerUserPaths(registry);
registerLibraryPaths(registry);
registerGamesPaths(registry);
registerGenresPaths(registry);
registerPlatformsPaths(registry);
registerRankingPaths(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);
const doc = generator.generateDocument({
    openapi: '3.0.0',
    info: { 
        title: 'Platinum Hunters API', 
        version: '1.0.0',
        description: 'API for managing users, games, library, ranking and shop'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development Server'
        }
    ]
});

export default doc;