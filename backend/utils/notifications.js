const twilio = require('twilio');
const nodemailer = require('nodemailer');

// Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Email transporter
const emailTransporter = process.env.EMAIL_USER && process.env.EMAIL_PASS 
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  : null;

// Send OTP via SMS
const sendOTP = async (phone, otp) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`OTP for ${phone}: ${otp}`);
      return;
    }

    if (!twilioClient) {
      console.log(`OTP for ${phone}: ${otp} (Twilio not configured)`);
      return;
    }

    await twilioClient.messages.create({
      body: `Your Kshirva verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
  } catch (error) {
    console.error('SMS sending error:', error.message);
    // Don't throw — SMS failure should not block registration
  }
};

// Send email
const sendEmail = async (to, subject, html) => {
  try {
    if (!emailTransporter) {
      console.log(`Email to ${to}: ${subject} (Email not configured)`);
      return;
    }
    
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send order notification
const sendOrderNotification = async (order, type) => {
  try {
    const messages = {
      'order_placed': 'Your order has been placed successfully!',
      'order_accepted': 'Your order has been accepted by the farmer.',
      'order_ready': 'Your order is ready for delivery.',
      'order_delivered': 'Your order has been delivered successfully.'
    };

    const message = messages[type] || 'Order status updated.';
    
    // Send SMS if phone notifications enabled
    if (order.consumer.preferences?.notifications?.sms) {
      await sendOTP(order.consumer.phone, message);
    }

    // Send email if email notifications enabled
    if (order.consumer.preferences?.notifications?.email) {
      await sendEmail(
        order.consumer.email,
        `Order Update - ${order.orderNumber}`,
        `<p>${message}</p><p>Order Number: ${order.orderNumber}</p>`
      );
    }
  } catch (error) {
    console.error('Notification sending error:', error);
  }
};

module.exports = {
  sendOTP,
  sendEmail,
  sendOrderNotification
};