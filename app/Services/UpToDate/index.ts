import axios from 'axios'
import puppeteer from 'puppeteer'
import Redis from '@ioc:Adonis/Addons/Redis'

class UpToDateService {
  public async get_logged_in_API() {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://www.uptodate.com/login')
    const cookies = await page.cookies()
    await browser.close()
    const session_cookie = cookies.find((cookie) => cookie.name === 'JSESSIONID')
    if (!session_cookie) throw new Error('No Session Cookie found')
    const JSESSIONID = session_cookie.value
    await axios.post(
      `https://www.uptodate.com/services/app/login/json`,
      new URLSearchParams({
        userName: 'gsouzavs',
        password: 'sY4x3w567#b',
        isSubmitting: 'true',
        saveUsername: 'true',
      }).toString(),
      {
        headers: {
          'Cookie': `JSESSIONID=${JSESSIONID};`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    await Redis.set('utd_cookie', `JSESSIONID=${JSESSIONID};`, 'EX', '86400')
    return axios.create({
      headers: {
        Cookie: `JSESSIONID=${JSESSIONID};`,
      },
    })
  }

  public async get_article(article: string) {
    const api = await this.get_logged_in_API()
    const html = await api.get(
      `https://www.uptodate.com/services/app/contents/topic/${article}/json`
    )
    return html.data
  }
}

export default new UpToDateService()
