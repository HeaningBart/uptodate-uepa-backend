import axios from 'axios'
import Redis from '@ioc:Adonis/Addons/Redis'

class UpToDateService {
  public async get_logged_in_API() {
    const redis_cookie = await Redis.get('utd_cookie')
    if (!redis_cookie) {
      const new_page = await axios.get('https://www.uptodate.com/login')
      const JSESSIONID = new_page.headers['set-cookie']![0].split('=')[1].split(';')[0]
      const response = await axios.post(
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
      if (response.data.value !== 'true') throw new Error('Unable to log in, try again!')
      await Redis.set('utd_cookie', `JSESSIONID=${JSESSIONID};`, 'EX', '3600')
      return axios.create({
        headers: {
          Cookie: `JSESSIONID=${JSESSIONID};`,
        },
      })
    }
    return axios.create({
      headers: {
        Cookie: redis_cookie,
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

  public async get_image(imageKey: string, topicKey: string) {
    const api = await this.get_logged_in_API()
    const id = imageKey.split('/')[1]
    const html = await api.get(
      `https://www.uptodate.com/services/app/contents/graphic/detailed/${id}/en_us/json?imageKey=${imageKey}&topicKey=${topicKey}&id=${id}`
    )
    return html.data
  }
}

export default new UpToDateService()
