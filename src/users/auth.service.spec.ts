import {Test} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {UsersService} from './users.service';
import {User} from './user.entity';
import {BadRequestException, NotFoundException} from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the users service
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User),
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

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('Creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('danTest01@gmail.com', 'test123!');
        expect(user.password).not.toEqual('test123!');

        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{id: 1, email: '55', password: '1'} as User]);
        await expect(service.signup('test', 'asdf'))
            .rejects.toThrow(BadRequestException);
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('asdflkj@asdlfkj.com', 'passdflkj'))
            .rejects.toThrow(NotFoundException);
    });
});