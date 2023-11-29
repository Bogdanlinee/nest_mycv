import {Test} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {UsersService} from './users.service';
import {User} from './user.entity';
import {BadRequestException, NotFoundException} from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];

        // Create a fake copy of the users service
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {id: users.length, email, password} as User;
                users.push(user);
                return Promise.resolve(user);
            },
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                }
            ],
        }).compile();

        service = module.get(AuthService);
    })

    it('Can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('Creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('test@test.com', 'password');
        expect(user.password).not.toEqual('password');

        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('test@test.com', 'password');
        await expect(service.signup('test@test.com', 'password'))
            .rejects.toThrow(BadRequestException);
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('test@test.com', 'password'))
            .rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        await service.signup('test@test.com', 'password');
        await expect(service.signin('test@test.com', 'password123'))
            .rejects.toThrow(NotFoundException);
    });

    it('Returns a user if correct password is provided', async () => {
        await service.signup('test@test.com', 'password');
        const user = await service.signin('test@test.com', 'password');
        expect(user).toBeDefined();
    });
});
