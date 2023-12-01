import {AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Report} from '../reports/report.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

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