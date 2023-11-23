import {AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log('Inserted user with id', this, this.id);
    }

    @AfterUpdate()
    logAfterUpdate() {
        console.log('Updated user with id', this, this.id);
    }

    @AfterRemove()
    logAfterRemove() {
        console.log('Removed user with id', this, this.id);
    }
}