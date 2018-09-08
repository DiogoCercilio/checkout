// Utilizei algumas coisas de ES6, pois não foi especificado um suporte mínimo... ;)

Vue.filter('toCurrency', function (val) {
    if (typeof val !== "number") return val;
    return `R$ ${(val).toFixed(2).replace('.',',')}`;
});

new Vue({
    el: "#app",
    data: {
        checkout: [],
        product: [],
        couponChoosed: {},
        modal: {}
    },
    mounted: async function() {

        const data = await this.getFromApi(`/api/checkouts/${this.checkout.id}`);

        this.checkout = data.checkout;
        this.product = data.product;
    },
    methods: {
        updateCoupon: async function(coupon) {

            let apiUrl = `/api/checkouts/${this.checkout.id}`;
            if (coupon) apiUrl += `?couponId=${coupon.id}`;

            const data = await this.getFromApi(apiUrl);

            this.checkout = data.checkout;
            this.product = data.product;
            this.couponChoosed = coupon || {};
        },
        postOperation: async function(type) {

            const reserve = await this.postApi(`/api/checkouts/${this.checkout.id}`, { type });
            let msg;

            // Com mais tempo eu importaria as mensagens de outro arquivo, e criaria enums para os cases...
            switch(reserve.status) {
                case "cancelled":
                    msg = {
                        type: "cancel",
                        icon: "modal-icon modal-icon-cart warning",
                        title: "compra cancelada",
                        content: "o pedido não foi enviado e você não será cobrado"
                    };
                break;

                case "success":
                    msg = {
                        type: "success",
                        icon: "modal-icon modal-icon-cart success",
                        title: "compra confirmada",
                        content: "enviaremos atualizações sobre o pedido para o seu e-mail"
                    };
                break;
                    
                default:
                    msg = { content: "não foi possível processar a solicitação" };
                break;
            }

            this.openModal(msg);
        },
        openModal(msg) {

            this.modal = {
                active: true,
                icon: msg.icon,
                title: msg.title,
                content: msg.content
            };
            this.isModalActive = true;
        },
        closeModal() {      
            if (event.target.className.indexOf("modal-overlay") == -1) return;
            this.modal = { active: false };
        },
        getFromApi(apiUrl) {

            // Usei um XMLHttpRequest aqui, e um fetch abaixo propositalmente... Para mostrar as duas possibilidades de requisição.
            return new Promise((resolve, reject)=> {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", apiUrl);
                xhr.send();
                xhr.onload = (data)=> {
                    if (!data.error) {
                        resolve(JSON.parse(data.currentTarget.response));
                    } else {
                        reject();
                    }
                };
            });
        },
        postApi: async function(apiUrl, body, headers={ 'Accept': 'application/json', 'Content-Type': 'application/json'}) {

            return await fetch(apiUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            }).then(function(response) {
                return response.json();
            });
        }
    }
});