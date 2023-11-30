import {Test} from '@nestjs/testing';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {AuthService} from './auth.service';
import {User} from './user.entity';
import {NotFoundException} from '@nestjs/common';

describe('UsersController', () => {
    let controller: UsersController;
    let fakeUsersService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>

    beforeEach(async () => {
        fakeAuthService = {
            signin: (email: string, password: string) => {
                return Promise.resolve({id: 1, email, password} as User);
            },
        }

        fakeUsersService = {
            findOne: (id: number) => {
                return Promise.resolve({id, email: 'test@test', password: 'password'} as User);
            },
            find: (email: string) => {
                return Promise.resolve([{id: 1, email, password: 'password'} as User]);
            },
        }

        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService
                }
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('findAllUsers returns a list of users with the given email', async () => {
        const users = await controller.findAllUsers('test@test.com');
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual('test@test.com');
    });

    it('findUser returns a single user with the given id', async () => {
        const user = await fakeUsersService.findOne(1);
        expect(user).toBeDefined()
    });

    it('findUser throws an error if user with given id is not found', async () => {
        fakeUsersService.findOne = async (id: number) => {
            throw new NotFoundException()
        };

        await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
    });

    it('signin updates session object and returns user', async () => {
        const session = {userId: -1};
        const user = await controller.signin({email: 'test@test', password: 'password'}, session);

        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1);
    });
});
