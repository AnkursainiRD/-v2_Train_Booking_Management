import nodemailer from 'nodemailer'

function generateOtp(length = 6) {
    let otp = '';
    const characters = '0123456789'; // You can include alphabets if you want a mix of letters and numbers
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }
  
    return otp;
  }


const sendMailConfig=async()=>{
    try {
        let transporter=await nodemailer.createTransport({
            service:"gmail",
            host:"smtp.gmail.com",
            secure:true,
            port:465,
            auth:{
                user:"gmingwithshadow@gmail.com",
                pass:"lvgo mrgb mrfi bejj"
            }
        })
        return transporter
    } catch (error) {
        console.log(error)
        throw error
    }
}


const mailSenderService=async(mail)=>{
    try {
        const transporter =await sendMailConfig()
        const otp=generateOtp(4)
        const info=await transporter.sendMail({
            from:`<${process.env.USER}>`,
            to:`${mail}`,
            subject:"Registration Verification",
            text:otp,
            html:`<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                        </head>
                        <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
                            <table role="presentation"
                            style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
                            <tbody>
                                <tr>
                                <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                                    <tbody>
                                    <tr>
                                        <td style="padding: 40px 0px 0px;">
                                        <div style="text-align: left;">
                                            <div style="padding-bottom: 20px;"><img src="https://i.ibb.co/Qbnj4mz/logo.png" alt="Company" style="width: 56px;"></div>
                                        </div>
                                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                                            <div style="color: rgb(0, 0, 0); text-align: left;">
                                            <h1 style="margin: 1rem 0">Verification code</h1>                       <p style="padding-bottom: 16px">Please use the verification code below to sign in.</p>
                                            <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp}</strong></p>
                                            <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                                            <p style="padding-bottom: 16px">Thanks,<br>The IR team</p>
                                            </div>                 
                                            </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                    </table>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                        </body>
                        </html>`
        })
        return otp;

    } catch (error) {
        console.log(error)
        return false
    }
}



export default mailSenderService;