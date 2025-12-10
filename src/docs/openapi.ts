import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registerUserPaths } from './paths/users.js';
import { registerLibraryPaths } from './paths/library.js';
import { registerGamesPaths } from './paths/games.js';

const registry = new OpenAPIRegistry();

registerUserPaths(registry);
registerLibraryPaths(registry);
registerGamesPaths(registry);

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
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token in the format: Bearer <token>'
            }
        }
    },
    security: [
        {
            BearerAuth: []
        }
    ],
    tags: [
        {
            name: 'Users',
            description: 'User related operations'
        },
        {
            name: 'Library',
            description: 'User game library related operations'
        },
        {
            name: 'Games',
            description: 'Game catalog and search operations'
        },
        {
            name: 'Custom Games',
            description: 'User custom/local games operations'
        }
    ]
});

export default doc;