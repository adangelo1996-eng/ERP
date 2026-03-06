"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalEntry = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../core/database/base-entity");
const journal_line_entity_1 = require("./journal-line.entity");
const ledger_entity_1 = require("./ledger.entity");
let JournalEntry = class JournalEntry extends base_entity_1.BaseEntityWithTenant {
    ledger;
    postingDate;
    reference;
    source;
    posted;
    lines;
};
exports.JournalEntry = JournalEntry;
__decorate([
    (0, typeorm_1.ManyToOne)(() => ledger_entity_1.Ledger, { nullable: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", ledger_entity_1.Ledger)
], JournalEntry.prototype, "ledger", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], JournalEntry.prototype, "postingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 128 }),
    __metadata("design:type", String)
], JournalEntry.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], JournalEntry.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], JournalEntry.prototype, "posted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => journal_line_entity_1.JournalLine, (line) => line.entry, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], JournalEntry.prototype, "lines", void 0);
exports.JournalEntry = JournalEntry = __decorate([
    (0, typeorm_1.Entity)({ name: 'fin_journal_entries' })
], JournalEntry);
//# sourceMappingURL=journal-entry.entity.js.map