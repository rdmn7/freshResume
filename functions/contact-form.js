export async function onRequestPost(context) {
  try {
    // Parse the JSON data from the request
    const formData = await context.request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'email', 'organization', 'message'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return new Response(JSON.stringify({ success: false, error: `Missing required field: ${field}` }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
    
    // Construct email content (plain text version)
    const plainTextContent = `
      New contact form submission:
      
      Name: ${formData.firstName} ${formData.lastName || ''}
      Email: ${formData.email}
      Phone: ${formData.phone || 'Not provided'}
      Organization: ${formData.organization}
      Subject: ${formData.subject || 'No subject'}
      
      Message:
      ${formData.message}
    `;
    
    // Create HTML email content with modern design
    const htmlContent = createHtmlEmail(formData);
    
    // Send email using Resend
    const emailResult = await sendEmailViaResend(formData, plainTextContent, htmlContent, context.env);
    
    if (emailResult.success) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      throw new Error(emailResult.error || 'Unknown error sending email');
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Server error: ' + error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

async function sendEmailViaResend(formData, plainTextContent, htmlContent, env) {
  try {
    // If RESEND_API_KEY environment variable is not set, return an error
    if (!env || !env.RESEND_API_KEY) {
      return { 
        success: false, 
        error: 'Email service not properly configured'
      };
    }
    
    // Create the email payload for Resend API
    const emailPayload = {
      from: "contact-form@rdvnit.nl",
      to: "info@rdvnit.nl",
      subject: `Contact Form: ${formData.subject || 'New message'} - ${formData.firstName} ${formData.lastName || ''}`,
      text: plainTextContent,
      html: htmlContent
    };
    
    // Handle file attachment if present
    if (formData.attachment && formData.attachmentData) {
      try {
        // Parse the base64 data
        const fileData = formData.attachmentData;
        const fileName = formData.attachment.name;
        const fileType = formData.attachment.type;
        
        // Add attachment to the email payload
        emailPayload.attachments = [
          {
            filename: fileName,
            content: fileData,
            content_type: fileType
          }
        ];
      } catch (attachError) {
        // Continue without attachment if there's an error
      }
    }
    
    // Send the email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`
      },
      body: JSON.stringify(emailPayload)
    });
    
    // Parse the response
    const result = await response.json();
    
    // Check if the request was successful
    if (!response.ok) {
      return { 
        success: false, 
        error: `Email API error: ${response.status}`
      };
    }
    
    return { success: true, id: result.id };
  } catch (error) {
    return { 
      success: false, 
      error: error.message
    };
  }
}

// Function to create a modern HTML email template
function createHtmlEmail(formData) {
  const { firstName, lastName, email, phone, organization, subject, message, attachment } = formData;
  
  // Format the attachment information if present
  let attachmentInfo = '';
  if (attachment) {
    attachmentInfo = `
      <tr>
        <td style="padding: 10px 20px; border-bottom: 1px solid #f0f0f0;">
          <p style="margin: 0; color: #666666; font-weight: bold;">Attachment</p>
          <p style="margin: 5px 0 0 0;">${attachment.name} (${formatFileSize(attachment.size)})</p>
        </td>
      </tr>
    `;
  }
  
  // Create the HTML template
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <div style="background-color: #0062cc; color: #ffffff; padding: 20px 30px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 20px; border-bottom: 1px solid #f0f0f0;">
                <p style="margin: 0; color: #666666; font-weight: bold;">Name</p>
                <p style="margin: 5px 0 0 0;">${firstName} ${lastName || ''}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 20px; border-bottom: 1px solid #f0f0f0;">
                <p style="margin: 0; color: #666666; font-weight: bold;">Email</p>
                <p style="margin: 5px 0 0 0;"><a href="mailto:${email}" style="color: #0062cc; text-decoration: none;">${email}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 20px; border-bottom: 1px solid #f0f0f0;">
                <p style="margin: 0; color: #666666; font-weight: bold;">Phone</p>
                <p style="margin: 5px 0 0 0;">${phone || 'Not provided'}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 20px; border-bottom: 1px solid #f0f0f0;">
                <p style="margin: 0; color: #666666; font-weight: bold;">Organization</p>
                <p style="margin: 5px 0 0 0;">${organization}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 20px; border-bottom: 1px solid #f0f0f0;">
                <p style="margin: 0; color: #666666; font-weight: bold;">Subject</p>
                <p style="margin: 5px 0 0 0;">${subject || 'No subject'}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 20px; border-bottom: 1px solid #f0f0f0;">
                <p style="margin: 0; color: #666666; font-weight: bold;">Message</p>
                <div style="margin: 10px 0 0 0; padding: 15px; background-color: #f9f9f9; border-radius: 4px; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
              </td>
            </tr>
            ${attachmentInfo}
          </table>
        </div>
        
        <div style="padding: 15px 20px; background-color: #f5f5f5; color: #777777; font-size: 13px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0;">This message was sent from your website contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper function to format file size in a readable format
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
} 