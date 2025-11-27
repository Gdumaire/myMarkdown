var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { v7 as uuidv7 } from 'uuid';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from './User';
let Note = class Note {
    uuid = uuidv7();
    title;
    content;
    user;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Note.prototype, "uuid", void 0);
__decorate([
    Column({
        length: 100
    }),
    __metadata("design:type", String)
], Note.prototype, "title", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Note.prototype, "content", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.id),
    __metadata("design:type", User)
], Note.prototype, "user", void 0);
Note = __decorate([
    Entity()
], Note);
export { Note };
//# sourceMappingURL=Note.js.map