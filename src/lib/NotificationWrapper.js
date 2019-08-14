const iconPath = '/favicon.ico'

const requestPermission = () => {
    return Notification.requestPermission()
}

const notifyTransactionConfirmed = () => {
    return new Notification('tBTC', {
        body: 'Bitcoin transaction is confirmed!',
        icon: iconPath
    })
}

export { requestPermission, notifyTransactionConfirmed }
