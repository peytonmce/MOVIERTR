import express from 'express';
import bcrypt, { genSalt } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaclient.js'

const router = express.Router();

router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    //encryption
    const hashedPassword = bcrypt.hashSync(password, 8);

    //save new user and hashed password
    try{
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        //add first movie for new user
        const defaultMovie = `Hi! Add your first movie rating`;
        await prisma.movie.create({
            data: {
                moviename: defaultMovie,
                rating: 1,
                userId: user.id
            }
        });

        //create a token - FIXED: changed result.lastInsertRowid to user.id
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.json({token});
    }
    catch (err) {
        console.log(err.message);
        res.sendStatus(503);
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try{
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if(!user) {return res.status(404).send({message: "User not found"})};

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if(!passwordIsValid){ return res.status(401).send({message: "Invalid password"})};
        console.log(user);

        //At this point, all tests have been passed
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: `24h`});
        res.send({ token });
    }
    catch(err){
        console.log(err.message);
        res.sendStatus(503);
    }
});

export default router;