//Price
const toCurrency = price => {
    return new Intl.NumberFormat('en-EN', {
        currency: "usd",
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

//Date
const toDate = date => {
    return new Intl.DateTimeFormat('en-EN', { //for locales also can write: "he-HE-u-ca-hebrew" or "en-EN-u-nu-lath"
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

const $cart = document.querySelector('#cart')
if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id

            fetch('/cart/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
                .then(cart => {
                    if (cart.cars.length) {
                        const html = cart.cars.map(car => {
                            return `<li class="list-group-item">
                                <span class="row row-cols-5">
                                    <span class="col">
                                        ${car.title}
                                    </span>
                                    <span class="col">
                                        ${car.count}
                                    </span>
                                    <span class="col price">
                                        ${toCurrency(car.price)} 
                                    </span>
                                    <span class="col price">
                                        ${toCurrency(car.price * car.count)}
                                    </span>
                                    <span class="col">
                                        <button class="btn btn-primary js-remove" data-id="${car.id}">
                                            Delete
                                        </button>
                                    </span>
                                </span>
                            </li >`
                        }).join('')
                        $cart.querySelector('.liCart').innerHTML = html
                        $cart.querySelector('.price').textContent = toCurrency(cart.price)

                    } else {
                        $cart.innerHTML = '<div>The cart is empty</div>'
                    }

                })
        }

    })
}