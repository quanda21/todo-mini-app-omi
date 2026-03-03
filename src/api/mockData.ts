// Định nghĩa kiểu dữ liệu Todo giống vbot-console (đầy đủ các trường từ API)
export interface TodoItem {
    id: number
    code: string
    title: string
    description: string
    status: 'TO_DO' | 'IN_PROGRESS' | 'DONE' | string
    dueDate: number // timestamp
    assigneeId: string
    createdAt: number
    customerCode?: string
    links?: string
    groupId?: string
    transId?: string
    createdBy?: string
    pluginType?: string
    notificationReceivedAt?: number
    phone?: string
    groupMemberUid?: string
    tagCodes?: string
    files?: string
}

// Helper: 
export function formatCallTitle(title: string): string {
    if (!title) return ''
    // Giới hạn độ dài
    if (title.length > 40) {
        return title.substring(0, 40) + '...'
    }
    return title
}
