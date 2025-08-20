import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { PomodoroModule } from 'src/modules/pomodoro/pomodoro.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';

import { PomodoroType } from 'src/modules/pomodoro/enum/pomodoro-type';
import { TestHelper } from 'test/helper';

describe('Pomodoro (e2e)', () => {
  let testHelper: TestHelper;
  let app: INestApplication;
  let requestServer;

  beforeAll(async () => {
    testHelper = new TestHelper([UserModule, AuthModule, PomodoroModule]);
    await testHelper.initApp();
    app = testHelper.app;
    requestServer = request(app.getHttpServer());
  });

  afterAll(async () => {
    await testHelper.cleanDb();
    return app.close();
  });

  describe('Post /pomodoro/start', () => {
    it('Should fail when the user dont have a token', () => {
      return requestServer.post('/pomodoro/start').send({}).expect(401);
    });

    it('Should start pomodoro', async () => {
      const { accessToken, userid } =
        await testHelper.createUserWithAccessToken();

      const createdPomodoro = await requestServer
        .post('/pomodoro/start')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      const pomodoroInDb = await testHelper.getPomodoroById(
        +createdPomodoro.id,
      );
      const userAfterStart = await testHelper.getUserById(+userid);

      expect(userAfterStart.current_pomodoro_id).toEqual(createdPomodoro.id);
      expect(pomodoroInDb.type).toEqual(PomodoroType.pomodoro);
    });

    it('Should start pomodoro of short_break', async () => {
      const { accessToken, userid } =
        await testHelper.createUserWithAccessToken();

      await requestServer
        .post('/pomodoro/start')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      await requestServer
        .post('/pomodoro/finished')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201);

      const createdPomodoro = await requestServer
        .post('/pomodoro/start')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      const pomodoroInDb = await testHelper.getPomodoroById(
        +createdPomodoro.id,
      );
      const userAfterStart = await testHelper.getUserById(+userid);

      expect(userAfterStart.current_pomodoro_id).toEqual(createdPomodoro.id);
      expect(pomodoroInDb.type).toEqual(PomodoroType.short_break);
    });

    it('Should start pomodoro of long_break', async () => {
      const { accessToken, userid } =
        await testHelper.createUserWithAccessToken();

      const defaultLongBreakInterval = 4;
      for (let index = 0; index < defaultLongBreakInterval * 2 - 1; index++) {
        await requestServer
          .post('/pomodoro/start')
          .set('Cookie', `access_token=${accessToken}`)
          .expect(201);

        await requestServer
          .post('/pomodoro/finished')
          .set('Cookie', `access_token=${accessToken}`)
          .expect(201);
      }

      const createdPomodoro = await requestServer
        .post('/pomodoro/start')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      const pomodoroInDb = await testHelper.getPomodoroById(
        +createdPomodoro.id,
      );
      const userAfterStart = await testHelper.getUserById(+userid);

      expect(userAfterStart.current_pomodoro_id).toEqual(createdPomodoro.id);
      expect(pomodoroInDb.type).toEqual(PomodoroType.long_break);
    });
  });

  describe('Post /pomodoro/finished', () => {
    it('Should fail when the user dont have a token', () => {
      return requestServer.post('/pomodoro/finished').expect(401);
    });

    it('Should set endat and increase user nbr_ended_pomodoro when its not long_break time', async () => {
      const { accessToken, userid } =
        await testHelper.createUserWithAccessToken();

      const createdPomodoro = await requestServer
        .post('/pomodoro/start')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      await requestServer
        .post('/pomodoro/finished')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201);

      const pomodoroAfterFinished = await testHelper.getPomodoroById(
        createdPomodoro.id,
      );

      const userAfterFinshed = await testHelper.getUserById(+userid);

      expect(userAfterFinshed.nbr_ended_pomodoro).toEqual(1);
      expect(pomodoroAfterFinished.endat).toBeTruthy();
    });

    it('Should not increase user nbr_ended_pomodoro when its a short_break', async () => {
      const { accessToken, userid } =
        await testHelper.createUserWithAccessToken();

      await requestServer
        .post('/pomodoro/start')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      await requestServer
        .post('/pomodoro/finished')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201);

      await requestServer
        .post('/pomodoro/start')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201)
        .then((res) => JSON.parse(res.text));

      await requestServer
        .post('/pomodoro/finished')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(201);

      const userAfterFinshed2 = await testHelper.getUserById(+userid);

      expect(userAfterFinshed2.nbr_ended_pomodoro).toEqual(1);
    });

    it("Should reset current_pomodoro_id and nbr_ended_pomodoro when it's a time for a long break", async () => {
      const { accessToken, userid } =
        await testHelper.createUserWithAccessToken();

      const defaultLongBreakInterval = 4;
      for (let index = 0; index < defaultLongBreakInterval * 2; index++) {
        await requestServer
          .post('/pomodoro/start')
          .set('Cookie', `access_token=${accessToken}`)
          .expect(201)
          .then((res) => JSON.parse(res.text));

        await requestServer
          .post('/pomodoro/finished')
          .set('Cookie', `access_token=${accessToken}`)
          .expect(201);
      }

      const userAfterFinshed2 = await testHelper.getUserById(+userid);
      expect(userAfterFinshed2.current_pomodoro_id).toEqual(null);
      expect(userAfterFinshed2.nbr_ended_pomodoro).toEqual(0);
    });
  });

  describe('GET /pomodoro/type', () => {
    it('Should fail when the user dont have a token', () => {
      return requestServer.get('/pomodoro/type').expect(401);
    });
    it('Should return "pomodoro" type when the user dont have any current session', async () => {
      const { accessToken } = await testHelper.createUserWithAccessToken();

      const pomodoroType = await requestServer
        .get('/pomodoro/type')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(200);

      expect(pomodoroType.text).toEqual(PomodoroType.pomodoro);
    });

    it('Should return "pomodoro" type when the last user session was "short_break"', async () => {
      const { accessToken, userid } =
        await testHelper.createUserWithAccessToken();

      await testHelper.createPomodoro(userid, PomodoroType.pomodoro);
      await testHelper.createPomodoro(userid, PomodoroType.short_break);
      const pomodoroType = await requestServer
        .get('/pomodoro/type')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(200);

      expect(pomodoroType.text).toEqual(PomodoroType.pomodoro);
    });

    it('Should return "pomodoro" type when the last user session was "long_break"', async () => {
      const { accessToken, userid } =
        await testHelper.createUserWithAccessToken();

      await testHelper.createPomodoro(userid, PomodoroType.pomodoro);
      await testHelper.createPomodoro(userid, PomodoroType.long_break);
      const pomodoroType = await requestServer
        .get('/pomodoro/type')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(200);
      expect(pomodoroType.text).toEqual(PomodoroType.pomodoro);
    });

    it('Should return "short_break" type when the last user session was "pomodoro"', async () => {
      const { accessToken, userid } =
        await testHelper.createUserWithAccessToken();
      await testHelper.createPomodoro(userid, PomodoroType.pomodoro);

      const pomodoroType = await requestServer
        .get('/pomodoro/type')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(200);
      expect(pomodoroType.text).toEqual(PomodoroType.short_break);
    });

    it('Should return "long_break" type when the user done X "pomodoro" session', async () => {
      const { accessToken, userid } =
        await testHelper.createUserWithAccessToken();

      const defaultLongBreakInterval = 4;
      for (let index = 0; index < defaultLongBreakInterval * 2 - 1; index++) {
        await requestServer
          .post('/pomodoro/start')
          .set('Cookie', `access_token=${accessToken}`)
          .expect(201);

        await requestServer
          .post('/pomodoro/finished')
          .set('Cookie', `access_token=${accessToken}`)
          .expect(201);
      }

      const pomodoroType = await requestServer
        .get('/pomodoro/type')
        .set('Cookie', `access_token=${accessToken}`)
        .expect(200);
      expect(pomodoroType.text).toEqual(PomodoroType.long_break);
    });
  });
});
