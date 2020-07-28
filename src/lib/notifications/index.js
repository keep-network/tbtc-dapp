export const iconPath = '/favicon.ico'

export const requestPermission = () => {
    return window.Notification && window.Notification.requestPermission()
}
