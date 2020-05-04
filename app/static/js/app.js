/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
            <router-link class="nav-link" to="/upload">Upload Photo <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
   `,
    data: function() {
       return {}
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

const UploadForm = Vue.component('upload-form', {
    template: `
    <div>
        <div id="feedback" style="height:5em; margin-bottom: 2em;">
            <div  v-if="success" class="alert alert-success">
                {{ success }}
            </div>
            <div v-if="errors" class="alert alert-danger">
                <ul>
                    <li v-for="(error, index) in errors" :key="index">{{error}}</li>
                </ul>
            </div>
        </div>
        <form @submit.prevent="uploadPhoto" id="uploadForm">
            <div class="form-group">
                <label for="photo">Choose photo</label><br>
                <input type="file" name="photo" id="photo" class="form-control-file">
            </div>
            <div style="margin-top: 2em;" class="form-group">
                <label for="description">Photo description</label><br>
                <textarea 
                    name="description"
                    id="description" 
                    cols="30" rows="10" 
                    form="uploadForm"
                    placeholder="Enter photo description..."
                    class="form-control"></textarea>
            </div>

            <div class="form-group"><input type="submit"></input></div>
        </form>
    </div>
    `,
    data: function() {
        return {
            errors: null,
            success: null
        }
    },
    methods: {
        uploadPhoto: function() {
            // reset feedback variables
            this.errors = null
            this.success = null

            // retrieve form
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            // console.log(form_data)

            // send api request
            fetch('api/upload', {
                method: "POST",
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then((response) => {
                return response.json()
            })
            .then((jsonResponse) => {
                // display success
                // console.log(jsonResponse)
                if(jsonResponse.message) {
                    this.success = jsonResponse.message
                    // alert(jsonResponse.message)
                } else {
                    this.errors = jsonResponse.errors
                    // console.log("ERROR")
                }
            })
            .catch((error) => {
                this.errors = ["Internal system error. Please try later"]
                console.log(error)
            });
        },
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        // Put other routes here
        {path: "/upload", component: UploadForm},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});