const toCurrency = price => {
    return new Intl.NumberFormat('en-EN', {
        currency: "usd",
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})