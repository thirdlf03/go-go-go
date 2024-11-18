"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const long_1 = tslib_1.__importDefault(require("long"));
function patchLongJs() {
    const originalLongFromValue = long_1.default.fromValue.bind(long_1.default);
    long_1.default.fromValue = (value) => {
        if (typeof value === 'bigint') {
            return long_1.default.fromValue(value.toString());
        }
        return originalLongFromValue(value);
    };
}
patchLongJs();
