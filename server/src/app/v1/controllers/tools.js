import nodemailer from "nodemailer";

const sendMail = async (details) => {
    try {
        const mailDetails = {
            from: process.env.APP_MAIL_USER,
            to: details[0],
            cc: details[1],
            subject: details[2],
            text: details[3],
        };

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.APP_MAIL_USER,
                pass: process.env.APP_MAIL_PASSWORD,
            },
        });

        await mailTransporter.sendMail(mailDetails);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("An error occurred in sendMail function:", error);
    }
};

const getMailAddress = (designation) => {
    console.log(designation, "From Mail.js");

    const designationEmailMap = {
        manager: "dharmateja0202@gmail.com",
        developer: "developer@example.com",
        designer: "designer@example.com",
        tester: "tester@example.com",
        HR: "hr@example.com",
    };

    return designationEmailMap[designation] || null;
};

export { sendMail, getMailAddress };