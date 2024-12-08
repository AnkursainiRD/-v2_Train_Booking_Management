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


const mailSenderService=async(mail,template)=>{
    try {
        const transporter =await sendMailConfig()
        const otp=generateOtp(4)
        const info=await transporter.sendMail({
            from:`<${process.env.USER}>`,
            to:`${mail}`,
            subject:"Registration Verification",
            text:otp,
            html:template
        })
        return otp;

    } catch (error) {
        console.log(error)
        return false
    }
}



export default mailSenderService;