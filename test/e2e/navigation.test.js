/* global it beforeAll afterAll */
import ms from 'milliseconds'
import { launch, appUrl } from './puppeteer'

let browser

beforeAll(async () => { browser = await launch() })
afterAll(() => browser.close())

it('Navigation test', async () => {
  // Save 3s per run by using the initial page rather than creating a new one!
  // const page = await browser.newPage()
  const page = (await browser.pages())[0]

  const waitForTitle = title => page.waitForFunction(`document.title === '${title}'`, {timeout: 5000})

  await page.goto(appUrl)
  await waitForTitle('IPFS - Share Files')
}, ms.minutes(1))
