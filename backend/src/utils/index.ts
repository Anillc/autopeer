import _ from 'lodash'
import superagent from 'superagent'
import { Message, SMTPClient } from 'emailjs'

const smtp = new SMTPClient({
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || undefined,
    ssl: true
})

export enum RestCode {
    Ok = 0,
    Error = -1,
    NotAuthorized = -2
}

export class RestResponse {
    public constructor(
        public code: RestCode,
        public message: string,
        public data?: any
    ) { }
}

export const checkFields = (obj: any, names: string[]) => _(obj)
    .at(names)
    .reduce((acc, x) => x !== null && acc, true)

export async function getASNEmail(asn: string) {
    const asinfo = (await superagent.get('https://explorer.burble.com/api/registry/aut-num/AS' + asn)).body['aut-num/AS' + asn]?.Attributes
    if (!asinfo) return false
    const persons = _(asinfo)
        .filter(attr => ['admin-c', 'tech-c'].includes(attr[0]))
        .sortBy(attr => attr[0])
        .map(attr => /^\[(.+)\]\(.+\)$/.exec(attr[1])[1])
        .reverse()
        .value()
    if (persons.length === 0) {
        return false
    }
    const personBody = (await superagent.get('https://explorer.burble.com/api/registry/person/' + persons[0])).body
    if (!personBody) return false
    const personEmail = personBody['person/' + persons[0]]?.Attributes?.find(attr => attr[0] === 'contact')[1]
    return personEmail
}

export function sendVerifyEmail(to: string, token: string) {
    const msg = new Message({
        from: process.env.EMAIL_FROM,
        to: `${to} <${to}>`,
        subject: 'Verify your email',
        text: `your token: ${token}`
    })
    smtp.send(msg, function() { })
}