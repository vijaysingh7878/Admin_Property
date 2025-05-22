const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const userController = require('../controller/userController');
const authAdmin = require('../Middleware/authAdmin');
const userRouter = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'users'
    }
})

const userImg = multer({ storage: storage })

// user create part
userRouter.post('/create', userImg.single('profile_Photo'), (req, res) => {
    const result = new userController().createUser(req.body, req.file).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})


// user read part
userRouter.get('/read', (req, res) => {
    const result = new userController().readUser(req.query).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// statusChange part
userRouter.put('/status-change', async (req, res) => {
    const result = new userController().statusChangeUser(req.query).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})
// remove-profile part
userRouter.put('/remove-profile', async (req, res) => {
    const result = new userController().removeProfileUser(req.query).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// user update part
userRouter.patch('/user-update/:id', userImg.single('profile_Photo'), async (req, res) => {
    const result = new userController().editUser(req.body, req.file, req.params.id).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// user login chack part
userRouter.post('/login', async (req, res) => {
    try {
        const result = await new userController().loginUser(req.body);
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

// delete user part 
userRouter.delete('/delete/:id', (req, res) => {
    const result = new userController().userDelete(req.params.id).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

// like property part 
userRouter.post(
    '/add-to-like',
    (req, res) => {
        const result = new userController().addToLike(req.body);
        result.then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);
            }
        )
    }
)

// remove like property part 
userRouter.post(
    '/remove-to-like',
    (req, res) => {
        const result = new userController().removeToLike(req.body);
        result.then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);
            }
        )
    }
)

//  password update part
userRouter.post('/password', async (req, res) => {
    const result = new userController().editPassword(req.body).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})

//  admin Login part
userRouter.post('/adminLogin', async (req, res) => {
    const result = new userController().adminLogin(req.body).then(
        (success) => {
            res.send(success);
        }
    ).catch(
        (error) => {
            res.send(error);
        }
    )
})


module.exports = userRouter;