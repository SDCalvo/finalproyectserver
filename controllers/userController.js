const userModel = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//create a user 
async function createUser(req, res) {

    const { email, password, name, lastName, role } = req.body;

    if(!email) {
        return res.status(400).send({
            message: 'El campo email es requerido'
        });
    }
    if(!password) {
        return res.status(400).send({
            message: 'El campo contraseña es requerido'
        });
    }
    if(!name) {
        return res.status(400).send({
            message: 'El campo nombre es requerido'
        });
    }
    if(!lastName) {
        return res.status(400).send({
            message: 'El campo apellido es requerido'
        });
    }
    if(!role) {
        return res.status(400).send({
            message: 'El campo rol es requerido'
        });
    }
    if(!role.includes('admin') && !role.includes('user')) {
        return res.status(400).send({
            message: 'Los valores válidos para el campo rol son admin o user'
        });
    }

    try{
        //make sure user doesn't already exist
        const oldUser = await userModel.findOne({
            where: {
                email
            }
        });
        
        if(oldUser) {
            return res.status(400).send({
                message: 'El usuario ya existe'
            });
        }
        //hash password
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = await userModel.create({
            email: email.toLowerCase(),
            password: hash,
            name,
            lastName,
            role
        });
        res.json(user);
    }
    catch(err){
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}

async function login(req, res){
    const { email, password } = req.body;

    if(!email) {
        return res.status(400).send({
            message: 'El campo email es requerido'
        });
    }
    if(!password) {
        return res.status(400).send({
            message: 'El campo contraseña es requerido'
        });
    }

    try{
        const user = await userModel.findOne({
            where: {
                email
            }
        });

        if(!user) {
            return res.status(401).send({
                message: 'Usuario o contraseña incorrectos  '
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) {
            return res.status(401).send({
                message: 'Usuario o contraseña incorrectos'
            });
        }

        //create token with 1 day expiration
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        
        const loggedUser = {
            ...user._doc,
            token: token
        };
        res.status(200).send(loggedUser);
    }
    catch(err){
        console.log("Error: ", err);
        res.status(500).send(err);
    }
} 

exports.createUser = createUser;
exports.login = login;

