// implement your API here
const db = require('./data/db');
const express = require('express');
const server = express();

server.listen(5000, () => {
    console.log('=== server is now listening on port 5000 ===')
});

server.use(express.json());

server.get('/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: err,
                error: 'The users information could not be retrieved.',
            })
        })
});

server.get('/users/:id', (req, res) => {
    const {id} = req.params;
    db.findById(id)
        .then(user => {
            if (!user) {
                res
                  .status(404)
                  .json({ message: "That user ID doesn't exist on this server."});
            } else {
                res.status(200).json(user)
        }})
        .catch(err => {
            res.status(500).json({
                message: err,
                error: "The user information could not be retrieved."
            })
        })
});

server.post('/users', (req, res) => {
    const userInfo = req.body;
    console.log('body', userInfo)
    if('name' && 'bio' in userInfo === false){
        res.status(404).json({
            errorMessage: "Please provide name and bio for the user."
        })
    };

    db.insert(userInfo)
        .then(user => {
        res.status(201).json({
            success: true,
            user,
        })
    })        
    .catch(err => {
        res.status(500).json({
            success: false,
            err,
            error: "There was an error while saving the user to the database"
        })
    })

})

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
        .then(deletedUser => {
            if(deletedUser){
                res.status(204).end();
            } else {
                res.status(400).json({
                    message: "The user with the specified ID does not exist.",
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                err,
                error: "The user could not be removed",
            })
        })
})

server.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const userInfo = req.body;

    db.findById(id).then(user => {
        console.log(user)
      if (!user) {
        res
          .status(404)
          .json({ message: "That user ID doesn't exist on this server."});
      } else if (!userInfo.name && !userInfo.bio) {
        res
          .status(400)
          .json({ error: "Please enter a user name or bio."});
      } else {
        db
          .update(id, userInfo)
          .then(user => {
            res.status(200).json({
                success: true,
                user,
            });
          })
        }
    })
        .catch(err => {
            res.status(500).json({
                success: false,
                err,
                error: "The user information could not be modified."
            })
        })
})