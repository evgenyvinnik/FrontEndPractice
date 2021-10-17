var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const { users } = req.app.get('db');

  res.send({ users });
});

router.post('/', function(req, res, next) {
  if (!req.body) {
    return res.status(401).send({ code: 401, message: 'No POST body specified' });
  }
  if (!req.body.hasOwnProperty('name')) {
    return res.status(401).send({ code: 401, message: 'POST parameters must contain field \'name\'' });
  }

  const { users } = req.app.get('db');
  const newUser = {
    id: Math.max(...users.map(user => user.id)) + 1,
    name: req.body.name,
    email: req.body.email || '',
  }
  users.push(newUser);

  res.status(201).send(newUser);
});

router.get('/:userId', function(req, res, next) {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).send({ code: 400, message: 'Invalid user ID' });
  }

  const { users } = req.app.get('db');
  const user = users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).send({ code: 404, message: `No such user with ID ${userId}`});
  }

  res.status(200).send(user);
});

router.put('/:userId', function(req, res, next) {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).send({ code: 400, message: 'Invalid user ID' });
  }
  const missingFields = ['name', 'email'].filter(field => !req.body.hasOwnProperty(field));
  if (missingFields.length > 0) {
    return res.status(422).send({ code: 422, message: `Request body missing fields ${missingFields.join(', ')}` });
  }

  const { users } = req.app.get('db');
  const user = users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).send({ code: 404, message: `No such user with ID ${userId}`});
  }
  user.name = req.body.name;
  user.email = req.body.email;
  user.tags = req.body.tags;

  res.status(200).send(user);
});

router.delete('/:userId', function(req, res, next) {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).send({ code: 400, message: 'Invalid user ID' });
  }
  const { users } = req.app.get('db');
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex < 0) {
    return res.status(404).send({ code: 404, message: `No such user with ID ${userId}` });
  }
  users.splice(userIndex, 1);

  res.status(204).send();
});

router.use('/:userId/notes', require('./users/notes'));

module.exports = router;
