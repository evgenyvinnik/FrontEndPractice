var express = require("express");
var router = express.Router({
    mergeParams: true
});

function parseUserId(req, res, next) {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
        res.status(400).send({ code: 400, message: "Invalid user ID" });
        return;
    }
    const { users } = req.app.get("db");
    const user = users.find(user => user.id === userId);
    if (!user) {
        res.status(404).send({
            code: 404,
            message: `No such user with ID ${userId}`
        });
        return;
    }

    res.locals.user = user;
    next();
}

router.get("/", parseUserId, function(req, res, next) {
    const { user } = res.locals;
    const { notes } = req.app.get("db");
    res.send({
        notes: notes.filter(note => note.user_id === user.id)
    });
});

router.post("/", parseUserId, function(req, res, next) {
    if (!req.body) {
        return res
            .status(401)
            .send({ code: 401, message: "No POST body specified" });
    }
    if (!req.body.hasOwnProperty("content")) {
        return res.status(401).send({
            code: 401,
            message: "POST parameters must contain field 'content'"
        });
    }

    const { user } = res.locals;
    const { notes } = req.app.get("db");
    var created = new Date();
    const newNote = {
        id: Math.max(...notes.map(note => note.id)) + 1,
        created_at: created.toISOString(),
        content: req.body.content,
        user_id: user.id
    };
    notes.push(newNote);

    res.status(201).send(newNote);
});

router.put("/:noteId", parseUserId, function(req, res, next) {
    const noteId = parseInt(req.params.noteId, 10);
    if (isNaN(noteId)) {
        return res.status(400).send({ code: 400, message: "Invalid note ID" });
    }
    const missingFields = ["content"].filter(
        field => !req.body.hasOwnProperty(field)
    );
    if (missingFields.length > 0) {
        return res.status(422).send({
            code: 422,
            message: `Request body missing fields ${missingFields.join(", ")}`
        });
    }

    const { user } = res.locals;
    const { notes } = req.app.get("db");
    const note = notes.find(note => note.id === noteId);
    if (!note || note.user_id !== user.id) {
        return res.status(404).send({
            code: 404,
            message: "The specified note does not belong to the given user."
        });
    }

    note.content = req.body.content;

    res.status(200).send(note);
});

router.delete("/:noteId", parseUserId, function(req, res, next) {
    const noteId = parseInt(req.params.noteId, 10);
    if (isNaN(noteId)) {
        return res.status(400).send({ code: 400, message: "Invalid note ID" });
    }

    const { user } = res.locals;
    const { notes } = req.app.get("db");
    const noteIndex = notes.findIndex(
        note => note.id === noteId && note.user_id === user.id
    );

    if (noteIndex < 0) {
        return res.status(404).send({
            code: 404,
            message: `There is no user with the ID ${user.id} with note ${noteId}`
        });
    }
    notes.splice(noteIndex, 1);

    res.status(204).send();
});

module.exports = router;
