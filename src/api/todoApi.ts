import { signal } from 'omi'
import axios from 'axios'
import type { TodoItem } from './mockData'

// =============================================
// CẤU HÌNH API
// =============================================

let DEFAULT_BASE_URL = 'https://api-sandbox-h01.vbot.vn/v1.0/'

let authToken = ''
let projectCode = ''

export interface ApiResponse<T> {
    status: number
    msg: string
    data: T
    errorCode: number
}

export interface TokenPayload {
    token: string
    refreshToken?: string
    tokenType?: string
}

/** Signal thông báo đã xác thực thành công (2-step) */
export const isAuthedSignal = signal(false)

const todoApiClient = axios.create({
    baseURL: DEFAULT_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

/**
 * Thiết lập project code
 */
export function setProjectCode(code: string) {
    projectCode = code
}

/**
 * Lấy project code hiện tại
 */
export function getProjectCode(): string {
    return projectCode
}

/**
 * Thiết lập Base URL cho API
 */
export function setApiBaseUrl(url: string) {
    if (url) {
        let formattedUrl = url
        if (!formattedUrl.endsWith('/')) formattedUrl += '/'
        todoApiClient.defaults.baseURL = formattedUrl
        console.log('[TodoAPI] baseURL set to:', formattedUrl)
    }
}

/**
 * Thiết lập token xác thực
 */
export function setAuthToken(token: string, tokenType: string = 'Bearer') {
    authToken = token
    if (token) {
        todoApiClient.defaults.headers.common['Authorization'] = `${tokenType} ${token}`
    } else {
        delete todoApiClient.defaults.headers.common['Authorization']
    }
}

/**
 * Đổi token dùng cho module TODO
 */
export async function getTodoModuleTokenAPI(params: {
    projectCode: string
    uid: string
    type?: string
    source?: string
}): Promise<ApiResponse<TokenPayload>> {
    try {
        const res = await todoApiClient.get<ApiResponse<TokenPayload>>('api/module-todo/token', {
            params: {
                projectCode: params.projectCode,
                uid: params.uid,
                type: 'TODO',
                source: 'Desktop-RTC',
            },
        })
        return res.data
    } catch (error) {
        console.error('[TodoAPI] Error exchange token:', error)
        throw error
    }
}

// =============================================
// API FUNCTIONS
// =============================================

/**
 * Lấy danh sách tất cả công việc (không phân trang)
 */
export async function getAllNoPageTodoAPI(params?: {
    keySearch?: string
    code?: string
}): Promise<TodoItem[]> {
    try {
        console.log('[TodoAPI] Calling getAllNoPage with projectCode:', projectCode)

        const response = await todoApiClient.get('api/module-todo/todo/getAllNoPage', {
            params: {
                projectCode: projectCode,
                keySearch: params?.keySearch || '',
                code: params?.code || ''
            }
        })

        const result = response.data

        if (result?.error === 0 || result?.errorCode === 0) {
            console.log('[TodoAPI] Success, count:', result.data?.length || 0)
            return result.data || []
        }

        console.warn('[TodoAPI] API returned error:', result)
        return []
    } catch (error) {
        console.error('[TodoAPI] Error calling getAllNoPage:', error)
        throw error
    }
}

/**
 * Lấy chi tiết một công việc
 */
export async function getDetailTodoAPI(id: number): Promise<TodoItem> {
    try {
        const response = await todoApiClient.get('api/module-todo/todo/getDetail', {
            params: {
                id,
                projectCode: projectCode
            }
        })

        const result = response.data

        if (result?.error === 0 || result?.errorCode === 0) {
            return result.data
        }

        throw new Error(result?.message || 'Lỗi khi lấy chi tiết công việc')
    } catch (error) {
        console.error('[TodoAPI] Error calling getDetail:', error)
        throw error
    }
}

/**
 * Cập nhật công việc
 */
export async function updateTodoAPI(todo: any): Promise<number> {
    try {
        const response = await todoApiClient.post('api/module-todo/todo/update', {
            ...todo,
            projectCode: projectCode
        })

        const result = response.data

        if (result?.error === 0 || result?.errorCode === 0) {
            return result.data
        }

        throw new Error(result?.message || 'Lỗi khi cập nhật công việc')
    } catch (error) {
        console.error('[TodoAPI] Error calling update:', error)
        throw error
    }
}

/**
 * Đánh dấu công việc là hoàn thành
 */
export async function markTodoAsComplete(todoId: number): Promise<number> {
    try {
        const todo = await getDetailTodoAPI(todoId)

        const result = await updateTodoAPI({
            id: todo.id,
            title: todo.title,
            preFixCode: todo.code?.split('-')[0] || '',
            customerCode: todo.customerCode || '',
            description: todo.description || '',
            files: '',
            tagCodes: '',
            links: todo.links || 'CALL',
            groupId: todo.groupId || '',
            status: 'DONE',
            createdBy: todo.createdBy || '',
            assigneeId: todo.assigneeId || '',
            dueDate: todo.dueDate || 0,
            pluginType: todo.pluginType || '',
            notificationReceivedAt: todo.notificationReceivedAt || 0,
            phone: todo.phone || '',
            groupMemberUid: todo.groupMemberUid || ''
        })

        return result
    } catch (error) {
        console.error('[TodoAPI] Error marking todo as complete:', error)
        throw error
    }
}
