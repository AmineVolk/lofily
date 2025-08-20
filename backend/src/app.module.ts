import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BackgroundModule } from './modules/background/background.module';
import { CategoryModule } from './modules/category/category.module';
import { EmailModule } from './modules/email/email.module';
import { EventTrackModule } from './modules/event-track/event-track.module';
import { Module } from '@nestjs/common';
import { MusicEffectsModule } from './modules/music-effects/music-effects.module';
import { MusicModule } from './modules/music/music.module';
import { NoteGroupModule } from './modules/note-group/note-group.module';
import { NoteModule } from './modules/note/note.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PomodoroModule } from './modules/pomodoro/pomodoro.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TasksModule } from './modules/tasks/tasks.module';
import { UserModule } from './modules/user/user.module';
import { UserMusicEffectsModule } from './modules/user-music-effects/user-music-effects.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const dbConfig = {
  type: 'postgres' as const,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: false,
  autoLoadEntities: true,
};

console.log('Database config:', {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot(dbConfig),
    UserModule,
    EmailModule,
    AuthModule,
    PomodoroModule,
    BackgroundModule,
    CategoryModule,
    NoteGroupModule,
    NoteModule,
    TasksModule,
    MusicEffectsModule,
    UserMusicEffectsModule,
    PaymentsModule,
    MusicModule,
    EventTrackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
