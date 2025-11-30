"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppMessage = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
const db = admin.firestore();
// Environment variables should be set in Firebase config
// firebase functions:config:set meta.access_token="YOUR_TOKEN" meta.phone_number_id="YOUR_ID"
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || ((_a = functions.config().meta) === null || _a === void 0 ? void 0 : _a.access_token);
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || ((_b = functions.config().meta) === null || _b === void 0 ? void 0 : _b.phone_number_id);
exports.sendWhatsAppMessage = functions.firestore
    .document('whatsappMessages/{messageId}')
    .onCreate(async (snap, context) => {
    var _a, _b;
    const data = snap.data();
    const messageId = context.params.messageId;
    if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID) {
        console.error('Meta configuration missing');
        await snap.ref.update({ status: 'failed', error: 'Configuration missing' });
        return;
    }
    try {
        // Format phone number (remove + and ensure it's just digits)
        const to = data.to.replace(/\D/g, '');
        const payload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: { body: data.message }
        };
        const response = await axios_1.default.post(`https://graph.facebook.com/v17.0/${META_PHONE_NUMBER_ID}/messages`, payload, {
            headers: {
                'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        await snap.ref.update({
            status: 'sent',
            whatsappId: response.data.messages[0].id,
            sentAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`WhatsApp message sent to ${to}`);
    }
    catch (error) {
        console.error('Error sending WhatsApp message:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        await snap.ref.update({
            status: 'failed',
            error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
            failedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }
});
//# sourceMappingURL=whatsapp.js.map