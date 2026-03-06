import { NestFactory } from '@nestjs/core';
import { SeedService } from './database/seed.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error'],
  });
  const seed = app.get(SeedService);
  await seed.run();
  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
