var evenBus = new Vue();

Vue.component('product', {
    props: {
        premium: {
            type: Boolean, 
            required: true
        }
    },
    template: 
    `
    <div class="product">
        <div class="product-image">
            <img :src="image" alt="">
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In stock</p>
            <p v-else>Out of stock</p>
            <p>User is premium: {{ premium }}</p>
            <p>Shipping: {{ shipping }}</p>
            <ul>
                <li v-for="detail in details"> {{ detail }}</li>
            </ul>

            <div class="color-container">
                <div 
                v-for="(variant, index) in variants" 
                :key="variant.variantId"
                class="color-box"
                :style="{backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)">
                </div>
            </div>

            <button 
                v-on:click="addToCart" 
                :disabled="!inStock"
                :class="{ disabledButton: !inStock}">
                Add to Cart</button>
           
        </div>
        
        <product-tabs :reviews="reviews"/>
    </div>
    `, 
    data() {
        return {
            branch: 'Vue Mastery', 
            product: 'Socks', 
            description: 'A pair of warm, fuzzy socks', 
            selectedVariant: 0, 
            details: ["80% cotton", "20% polyester", "Gender-neutral"], 
            variants: [
                {
                    variantId: 2234, 
                    variantColor: "green",
                    variantImage: './assets/vmSocks-green.jpg',
                    variantQuantity: 10
                }, 
                {
                    variantId: 2235, 
                    variantColor: "blue", 
                    variantImage: './assets/vmSocks-blue.jpg', 
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    }, 
    methods: {
        addToCart: function() {
            this.$emit('add-to-cart',this.variants[this.selectedVariant].variantId)
        }, 

        updateProduct: function(index) {
            this.selectedVariant = index
        }
    }, 
    computed: {
        title: function() {
            return this.branch + ' ' + this.product
        }, 

        image: function() {
            return this.variants[this.selectedVariant].variantImage
        }, 

        inStock: function() {
            return this.variants[this.selectedVariant].variantQuantity > 0
        }, 
        shipping: function() {
            if (this.premium) {
                return "free"
            }

            return 2.99
        }
    }, 
    mounted() {
        evenBus.$on('review-submmited', productReview => {
            this.reviews.push(productReview);
        })
    }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        
        <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
            
        <p>
            <input type="submit" value="Submit">  
        </p>    
    </form>
    `, 
    data() {
        return {
            name: null,
            review: null,
            rating: null, 
            errors: []
        }
    }, 
    methods: {
        onSubmit() {
            this.errors = []
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name, 
                    review: this.review, 
                    rating: this.rating
                };
    
                evenBus.$emit('review-submmited', productReview);
    
                this.name = null;
                this.review = null;
                this.rating = null;
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
            
        }
    }
});

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array, 
            default: []
        }
    }, 
    template: `
        <div>
            <span class="tab"
                v-for="(tab, index) in tabs" 
                :key="index"
                :class="{activeTab: selectedTab === tab }"
                @click="selectedTab = tab">
                {{ tab }} </span>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
    
            <product-review 
                v-show="selectedTab === 'Make a Review'"/>
        </div>
    `, 
    data() {
        return {
            tabs: ["Reviews", "Make a Review"],
            selectedTab: 'Reviews'  // set from @click
        }
    }
});

var app = new Vue({
    el: '#app', 
    data: {
        premium: true, 
        cart: []
    }, 
    methods: {
        updateCart: function(id) {
            this.cart.push(id);
        },
    }
})