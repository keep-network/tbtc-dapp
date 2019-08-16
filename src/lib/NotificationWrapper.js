const iconPath = '/favicon.ico'

const requestPermission = () => {
    return Notification.requestPermission()
}

const notifyBitcoinAddressReady = () => {
    return emitNotification('Bitcoin address is ready!')
}

const notifyTransactionConfirmed = () => {
    return emitNotification('Bitcoin transaction is confirmed!')
}

function emitNotification(message) {
    return new Notification('tBTC', {
        body: message,
        icon: iconPath
    })
}

export {
    requestPermission,
    notifyBitcoinAddressReady,
    notifyTransactionConfirmed
}
