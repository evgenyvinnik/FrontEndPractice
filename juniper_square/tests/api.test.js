const request = require('supertest')
const app = require('../app');

describe('API', () => {
  beforeEach(() => {
    app.set('db', {
      users: [
        {
          id: 1,
          name: "Morgan First",
          email: "morgan.first@example.com"
        },
        {
          id: 2,
          name: "Elliot Alderson",
          email: "elliot.alderson@robot.com"
        },
      ],
      notes: [
        {
          id: 1,
          user_id: 2,
          content: "Notable commentary on this user",
          created_at: new Date(2020, 1, 11, 5, 41),
        },
        {
          id: 2,
          user_id: 2,
          content: "This is less notable than the other commentary.",
          created_at: new Date(2020, 1, 11, 5, 43),
        },
      ],
    });
  });

  describe('GET /users', () => {
    it('should return the full list of users in the database', async () => {
      const res = await request(app).
        get('/users').
        send();

      expect(res.statusCode).toBe(200);
      expect(res.body.users.length).toBeGreaterThan(0);
      for (let user of res.body.users) {
        expect(user.name.length).toBeGreaterThan(0);
        expect(user.email.length).toBeGreaterThan(0);
      }
    });
  });

  describe('POST /users', () => {
    it('should accept well formatted input', async () => {
      const res = await request(app).
        post('/users').
        send({
          name: 'James Bond',
          email: 'james@bond.com'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('James Bond');
      expect(res.body.email).toBe('james@bond.com');
      expect(res.body).toHaveProperty('id');
    });

    it('should reject a request without a \'name\' field', async () => {
      const res = await request(app).
        post('/users').
        send({
          email: 'hewhomustnotbenamed@wizard.com'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.code).toBe(401);
      expect(res.body.message.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:userId', () => {
    it('should return the user with the given id', async () => {
      const res = await request(app).
        get('/users/1').
        send();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 400 if the userId is not a number', async () => {
      const res = await request(app).
        get('/users/notanumber').
        send();

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 404 if the userId doesn\'t match any known user', async () => {
      const res = await request(app).
        get('/users/293874').
        send();

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('PUT /users/:userId', () => {
    it('should update the user with the provided details', async () => {
      const res = await request(app).
        put('/users/2').
        send({
          name: "Sam Esmail",
          email: "sam.esmail@f.society.com"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 400 if the userId is not a number', async () => {
      const res = await request(app).
        put('/users/notanumber').
        send({
          name: "irrelevant",
          email: "not@number.com"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 404 if the userId doesn\'t match any known user', async () => {
      const res = await request(app).
        put('/users/29837').
        send({
          name: "valid",
          email: "data@sent.com"
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 422 if the body is missing required fields', async () => {
      const incompleteData = [
        {
          name: "Only Name",
        },
        {
          email: "email@lone.ly",
        }
      ];

      for (let putData of incompleteData) {
        const res = await request(app).
          put('/users/1').
          send(putData);

        expect(res.statusCode).toBe(422);
        expect(res.body).toMatchSnapshot();
      }
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete a user if the provided userId is associated to one', async () => {
      const { users } = app.get('db');
      const userToDelete = users[0];

      const res = await request(app).
        delete(`/users/${userToDelete.id}`).
        send();

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
      expect(users.find(user => user.id === userToDelete.id)).not.toBeDefined();
    });

    it('should respond with an HTTP 400 if the userId is not a number', async () => {
      const res = await request(app).
        delete('/users/notanumber').
        send();

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 404 if the specified user does not exist', async () => {
      const res = await request(app).
        delete('/users/1987345').
        send();

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('GET /users/:userId/notes', () => {
    it('should return a list of notes associated with a given user', async () => {
      const userIdWithNotes = app.get('db').notes[0].user_id;
      const res = await request(app).
        get(`/users/${userIdWithNotes}/notes`).
        send();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    it('should return an empty list if the user has no notes', async () => {
      const { users, notes } = app.get('db');
      const userWithoutNotes = users.find(user => {
        return !notes.find(note => note.user_id === user.id);
      });

      const res = await request(app).
        get(`/users/${userWithoutNotes.id}/notes`).
        send();

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 400 if the userId is not a number', async () => {
      const res = await request(app).
        get('/users/notanumber/notes').
        send();

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 404 if the specified user does not exist', async () => {
      const res = await request(app).
        get('/users/1987345/notes').
        send();

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('POST /users/:userId/notes', () => {
    it('should accept well formatted input', async () => {
      const res = await request(app).
        post('/users/1/notes').
        send({
          content: 'This is a new note',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.user_id).toBe(1);
      expect(res.body.content).toBe('This is a new note');
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('created_at');
    });

    it('should reject a request without a \'content\' field', async () => {
      const res = await request(app).
        post('/users/1/notes').
        send();

      expect(res.statusCode).toBe(401);
      expect(res.body.code).toMatchSnapshot();
    });

    it('should respond with an HTTP 404 if the userId doesn\'t match any known user', async () => {
      const res = await request(app).
        post('/users/12345/notes').
        send({
          content: 'Heidi has a new investment advisor -- Bluefield Advisors. I updated the communications preferences accordingly.',
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.code).toMatchSnapshot();
    });
  });

  describe('PUT /users/:userId/notes/:noteId', () => {
    it('should update the note with the provided details', async () => {
      const res = await request(app).
        put('/users/2/notes/1').
        send({
          content: "Greg has a new investment advisor -- Sherman Advisors. I updated the communications preferences accordingly.",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 400 if the userId is not a number', async () => {
      const res = await request(app).
        put('/users/2/notes/notanumber').
        send({
          content: "irrelevant",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 404 if the noteId doesn\'t match any known note for the user', async () => {
      const res = await request(app).
        put('/users/1/notes/12345').
        send({
          content: "valid",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 404 if the noteId is held by a different user', async () => {
      const res = await request(app).
        put('/users/1/notes/1').
        send({
          content: "valid",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 422 if the body is missing required fields', async () => {
      const res = await request(app).
        put('/users/2/notes/1').
        send();

      expect(res.statusCode).toBe(422);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('DELETE /users/:userId/notes/:noteId', () => {
    it('should delete a note if the provided noteId is associated to the userId', async () => {
      const { notes } = app.get('db');
      const noteToDelete = notes[0];

      const res = await request(app).
        delete(`/users/${noteToDelete.user_id}/notes/${noteToDelete.id}`).
        send();

      expect(res.statusCode).toBe(204);
      expect(res.body).toMatchSnapshot();
      expect(notes.find(note => note.id === noteToDelete.id)).not.toBeDefined();
    });

    it('should respond with an HTTP 400 if the userId is not a number', async () => {
      const res = await request(app).
        delete('/users/notanumber/notes/1').
        send();

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 400 if the noteId is not a number', async () => {
      const res = await request(app).
        delete('/users/1/notes/notanumber').
        send();

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 404 if the specified user does not exist', async () => {
      const res = await request(app).
        delete('/users/1987345/notes/1').
        send();

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 404 if the specified note does not exist', async () => {
      const res = await request(app).
        delete('/users/1/notes/12345').
        send();

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchSnapshot();
    });

    it('should respond with an HTTP 404 if the specified note belongs to a different user', async () => {
      const res = await request(app).
        delete('/users/1/notes/1').
        send();

      expect(res.statusCode).toBe(404);
      expect(res.body).toMatchSnapshot();
    });
  });
});