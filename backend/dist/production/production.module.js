"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const production_service_1 = require("./production.service");
const production_controller_1 = require("./production.controller");
const production_item_entity_1 = require("./entities/production-item.entity");
const bom_entity_1 = require("./entities/bom.entity");
const work_center_entity_1 = require("./entities/work-center.entity");
const routing_entity_1 = require("./entities/routing.entity");
const manufacturing_order_entity_1 = require("./entities/manufacturing-order.entity");
let ProductionModule = class ProductionModule {
};
exports.ProductionModule = ProductionModule;
exports.ProductionModule = ProductionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                production_item_entity_1.ProductionItem,
                bom_entity_1.BillOfMaterial,
                bom_entity_1.BOMComponent,
                work_center_entity_1.WorkCenter,
                routing_entity_1.Routing,
                routing_entity_1.Operation,
                manufacturing_order_entity_1.ManufacturingOrder,
                manufacturing_order_entity_1.MOOperation,
            ]),
        ],
        providers: [production_service_1.ProductionService],
        controllers: [production_controller_1.ProductionController],
        exports: [production_service_1.ProductionService],
    })
], ProductionModule);
//# sourceMappingURL=production.module.js.map