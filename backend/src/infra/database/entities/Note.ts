import { v7 as uuidv7 } from 'uuid'
import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm"
import { User } from './User'

@Entity()
export class Note {
    @PrimaryColumn()
    uuid: string = uuidv7()

    @Column({
        length: 100
    })
    title: string

    @Column()
    content: string

    @ManyToOne(() => User, (user) => user.uuid)
    user: User

}