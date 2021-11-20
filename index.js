const express = require('express');
const jwt = require('jsonwebtoken');
const contacts = require('./contacts.json');

const api = express();
const SECRET = 'y2dhtXiw*@KMXzw&eTMtTHlu6';     //https://www.lastpass.com/pt/features/password-generator

// CONFIGURACOES
checkToken = (req, res, next) => {
    if (req.path === '/login' || req.path === 'register' || req.path === '/') {
        next();

    } else {
        const token = req.headers['authorization'];

        if (!token) {
            return sendStatus(res, 403);
        }
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                return sendStatus(res, 401);
            }
            req.userId = decoded.id;

            next();
        });
    }
}

api.use(express.json());
api.use(checkToken);
api.listen(3000, () => {
    console.log('Server is running: http://localhost:3000');
});

// ROTAS
api.get('/', (_req, res) => {
    res.send('Api Rest em Node+JWT');
});

api.post('/login', (req, res) => {
    if (req.body.username === 'demo' && req.body.password === 'demo') {
        const token = jwt.sign({
            id: 1,
            username: req.body.username
        }, SECRET, {
            expiresIn: '1d' // 300 // 5 minutos
        });
        
        res.send({ token });

        //sendStatus(res, 200);
    }
    else {
        sendStatus(res, 401);
    }
});

api.get('/contacts', (_req, res) => {
    res.send(contacts);
});

api.get('/contacts/filter', (req, res) => {
    const { name, email } = req.query;
    
    const filteredContacts = contacts.filter(c => {
        return c.name.toLowerCase().includes(name? name.toLowerCase() :null) ||
            c.email.toLowerCase().includes(email? email.toLowerCase() :null);
    });

    res.send(filteredContacts);        
});

// METODOS
function sendStatus(response, statusCode) {
    let msg = ''

    switch (statusCode) {
        case 200:
            msg = 'OK';
            break;
        case 201:
            msg = 'Created';
            break;
        case 204:
            msg = 'No Content';
            break;
        case 400:
            msg = 'Bad Request';
            break;
        case 401:
            msg = 'Unauthorized';
            break;
        case 403:
            msg = 'No token provided.';
            break;
        case 404:
            msg = 'Not Found';
            break;
        case 500:
            msg = 'Internal Server Error';
            break;
        default:
            msg = 'Unknown Error';
    }

    return response.status(statusCode).send({ message: msg });
}   // fim sendStatus