import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'

import {EMAIL_SMPT_HOST, EMAIL_SMPT_PASS, EMAIL_SMPT_PORT, EMAIL_SMPT_SECURE, EMAIL_SMPT_SERVICE_NAME, EMAIL_SMPT_USER} from '../env'

const transporter = nodemailer.createTransport({
    service: EMAIL_SMPT_SERVICE_NAME,
    host: EMAIL_SMPT_HOST,
    port: EMAIL_SMPT_PORT,
    secure: EMAIL_SMPT_SECURE,
    auth: {
        user: EMAIL_SMPT_USER,
        pass: EMAIL_SMPT_PASS
    },
    requireTLS: true
})

export interface ISendMail {
    from: string,
    to: string,
    subject: string,
    html: string,
}

export const sendMail = async ({from, to, subject, html}: ISendMail) => {
    const result = await transporter.sendMail({
        from,
        to, 
        subject, 
        html,
    })

    return result

}

export const renderMailHtml = async (template: string, data: any):Promise<string> => {
    const content = await ejs.renderFile(path.join(__dirname, `templates/${template}`), data)

    return content as string
}