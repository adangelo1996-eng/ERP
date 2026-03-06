"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({ origin: ['http://localhost:3001', 'http://127.0.0.1:3001'] });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }));
        await app.listen(process.env.PORT ?? 3000);
        fetch('http://127.0.0.1:7391/ingest/bf8fa4ff-2012-4fab-b5ac-55db3c69fdbd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Debug-Session-Id': '6f9075',
            },
            body: JSON.stringify({
                sessionId: '6f9075',
                runId: 'backend-start',
                hypothesisId: 'H1',
                location: 'src/main.ts:20',
                message: 'Backend started successfully',
                data: {
                    port: process.env.PORT ?? 3000,
                },
                timestamp: Date.now(),
            }),
        }).catch(() => { });
    }
    catch (error) {
        fetch('http://127.0.0.1:7391/ingest/bf8fa4ff-2012-4fab-b5ac-55db3c69fdbd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Debug-Session-Id': '6f9075',
            },
            body: JSON.stringify({
                sessionId: '6f9075',
                runId: 'backend-start-failure',
                hypothesisId: 'H1',
                location: 'src/main.ts:5',
                message: 'Backend bootstrap failed',
                data: {
                    errorMessage: error?.message,
                },
                timestamp: Date.now(),
            }),
        }).catch(() => { });
        throw error;
    }
}
bootstrap();
//# sourceMappingURL=main.js.map