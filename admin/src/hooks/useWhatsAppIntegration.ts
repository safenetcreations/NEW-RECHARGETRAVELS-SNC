export const useWhatsAppIntegration = () => {
  const sendMessage = async (phoneNumber: string, message: string) => {
    console.log('WhatsApp integration:', { phoneNumber, message });
    return { success: true };
  };
  
  const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    return sendMessage(phoneNumber, message);
  };

  return { 
    sendMessage,
    sendWhatsAppMessage 
  };
};