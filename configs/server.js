'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import limiter from '../src/middlewares/validar-cant-peticiones.js'

import  { dbConnection } from './mongo.js';

import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({extended : false}));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

const routes = (app) => {
    app.use('/gestorComentarios/v1/auth', authRoutes);
    app.use('/gestorComentarios/v1/users', userRoutes);
};

export const conetarDB = async() => {
    try {
        await dbConnection();
        console.log('Base de datos conectada correctamente');
    } catch (error) {
        console.log('Error al conectar con la base de datos', error) 
    }
};

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3001;

    try {
        middlewares(app);
        conetarDB(app);
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(`Server init failed ${error}`)
    }
}

