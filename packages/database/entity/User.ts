import { v7 as uuidv7 } from 'uuid'
import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm"
import { Note } from "./Note.js"

@Entity()
export class User {

    @PrimaryColumn()
    uuid: string = uuidv7()

    @Column()
    username: string

    @Column()
    password: string

    @OneToMany(() => Note, (note) => note.uuid)
    notes?: Note[]

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}
