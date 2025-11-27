import { v7 as uuidv7 } from 'uuid'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from './User.js'

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    uuid: string = uuidv7()

    @Column({
        length: 100
    })
    title: string

    @Column()
    content?: string

    @ManyToOne(() => User, (user) => user.uuid)
    user: User

    constructor(title: string, user:User) {
        this.title = title;
        this.user = user;
    }
}