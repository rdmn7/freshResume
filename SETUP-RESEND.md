# Setting Up Resend Email Service

This guide will walk you through setting up Resend to send emails from your contact form. Resend is a modern email API service that works well with Cloudflare Pages Functions.

## 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com) and sign up for an account
2. Verify your email address to activate your account

## 2. Verify Your Domain

1. In the Resend dashboard, navigate to the "Domains" section
2. Click "Add Domain" and enter your domain (rdvnit.nl)
3. Follow the instructions to add the necessary DNS records to your Cloudflare DNS:

   - **DKIM Record**
     - This will be provided by Resend - copy it exactly as shown
   - **SPF Record**
     - Find your existing SPF record in your Cloudflare DNS settings
     - Update it to include `include:spf.resend.com`
     - Example: `v=spf1 include:spf.protection.outlook.com include:spf.resend.com ~all`
     - Note: Do NOT create a second SPF record, just update your existing one
   - **DMARC Record**
     - If you don't already have one, add the DMARC record as provided by Resend

4. Click "Verify" in the Resend dashboard (it may take a few minutes for the DNS changes to propagate)

## 3. Create an API Key

1. In the Resend dashboard, navigate to the "API Keys" section
2. Click "Create API Key"
3. Give your key a descriptive name (e.g., "Contact Form")
4. Copy the generated API key and store it securely

## 4. Add the API Key to Cloudflare Pages

1. Go to your Cloudflare Dashboard > Pages > Your site > Settings > Functions > Environment variables
2. Add a new variable:
   - Name: `RESEND_API_KEY`
   - Value: Paste your API key from step 3
3. Save the variable

## 5. Deploy Your Site

1. Push all the code changes to your GitHub repository
2. Cloudflare Pages will automatically deploy the changes

## 6. Troubleshooting

If you encounter issues:

1. Check the Cloudflare Pages Functions logs in your Cloudflare dashboard
2. Make sure your RESEND_API_KEY environment variable is correctly set
3. Verify that your domain DNS records are correctly configured
4. Check your spam folder for emails

## 7. Office 365 Integration

Since you're using Office 365 for your email, make sure:

1. Your SPF record includes both Office 365 and Resend
2. Add contact-form@rdvnit.nl to your safe senders list in Office 365
3. Check your spam folder for emails

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Cloudflare Pages Functions Documentation](https://developers.cloudflare.com/pages/platform/functions/)
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/) 