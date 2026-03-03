import { tag, Component, signal, bind } from 'omi'
import { tailwind } from '../tailwind'
import {
    getAllNoPageTodoAPI,
    getProjectCode,
    markTodoAsComplete,
    isAuthedSignal
} from '../api/todoApi'
import { sharedStyle } from '../style/sharedStyle'
import { useTheme } from '../utils/themeSignal'
import type { TodoItem } from '../api/mockData'
import './TodoCard'

interface Props {
    isAuthed: boolean
}

const todos = signal<TodoItem[]>([])
const loading = signal(false)
const errorMessage = signal('')

@tag('todo-list')
export default class extends Component<Props> {
    static css = [tailwind, sharedStyle]

    static props = {
        isAuthed: {
            type: Boolean,
            default: false
        }
    }

    private disposeTheme?: () => void

    install() {
        this.refreshTodos()
        this.disposeTheme = useTheme(this)
    }

    uninstall() {
        this.disposeTheme?.()
    }

    private _isAuthed = false

    receiveProps() {
        if (this.props.isAuthed && !this._isAuthed) {
            this._isAuthed = true
            this.refreshTodos()
        } else if (!this.props.isAuthed) {
            this._isAuthed = false
        }
    }

    async refreshTodos() {
        if (!isAuthedSignal.value) {
            console.log('[TodoList] Waiting for authentication...')
            return
        }

        if (!getProjectCode()) {
            return
        }

        loading.value = true
        errorMessage.value = ''

        try {
            const data = await getAllNoPageTodoAPI()
            todos.value = data
        } catch (err: any) {
            console.error('[TodoList] Error:', err)
            errorMessage.value = err.message || 'Lỗi khi tải dữ liệu.'
        } finally {
            loading.value = false
        }
    }

    @bind
    async handleComplete(e: CustomEvent) {
        const todo = e.detail as TodoItem
        try {
            await markTodoAsComplete(todo.id)

            // Update local state
            const updatedTodos = todos.value.map(t =>
                t.id === todo.id ? { ...t, status: 'DONE' } : t
            )
            todos.value = updatedTodos

            // SDK Popup notification
            import('@vbotma/sdk').then(({ popup }) => {
                popup.show({
                    message: `Đã hoàn thành: ${todo.title}`,
                    buttons: [{ id: 'ok', type: 'ok' }]
                })
            }).catch(() => { })

        } catch (err: any) {
            console.error('Lỗi khi đánh dấu hoàn thành:', err)
            errorMessage.value = err.message || 'Không thể đánh dấu hoàn thành công việc'
        }
    }

    @bind
    handleClick(e: CustomEvent) {
        const todo = e.detail as TodoItem
        console.log('Click vào công việc:', todo.code)
    }

    render() {
        const activeTodos = todos.value.filter(t => t.status !== 'DONE')

        return (
            <div class="p-4 bg-vb-bg min-h-screen w-full">
                <div class="max-w-2xl mx-auto bg-vb-secondary-bg rounded-xl shadow-sm border border-vb-section-separator overflow-hidden">

                    {!isAuthedSignal.value && !errorMessage.value && (
                        <div class="p-10 flex flex-col items-center justify-center text-vb-hint">
                            <div class="animate-spin h-8 w-8 border-4 border-vb-accent border-t-transparent rounded-full mb-4"></div>
                            <p>Đang xác thực hệ thống...</p>
                        </div>
                    )}

                    {loading.value && (
                        <div class="p-5 animate-pulse">
                            <div class="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                            <div class="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                            <div class="h-4 bg-gray-700 rounded w-5/6"></div>
                        </div>
                    )}

                    {errorMessage.value && (
                        <div class="m-4 p-3 bg-red-900/30 border border-red-500 text-red-200 rounded-lg text-sm">
                            {errorMessage.value}
                        </div>
                    )}

                    {!loading.value && (
                        <div class="p-4 max-h-[calc(100vh-40px)] overflow-y-auto custom-scrollbar">
                            {activeTodos.length > 0 ? (
                                <div class="flex flex-col">
                                    {activeTodos.map(todo => (
                                        <todo-card
                                            key={todo.id}
                                            todo={todo}
                                            onComplete={this.handleComplete}
                                            onClick={this.handleClick}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div class="flex flex-col items-center justify-center py-10 text-vb-hint">
                                    <svg class="w-16 h-16 mb-2 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                                    </svg>
                                    <p>{getProjectCode() ? 'Không có công việc nào cần xử lý' : 'Vui lòng cấu hình dữ liệu'}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
