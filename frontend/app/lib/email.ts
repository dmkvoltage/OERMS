import sgMail from "@sendgrid/mail"

// Configure SendGrid
sgMail.setApiKey("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")

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export const emailService = {
  // Send registration approval email
  async sendRegistrationApproval(data: {
    studentEmail: string
    studentName: string
    examName: string
    examDate: string
    examCenter: string
    registrationId: string
  }) {
    const template: EmailTemplate = {
      to: data.studentEmail,
      subject: `Registration Approved - ${data.examName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Registration Approved!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Dear ${data.studentName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Congratulations! Your registration for <strong>${data.examName}</strong> has been approved.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #28a745;">Exam Details</h3>
              <p><strong>Exam:</strong> ${data.examName}</p>
              <p><strong>Date:</strong> ${data.examDate}</p>
              <p><strong>Center:</strong> ${data.examCenter}</p>
              <p><strong>Registration ID:</strong> ${data.registrationId}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #856404;">Important Instructions:</h4>
              <ul style="color: #856404;">
                <li>Print your admission card from your dashboard</li>
                <li>Arrive at the exam center 30 minutes early</li>
                <li>Bring a valid ID and admission card</li>
                <li>Check the exam center location in advance</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Dashboard
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Best of luck with your examination!<br>
              <strong>Ministry of Education - Cameroon</strong>
            </p>
          </div>
        </div>
      `,
      text: `
        Registration Approved - ${data.examName}
        
        Dear ${data.studentName},
        
        Your registration for ${data.examName} has been approved.
        
        Exam Details:
        - Exam: ${data.examName}
        - Date: ${data.examDate}
        - Center: ${data.examCenter}
        - Registration ID: ${data.registrationId}
        
        Please login to your dashboard to print your admission card.
        
        Ministry of Education - Cameroon
      `,
    }

    return this.sendEmail(template)
  },

  // Send registration rejection email
  async sendRegistrationRejection(data: {
    studentEmail: string
    studentName: string
    examName: string
    reason: string
    registrationId: string
  }) {
    const template: EmailTemplate = {
      to: data.studentEmail,
      subject: `Registration Update - ${data.examName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Registration Update</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Dear ${data.studentName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              We regret to inform you that your registration for <strong>${data.examName}</strong> requires attention.
            </p>
            
            <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h3 style="margin-top: 0; color: #721c24;">Registration ID: ${data.registrationId}</h3>
              <p style="color: #721c24;"><strong>Reason:</strong> ${data.reason}</p>
            </div>
            
            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #0c5460;">Next Steps:</h4>
              <ul style="color: #0c5460;">
                <li>Review the reason for rejection</li>
                <li>Correct any issues with your application</li>
                <li>Resubmit your registration if eligible</li>
                <li>Contact your institution for assistance</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Dashboard
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If you have questions, please contact your institution administrator.<br>
              <strong>Ministry of Education - Cameroon</strong>
            </p>
          </div>
        </div>
      `,
    }

    return this.sendEmail(template)
  },

  // Send exam results notification
  async sendResultsNotification(data: {
    studentEmail: string
    studentName: string
    examName: string
    grade: string
    passed: boolean
    resultId: string
  }) {
    const template: EmailTemplate = {
      to: data.studentEmail,
      subject: `Exam Results Available - ${data.examName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, ${data.passed ? "#28a745" : "#ffc107"} 0%, ${data.passed ? "#20c997" : "#fd7e14"} 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Exam Results Available</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Dear ${data.studentName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              Your results for <strong>${data.examName}</strong> are now available.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${data.passed ? "#28a745" : "#ffc107"};">
              <h3 style="margin-top: 0; color: ${data.passed ? "#28a745" : "#856404"};">Your Result</h3>
              <p><strong>Grade:</strong> ${data.grade}</p>
              <p><strong>Status:</strong> ${data.passed ? "PASSED" : "NEEDS IMPROVEMENT"}</p>
              <p><strong>Result ID:</strong> ${data.resultId}</p>
            </div>
            
            ${
              data.passed
                ? `
              <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #155724;">Congratulations! 🎉</h4>
                <p style="color: #155724;">You have successfully passed the examination. Your certificate will be available for download shortly.</p>
              </div>
            `
                : `
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #856404;">Next Steps</h4>
                <p style="color: #856404;">Don't be discouraged. Review your results and consider retaking the exam when registration opens again.</p>
              </div>
            `
            }
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student/results" 
                 style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Full Results
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Ministry of Education - Cameroon</strong>
            </p>
          </div>
        </div>
      `,
    }

    return this.sendEmail(template)
  },

  // Send exam reminder
  async sendExamReminder(data: {
    studentEmail: string
    studentName: string
    examName: string
    examDate: string
    examCenter: string
    daysUntilExam: number
  }) {
    const template: EmailTemplate = {
      to: data.studentEmail,
      subject: `Exam Reminder - ${data.examName} in ${data.daysUntilExam} days`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Exam Reminder</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Dear ${data.studentName},</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              This is a friendly reminder that your <strong>${data.examName}</strong> is coming up in <strong>${data.daysUntilExam} days</strong>.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
              <h3 style="margin-top: 0; color: #17a2b8;">Exam Details</h3>
              <p><strong>Date:</strong> ${data.examDate}</p>
              <p><strong>Center:</strong> ${data.examCenter}</p>
            </div>
            
            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #0c5460;">Preparation Checklist:</h4>
              <ul style="color: #0c5460;">
                <li>✓ Print your admission card</li>
                <li>✓ Prepare valid identification</li>
                <li>✓ Review exam center location</li>
                <li>✓ Plan your travel route</li>
                <li>✓ Get a good night's sleep</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Print Admission Card
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Good luck with your examination!<br>
              <strong>Ministry of Education - Cameroon</strong>
            </p>
          </div>
        </div>
      `,
    }

    return this.sendEmail(template)
  },

  // Generic email sender
  async sendEmail(template: EmailTemplate) {
    try {
      const msg = {
        to: template.to,
        from: {
          email: "noreply@education.cm",
          name: "Ministry of Education - Cameroon",
        },
        subject: template.subject,
        text: template.text,
        html: template.html,
      }

      const response = await sgMail.send(msg)
      console.log("Email sent successfully:", response[0].statusCode)
      return { success: true, messageId: response[0].headers["x-message-id"] }
    } catch (error) {
      console.error("Email sending failed:", error)
      throw error
    }
  },

  // Send bulk emails (for announcements)
  async sendBulkEmail(recipients: string[], template: Omit<EmailTemplate, "to">) {
    try {
      const messages = recipients.map((email) => ({
        to: email,
        from: {
          email: "noreply@education.cm",
          name: "Ministry of Education - Cameroon",
        },
        subject: template.subject,
        text: template.text,
        html: template.html,
      }))

      const response = await sgMail.send(messages)
      console.log(`Bulk email sent to ${recipients.length} recipients`)
      return { success: true, count: recipients.length }
    } catch (error) {
      console.error("Bulk email sending failed:", error)
      throw error
    }
  },
}
