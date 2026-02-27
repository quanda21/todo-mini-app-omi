import { tag, signal, Component, bind } from 'omi'
import viteLogo from '/vite.svg'
import vbotLogo from '/vbot.svg'
import { tailwind } from './tailwind'
import { useTheme, themeSignal } from '@/utils/themeSignal'
import { sharedStyle } from '@/style/sharedStyle'
import { setLaunchParams, init, retrieveLaunchParams, LaunchParams } from '@vbotma/sdk'

declare global {
  interface Window {
    toggleDark(): void
  }
}

const count = signal(0)

interface MyAppProps {
  theme?: string // Dùng dấu '?' để cho biết prop này là tùy chọn (optional)
  vbWebAppThemeParams?: LaunchParams['vbWebAppThemeParams']
  vbWebAppVersion?: LaunchParams['vbWebAppVersion']
  vbWebAppPlatform?: LaunchParams['vbWebAppPlatform']
  vbWebAppData?: string | URLSearchParams | undefined
}

@tag('my-todo-mini-app')
export default class extends Component<MyAppProps> {
  static props = {
    theme: {
      type: String,
      default: 'system',
    },
    vbWebAppThemeParams: {
      type: String,
    },
    vbWebAppVersion: {
      type: String,
    },
    vbWebAppPlatform: {
      type: String,
    },
    vbWebAppData: {
      type: String,
    },
  }

  static css = [tailwind, sharedStyle]

  state = {
    isDark: document.documentElement.classList.contains('dark'),
  }

  private disposeTheme?: () => void

  vbPlatform = signal<string>('')
  vbVersion = signal<string>('')
  vbTheme = signal<LaunchParams['vbWebAppThemeParams'] | null>(null)

  install() {
    this.disposeTheme = useTheme(this)
    if (this.props.theme) {
      themeSignal.value = this.props.theme
    }
    console.log(this.props.vbWebAppData)
    console.log(this.props.vbWebAppPlatform)
    console.log(this.props.vbWebAppVersion)
    console.log(this.props.vbWebAppThemeParams)
    setLaunchParams({
      launchParams: {
        vbWebAppThemeParams: this.props.vbWebAppThemeParams,
        vbWebAppVersion: this.props.vbWebAppVersion,
        vbWebAppPlatform: this.props.vbWebAppPlatform,
        vbWebAppData: this.props.vbWebAppData,
      },
    })

    init()

    const launchParams = retrieveLaunchParams()
    this.vbPlatform.value = launchParams.vbWebAppPlatform
    this.vbVersion.value = launchParams.vbWebAppVersion
    this.vbTheme.value = launchParams.vbWebAppThemeParams
  }

  uninstall() {
    this.disposeTheme?.()
  }

  countUp() {
    count.value += 1
    this.fire('count-event', { message: count.value })
    this.update()
  }

  @bind
  onClick() {
    this.countUp()
  }

  @bind
  toggleDark() {
    console.log('toggle dark mode')
    window.toggleDark()
    this.state.isDark = !this.state.isDark
    this.update()
  }

  render() {
    return (
      <div class="flex bg-vb-bg text-vb-text justify-center border border-dashed border-neutral-700 m-4 p-4 rounded-lg">
        <div class="flex flex-col justify-center w-[50rem] items-center gap-8">
          <div class="flex flex-col items-center">
            <h1 class="text-3xl">Web component</h1>
            <div>
              <a href="https://vbot.vn" target="_blank">
                <img src={vbotLogo} class="logo omi inline-block !h-40" alt="VBot logo" />
              </a>
              <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} class="logo inline-block !h-40" alt="Vite logo" />
              </a>
              <a href="http://omijs.org" target="_blank">
                <img src="https://omi.cdn-go.cn/s/latest/omi.svg" class="logo omi inline-block !h-40" alt="Omi logo" />
              </a>
            </div>
            <h1 class="text-6xl">VBot + Vite + Omi</h1>
          </div>
          <div class="flex gap-2 w-full justify-center border border-red-500 p-4">
            <button
              type="button"
              onClick={this.onClick}
              // className="custom-button-from-host"
              className="custom-button-from-host inline-block rounded bg-success px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#14a44d] transition duration-150 ease-in-out hover:bg-success-600 hover:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] focus:bg-success-600 focus:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] focus:outline-none focus:ring-0 active:bg-success-700 active:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(20,164,77,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)]"
            >
              + 1
            </button>

            <button
              type="button"
              className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              Button
            </button>

            <button
              type="button"
              className="inline-block rounded bg-danger px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#dc4c64] transition duration-150 ease-in-out hover:bg-danger-600 hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:bg-danger-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-danger-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(220,76,100,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)]"
            >
              Danger
            </button>
            <div id="theme-switcher" onClick={this.toggleDark} class="w-8">
              <button
                class="rounded-2 flex items-center justify-center whitespace-nowrap px-1.5 py-2 uppercase text-neutral-500 transition duration-150 ease-in-out hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 sm:p-2"
                type="button"
                id="themeSwitcher"
                data-te-dropdown-toggle-ref=""
                data-te-dropdown-position="dropend"
                aria-expanded="false"
              >
                {!this.state.isDark && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="inline-block h-5 w-5"
                  >
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"></path>
                  </svg>
                )}

                {this.state.isDark && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="inline-block h-4 w-4"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>count is {count.value}</div>
          <div>
            <p>
              Edit <code>src/app.tsx</code> and save to test HMR
            </p>
          </div>
          <p class="read-the-docs">Click on the logos to learn more</p>
          <div>
            <p>vbPlatform: {this.vbPlatform.value}</p>
            <p>vbVersion: {this.vbVersion.value}</p>
            <p>vbTheme: {JSON.stringify(this.vbTheme.value)}</p>
          </div>
        </div>
      </div>
    )
  }
}
