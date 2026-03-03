import { tag, signal, Component, bind } from 'omi'
import { tailwind } from './tailwind'
import { useTheme, themeSignal } from '@/utils/themeSignal'
import { sharedStyle } from '@/style/sharedStyle'
import { setLaunchParams, init, retrieveLaunchParams, LaunchParams } from '@vbotma/sdk'
import { setAuthToken, setProjectCode, setApiBaseUrl, getTodoModuleTokenAPI, isAuthedSignal } from './api/todoApi'
import './components/TodoList'

interface MyAppProps {
  theme?: string
  apiBaseUrl?: string
  accessToken?: string
  tokenType?: string
  projectCode?: string
  uid?: string
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
    apiBaseUrl: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    tokenType: {
      type: String,
    },
    projectCode: {
      type: String,
    },
    uid: {
      type: String,
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

  private disposeTheme?: () => void

  async install() {
    this.disposeTheme = useTheme(this)
    if (this.props.theme) {
      themeSignal.value = this.props.theme
    }

    setLaunchParams({
      launchParams: {
        vbWebAppThemeParams: this.props.vbWebAppThemeParams,
        vbWebAppVersion: this.props.vbWebAppVersion,
        vbWebAppPlatform: this.props.vbWebAppPlatform,
        vbWebAppData: this.props.vbWebAppData,
      },
    })

    init()

    // Cấu hình Base URL
    const baseUrl = this.props.apiBaseUrl
    if (baseUrl) {
      console.log('[App] Setting API Base URL from props:', baseUrl)
      setApiBaseUrl(baseUrl)
    }

    // Bước 1: Set token tạm thời từ host
    if (this.props.accessToken) {
      console.log('[App] Step 1: Setting initial Access Token from props')
      setAuthToken(this.props.accessToken, this.props.tokenType || 'Bearer')
    }

    if (this.props.projectCode) {
      setProjectCode(this.props.projectCode)
    }
  }

  installed() {
    this.safeLoadFlow()
  }

  /**
   * Luồng phối hợp đổi token và tải dữ liệu
   */
  async safeLoadFlow() {
    isAuthedSignal.value = false
    try {
      // Nếu có đầy đủ thông tin để đổi token CDR/Todo
      if (this.props.projectCode && this.props.uid && this.props.accessToken) {
        console.log('[App] Step 2: Exchanging token...')
        const tokenRes = await getTodoModuleTokenAPI({
          projectCode: this.props.projectCode,
          uid: this.props.uid
        })

        if (tokenRes?.data?.token) {
          console.log('[App] Step 3: Token exchange successful')
          setAuthToken(tokenRes.data.token, tokenRes.data.tokenType || 'Bearer')
          isAuthedSignal.value = true
        } else {
          throw new Error('Token exchange failed: No token returned')
        }
      } else {
        console.warn('[App] Missing projectCode, uid or accessToken. Skipping 2-step auth.')
        // Nếu không có quy trình đổi token, vẫn cho phép chạy nếu đã có token (fallback)
        if (this.props.accessToken) {
          isAuthedSignal.value = true
        }
      }
    } catch (e: any) {
      console.error('[App] SafeAuthFlow Error:', e)
      isAuthedSignal.value = false
    }
  }

  receiveProps() {
    console.log('[App] Props updated:', this.props)
    let needsAuth = false

    if (this.props.apiBaseUrl) {
      setApiBaseUrl(this.props.apiBaseUrl)
    }

    if (this.props.accessToken) {
      setAuthToken(this.props.accessToken, this.props.tokenType || 'Bearer')
      needsAuth = true
    }

    if (this.props.projectCode) {
      setProjectCode(this.props.projectCode)
      needsAuth = true
    }

    if (needsAuth) {
      this.safeLoadFlow()
    }
  }

  uninstall() {
    this.disposeTheme?.()
  }

  render() {
    return (
      <div class="flex flex-col bg-vb-bg text-vb-text min-h-screen">
        <todo-list isAuthed={isAuthedSignal.value} />
      </div>
    )
  }
}
