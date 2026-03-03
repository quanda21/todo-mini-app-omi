import { tag, Component, bind } from 'omi'
import { formatCallTitle, type TodoItem } from '../api/mockData'
import { tailwind } from '../tailwind'
import { sharedStyle } from '../style/sharedStyle'
import { useTheme } from '../utils/themeSignal'

interface Props {
    todo: TodoItem
}

@tag('todo-card')
export default class extends Component<Props> {
    static css = [tailwind, sharedStyle]

    private disposeTheme?: () => void

    install() {
        this.disposeTheme = useTheme(this)
    }

    uninstall() {
        this.disposeTheme?.()
    }

    @bind
    handleComplete(e: Event) {
        e.stopPropagation()
        this.fire('complete', this.props.todo)
    }

    @bind
    handleClick() {
        this.fire('click', this.props.todo)
    }

    render(props: Props) {
        const { todo } = props
        return (
            <div
                class="mb-3 p-3 rounded-xl bg-vb-secondary-bg border border-vb-section-separator transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                onClick={this.handleClick}
            >
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-vb-accent font-semibold text-sm hover:underline">
                        {todo.code}
                    </span>
                    <span class="text-vb-text font-semibold text-sm truncate flex-1">
                        {formatCallTitle(todo.title)}
                    </span>
                </div>

                <div class="w-full">
                    <button
                        type="button"
                        class="w-full h-9 bg-vb-button text-white font-semibold text-sm rounded-lg transition-all hover:brightness-90 active:scale-[0.98]"
                        onClick={this.handleComplete}
                    >
                        Đánh dấu hoàn thành
                    </button>
                </div>
            </div>
        )
    }
}
