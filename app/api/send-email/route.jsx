import OrderConfirmationEmail from '@/emails/index';
import OrderNotificationEmail from '@/emails/admin-notification';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL, // Your Gmail address
    pass: process.env.GMAIL_PASSWORD, // Your Gmail app password
  },
});

export async function POST(req) {

  try {
    const { email, orderDetails, subject= 'Order Confirmation', message = "Thank you for your order!" } = await req.json();

    console.log('Received data:', email, subject, message);

    if(!email || !orderDetails){
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Log the orderDetails to debug
    console.log("Order Details:", orderDetails);

    // Log the email addresses
    console.log("Sending email to user:", email);
    console.log("Sending email to admin:", process.env.ADMIN_EMAIL);

    // Generate HTML strings for the emails
    const userEmailHtml = OrderConfirmationEmail({ order: orderDetails });
    const adminEmailHtml = OrderNotificationEmail({ order: orderDetails });

    // Send Order Confirmation Email to the User
    const userMailOptions = {
      from: 'Royalspoon Foods & Events <royalspoonfoods4@gmail.com>', 
      to: email.trim(),
      subject: 'Order Confirmation',
      html: userEmailHtml,
    };
    console.log("User Mail Options:", userMailOptions);

    const userEmailResponse = await transporter.sendMail(userMailOptions);
    console.log("User Email sent to:", email, userEmailResponse);

    // Send Order Notification Email to the Admin
    const adminMailOptions = {
      from: 'Royalspoon Foods & Events <royalspoonfoods4@gmail.com>', 
      to: process.env.ADMIN_EMAIL.trim(), 
      subject: 'New Order Placed',
      html: adminEmailHtml,
    };
    console.log("Admin Mail Options:", adminMailOptions);

    const adminEmailResponse = await transporter.sendMail(adminMailOptions);
    console.log("Admin Email sent to:", process.env.ADMIN_EMAIL, adminEmailResponse);

    return NextResponse.json({ userEmailResponse, adminEmailResponse });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}