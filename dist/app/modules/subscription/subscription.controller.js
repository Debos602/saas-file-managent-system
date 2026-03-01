"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const subscription_service_1 = require("./subscription.service");
// Admin Actions
const createPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield subscription_service_1.SubscriptionService.createPackage(data);
    res.json(result);
});
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    const result = yield subscription_service_1.SubscriptionService.updatePackage(id, data);
    res.json(result);
});
const deletePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield subscription_service_1.SubscriptionService.deletePackage(id);
    res.json(result);
});
const getAllPackages = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_service_1.SubscriptionService.getAllPackages();
    res.json(result);
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield subscription_service_1.SubscriptionService.getById(id);
    res.json(result);
});
//user Actions
const selectPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    console.log("user", user);
    const { packageId } = req.body;
    const result = yield subscription_service_1.SubscriptionService.selectPackageForUser(user.id, packageId);
    res.json(result);
});
const getUserSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield subscription_service_1.SubscriptionService.getUserSubscriptions(user.id);
    res.json(result);
});
exports.SubscriptionController = {
    createPackage,
    updatePackage,
    deletePackage,
    getAllPackages,
    getById,
    selectPackage,
    getUserSubscriptions
};
