/* eslint-disable */
const { user_game } = require('../models');
const user = require('../controllers/userController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockRequest = (body = {}) => {
    return { body };
}
 
const mockResponse = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
}

describe('register function', () => {
    // negative test (1)
    test('Should 401 if email already registered', async () => {
        const req = mockRequest({
            email: 'email',
        });

        const res = mockResponse();
        user_game.findOne.mockResolvedValueOnce({
            email: 'email',
        });

        await user.register(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Email already registered.",
        });
    });

    // positive test (1)
    test('Should 200 if registration success', async () => {
        const req = mockRequest({
            email: 'email',
            username: 'username',
            password: 'password',
            city: 'city',
            role: 'role',
            picture: 'pictureUrl'
        });

        user_game.create.mockResolvedValueOnce({
            email: 'email',
            username: 'username',
            password: 'password',
            city: 'city',
            role: 'role',
            picture: 'pictureUrl'
        })

        const res = mockResponse();
        await user.register(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Registration successful.",
            data: {
                email: 'email',
                username: 'username',
                city: 'city',
                role: 'role',
                picture: 'pictureUrl'
            }
        });
    })
});

describe('login function', () => {
    // negative test (2)
    test('Should 401 if user is not registered', async () => {
        const req = mockRequest({
            username: 'username',
        });

        const res = mockResponse();
        user_game.findOne.mockResolvedValueOnce();

        await user.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "User is not registered.",
        });
    });

    // negative test (3)
    test('Should 401 if password is wrong', async () => {
        const req = mockRequest({
            password: 'password'
        });

        const res = mockResponse();

        user_game.findOne.mockResolvedValueOnce({
            password: 'password',
        })

        await user.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Wrong password.",
        })
    })

    // positive test (2)
    test('Should 200 if login successful', async () => {
        const req = mockRequest({
            username: 'username',
            password: 'password'
        });

        const res = mockResponse();

        user_game.findOne.mockReturnValueOnce({
            id: 1,
            email: 'email',
            username: 'username',
            city: 'city',
            roles: 'roles',
        });

        await bcrypt.compare.mockReturnValueOnce(true);
        jwt.sign.mockReturnValueOnce('jwt');

        await user.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Login successful.",
            data: {
                id: 1,
                email: 'email',
                username: 'username',
                city: 'city',
                roles: 'roles',
                token: 'jwt'
            }
        });
    });
});
