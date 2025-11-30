import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

const db = admin.firestore();

// Environment variables should be set in Firebase config
// firebase functions:config:set meta.access_token="YOUR_TOKEN" meta.phone_number_id="YOUR_ID"
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || functions.config().meta?.access_token;
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || functions.config().meta?.phone_number_id;

export const sendWhatsAppMessage = functions.firestore
    .document('whatsappMessages/{messageId}')
    .onCreate(async (snap, context) => {
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

            const response = await axios.post(
                `https://graph.facebook.com/v17.0/${META_PHONE_NUMBER_ID}/messages`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await snap.ref.update({
                status: 'sent',
                whatsappId: response.data.messages[0].id,
                sentAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`WhatsApp message sent to ${to}`);

        } catch (error: any) {
            console.error('Error sending WhatsApp message:', error.response?.data || error.message);
            await snap.ref.update({
                status: 'failed',
                error: error.response?.data || error.message,
                failedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }
    });
