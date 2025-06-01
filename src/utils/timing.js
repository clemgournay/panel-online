export const Wait = async (delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay)
    })
}