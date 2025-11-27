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
import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Note } from "./Note.js";
let User = class User {
    constructor(username, password) {
        this.uuid = uuidv7();
        this.username = username;
        this.password = password;
    }
};
__decorate([
    PrimaryColumn(),
    __metadata("design:type", String)
], User.prototype, "uuid", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    OneToMany(() => Note, (note) => note.uuid),
    __metadata("design:type", Array)
], User.prototype, "notes", void 0);
User = __decorate([
    Entity(),
    __metadata("design:paramtypes", [String, String])
], User);
export { User };
//# sourceMappingURL=User.js.map